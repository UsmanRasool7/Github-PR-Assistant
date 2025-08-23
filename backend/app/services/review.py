import os
from dotenv import load_dotenv
import ollama
from .embedding import get_pr_chunks, semantic_search_pr

load_dotenv()

# Enhanced prompt templates
SUMMARY_PROMPT = """You are an expert code reviewer analyzing a GitHub pull request. 

Based on the following diff chunks, provide a comprehensive code review summary:

{chunks}

Please provide:
1. 🔍 **Overview**: Brief description of what changed
2. 📁 **Files & Components**: Key files and components affected  
3. 🔧 **Change Type**: Type of changes (feature, bugfix, refactor, etc.)
4. ⚠️ **Potential Concerns**: Any issues or improvements needed
5. ✅ **Overall Assessment**: Final assessment and recommendations

Format your response in clear markdown with appropriate headers and emojis.
"""

QA_PROMPT = """You are an expert code reviewer. Based on the following code changes context, answer the user's question accurately and comprehensively.

Code changes context:
{context}

Question: {question}

Please provide a detailed and helpful answer based on the code changes shown above. Use markdown formatting and be specific about file names, functions, and changes when relevant.
"""

def get_ollama_response(prompt: str, model: str = "llama3.2") -> str:
    """Get response from Ollama (local LLM)"""
    try:
        response = ollama.chat(model=model, messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ])
        return response['message']['content']
    except Exception as e:
        # Fallback to a simpler model if llama3.2 is not available
        try:
            response = ollama.chat(model="llama3.1", messages=[
                {
                    'role': 'user', 
                    'content': prompt
                }
            ])
            return response['message']['content']
        except Exception as e2:
            return f"❌ **Ollama Error**: {str(e2)}\n\n💡 **Solution**: Make sure Ollama is running and has a model installed:\n```bash\n# Install Ollama\n# Then pull a model:\nollama pull llama3.2\n# Or: ollama pull mistral\n```"

def make_summary(pr_number: int, top_k: int = 5) -> str:
    """Generate PR summary using local Ollama LLM + ChromaDB semantic search"""
    try:
        # Get chunks using ChromaDB with local embeddings
        chunks = get_pr_chunks(pr_number, top_k)
        
        if not chunks:
            return f"## ❌ No Data Found\n\nNo diff data found for PR #{pr_number}. Please ensure the PR webhook was processed correctly."
        
        # Generate summary using Ollama (local LLM)
        prompt = SUMMARY_PROMPT.format(chunks="\n\n".join(chunks))
        summary = get_ollama_response(prompt)
        
        return f"# 🤖 AI Review Summary for PR #{pr_number}\n\n{summary}\n\n---\n*Generated using Ollama (local LLM) + ChromaDB with sentence-transformers embeddings - 100% free!*"
        
    except Exception as e:
        return f"## ❌ Error Generating Summary\n\nError for PR #{pr_number}: {str(e)}"

def make_retrieval_qa(pr_number: int, question: str, top_k: int = 5) -> str:
    """Answer questions using semantic search + local Ollama LLM"""
    try:
        # Use semantic search to find most relevant chunks for the question
        relevant_chunks = semantic_search_pr(pr_number, question, top_k)
        
        if not relevant_chunks:
            # Fallback to regular retrieval if semantic search fails
            relevant_chunks = get_pr_chunks(pr_number, top_k)
        
        if not relevant_chunks:
            return f"## ❌ No Data Available\n\nNo diff data found for PR #{pr_number}. Please ensure the PR webhook was processed correctly."
        
        # Answer question using Ollama with relevant context
        prompt = QA_PROMPT.format(
            context="\n\n".join(relevant_chunks),
            question=question
        )
        answer = get_ollama_response(prompt)
        
        return f"## 💬 Q&A for PR #{pr_number}\n\n**Question:** {question}\n\n{answer}\n\n---\n*Generated using semantic search + Ollama local LLM*"
        
    except Exception as e:
        return f"## ❌ Error Answering Question\n\nError for PR #{pr_number}: {str(e)}"
