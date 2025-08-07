import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA, LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAIEmbeddings
from chromadb import Client
from chromadb.config import Settings

load_dotenv()  # ensures OPENAI_API_KEY is set

# Initialize LLM + embeddings + Chroma once
llm = ChatOpenAI(model_name="gpt-4")
embeddings = OpenAIEmbeddings()
chroma = Client(Settings())
collection = chroma.get_or_create_collection("pr-diffs")

# Prompt template for summaries
_summary_prompt = PromptTemplate(
    input_variables=["chunks"],
    template=(
        "You are an expert code reviewer. Summarize the intent and key changes "
        "in these diff chunks:\n\n{chunks}\n\nProvide a concise summary."
    )
)

def make_summary(pr_number: int, top_k: int = 5) -> str:
    """Retrieve top-K chunks from Chroma and generate a summary."""
    results = collection.query(
        where={"pr": pr_number},
        n_results=top_k
    )
    chunks = results["documents"][0]  # list of chunk texts
    chain = LLMChain(llm=llm, prompt=_summary_prompt)
    return chain.run(chunks="\n\n".join(chunks))

def make_retrieval_qa(pr_number: int, question: str, top_k: int = 5) -> str:
    """Answer an ad-hoc question about this PR using RetrievalQA."""
    retriever = collection.as_retriever(
        embeddings=embeddings,
        search_kwargs={"where": {"pr": pr_number}, "k": top_k}
    )
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
    )
    return qa.run(question)
