import os
import openai
from typing import List

class GrokClient:
    """Custom client for Grok API using OpenAI-compatible interface"""
    
    def __init__(self):
        self.api_key = os.getenv("GROK_API_KEY")
        self.base_url = os.getenv("GROK_BASE_URL", "https://api.x.ai/v1")
        
        if not self.api_key:
            raise ValueError("GROK_API_KEY not set in environment variables")
        
        # Initialize OpenAI client with Grok endpoints
        self.client = openai.OpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        )
    
    def chat_completion(self, messages: List[dict], model: str = "grok-beta") -> str:
        """Create a chat completion using Grok API"""
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Grok API error: {str(e)}")
    
    def generate_summary(self, chunks: List[str]) -> str:
        """Generate a summary of code diff chunks"""
        chunks_text = "\n\n".join(chunks)
        
        messages = [
            {
                "role": "system", 
                "content": "You are an expert code reviewer. Analyze the provided code diff chunks and provide a concise summary of the changes, their intent, and potential impact."
            },
            {
                "role": "user", 
                "content": f"Please summarize these code diff chunks:\n\n{chunks_text}"
            }
        ]
        
        return self.chat_completion(messages)
    
    def answer_question(self, chunks: List[str], question: str) -> str:
        """Answer a question about the code changes"""
        chunks_text = "\n\n".join(chunks)
        
        messages = [
            {
                "role": "system", 
                "content": "You are an expert code reviewer. Answer questions about code changes based on the provided diff chunks."
            },
            {
                "role": "user", 
                "content": f"Based on these code diff chunks:\n\n{chunks_text}\n\nQuestion: {question}"
            }
        ]
        
        return self.chat_completion(messages)

# Global instance
grok_client = None

def get_grok_client():
    """Get or create Grok client instance"""
    global grok_client
    if grok_client is None:
        grok_client = GrokClient()
    return grok_client
