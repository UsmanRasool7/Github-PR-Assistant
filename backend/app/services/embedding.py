from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from chromadb import Client
from chromadb.config import Settings
import numpy as np

# ── INITIALIZE ONCE ───────────────────────────────────────────────────────────
# 1) Text splitter: breaks large diffs into ~1,000-char chunks with some overlap
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

# 2) Local embedding model (fast + free)
embedding_model = None

# 3) ChromaDB client
chroma_client = Client(Settings())
# Create (or get) a collection named "pr-diffs"
collection = chroma_client.get_or_create_collection("pr-diffs")

def get_embedding_model():
    """Lazy initialization of local embedding model"""
    global embedding_model
    if embedding_model is None:
        print("Loading sentence-transformers model (first time may take a moment)...")
        embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        print("✅ Local embedding model loaded successfully!")
    return embedding_model

def _filter_binary_files(diff_text: str) -> str:
    """Filter out binary files and clean up the diff text"""
    lines = diff_text.split('\n')
    filtered_lines = []
    current_file_is_binary = False
    
    for line in lines:
        # Check for new file
        if line.startswith('diff --git'):
            # Check if this is a binary file we should skip
            binary_extensions = ['.pyc', '.pyo', '.pyd', '.so', '.dll', '.exe', '.bin', 
                                '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.tar', '.gz']
            current_file_is_binary = any(ext in line for ext in binary_extensions)
            
            if not current_file_is_binary:
                filtered_lines.append(line)
        
        # Skip binary file content
        elif current_file_is_binary:
            continue
        
        # Skip binary file indicators
        elif 'Binary files' in line and 'differ' in line:
            continue
        
        # Keep text content
        else:
            filtered_lines.append(line)
    
    return '\n'.join(filtered_lines)

# ── INGEST FUNCTION ───────────────────────────────────────────────────────────
def ingest_diff(pr_number: int, diff_text: str):
    """
    1) Filter out binary files from the diff.
    2) Split the remaining diff into chunks.
    3) Embed each chunk using local sentence-transformers.
    4) Upsert into Chroma with metadata = {'pr': pr_number}.
    """
    # Filter out binary files and clean the diff
    cleaned_diff = _filter_binary_files(diff_text)
    
    if not cleaned_diff.strip():
        print(f"No meaningful content found for PR #{pr_number} after filtering")
        return
    
    chunks = text_splitter.split_text(cleaned_diff)
    embeddings_model = get_embedding_model()

    # Generate embeddings using local model (free!)
    chunk_embeddings = embeddings_model.encode(chunks)
    
    # Build the payloads: one document per chunk
    ids = []
    documents = []
    metadata_list = []
    embeddings_list = []
    
    for i, (chunk, embedding) in enumerate(zip(chunks, chunk_embeddings)):
        chunk_id = f"{pr_number}-{i}"
        ids.append(chunk_id)
        documents.append(chunk)
        metadata_list.append({"pr": pr_number, "idx": i})
        embeddings_list.append(embedding.tolist())  # Convert numpy array to list

    # Upsert into ChromaDB
    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadata_list,
        embeddings=embeddings_list
    )
    
    print(f"✅ Successfully ingested {len(chunks)} chunks for PR #{pr_number} using local embeddings")

def get_pr_chunks(pr_number: int, top_k: int = 5) -> list:
    """Retrieve stored chunks for a PR using ChromaDB"""
    try:
        # Use get() to retrieve all documents for a specific PR
        results = collection.get(
            where={"pr": pr_number},
            limit=top_k
        )
        
        if results and results.get("documents"):
            return results["documents"]
        return []
        
    except Exception as e:
        print(f"Error retrieving PR chunks: {e}")
        return []

def semantic_search_pr(pr_number: int, query: str, top_k: int = 5) -> list:
    """Perform semantic search within a PR's chunks"""
    try:
        embeddings_model = get_embedding_model()
        query_embedding = embeddings_model.encode([query])
        
        results = collection.query(
            where={"pr": pr_number},
            query_embeddings=query_embedding.tolist(),
            n_results=top_k
        )
        
        if results and results.get("documents"):
            return results["documents"][0] if results["documents"] else []
        return []
        
    except Exception as e:
        print(f"Error in semantic search: {e}")
        return []
