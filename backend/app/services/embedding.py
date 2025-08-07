from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from chromadb import Client
from chromadb.config import Settings

# ── INITIALIZE ONCE ───────────────────────────────────────────────────────────
# 1) Text splitter: breaks large diffs into ~1,000-char chunks with some overlap
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

# 2) Embedding model (will be initialized when needed)
embeddings = None

# 3) ChromaDB client
chroma_client = Client(Settings())
# Create (or get) a collection named "pr-diffs"
collection = chroma_client.get_or_create_collection("pr-diffs")

def get_embeddings():
    """Lazy initialization of embeddings to avoid API key errors at startup"""
    global embeddings
    if embeddings is None:
        embeddings = OpenAIEmbeddings()
    return embeddings

# ── INGEST FUNCTION ───────────────────────────────────────────────────────────
def ingest_diff(pr_number: int, diff_text: str):
    """
    1) Split the diff into chunks.
    2) Embed each chunk.
    3) Upsert into Chroma with metadata = {'pr': pr_number}.
    """
    chunks = text_splitter.split_text(diff_text)
    embeddings_model = get_embeddings()

    # Build the payloads: one document per chunk
    docs = []
    for i, chunk in enumerate(chunks):
        docs.append({
            "id": f"{pr_number}-{i}",              # unique ID
            "metadata": {"pr": pr_number, "idx": i},
            "embedding": embeddings_model.embed_query(chunk),  # convert text → vector
            "document": chunk                      # store the raw chunk
        })

    # Upsert into ChromaDB
    collection.upsert(documents=docs)
