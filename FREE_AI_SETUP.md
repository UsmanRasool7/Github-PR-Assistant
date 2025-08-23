# 🚀 Free AI Setup Guide

## 🎯 100% Free AI Stack Overview

This setup uses **ZERO paid APIs** and runs everything locally:

- **🧠 LLM**: Ollama (LLaMA 3.2 or Mistral)
- **📊 Embeddings**: sentence-transformers/all-MiniLM-L6-v2  
- **🗄️ Vector DB**: ChromaDB
- **⚡ Result**: Semantic search + AI code reviews - completely free!

## 📋 Setup Steps

### 1. Install Ollama

**Windows:**
```bash
# Download and install from: https://ollama.com/
# Or using winget:
winget install Ollama.Ollama
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull a Model

After installing Ollama, pull a model:

```bash
# Recommended: LLaMA 3.2 (3B parameters - good balance)
ollama pull llama3.2

# Alternative: Mistral (7B parameters - more powerful)
ollama pull mistral

# Lightweight: LLaMA 3.2 1B (fastest)
ollama pull llama3.2:1b
```

### 3. Start Ollama Service

```bash
# Start Ollama in background
ollama serve
```

### 4. Test Your Setup

Make a test request to verify everything works:

```bash
curl -X POST http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "Hello!"}]
}'
```

## 🔧 Configuration

The system will automatically:
- Download `sentence-transformers/all-MiniLM-L6-v2` on first use
- Connect to your local Ollama instance
- Store embeddings in ChromaDB locally

No API keys required! 🎉

## 📊 Performance Expectations

| Component | Speed | Quality | Cost |
|-----------|--------|---------|------|
| **Embeddings** | ⚡ Fast | 🎯 Excellent | 💰 Free |
| **LLM (llama3.2)** | 🚀 Very Fast | 📈 Very Good | 💰 Free |
| **Vector Search** | ⚡ Lightning | 🎯 Excellent | 💰 Free |

## 🎯 Model Recommendations

- **Best Overall**: `llama3.2` (3B) - Great quality, good speed
- **Fastest**: `llama3.2:1b` (1B) - Ultra-fast, decent quality  
- **Highest Quality**: `mistral` (7B) - Slower but best results
- **Balanced**: `llama3.1` (8B) - Good middle ground

## 🚀 Usage

Once setup is complete, your PR Assistant will:

1. **Ingest**: Use sentence-transformers for embeddings (local + fast)
2. **Store**: Save in ChromaDB for semantic search
3. **Query**: Use Ollama LLM for intelligent responses
4. **Result**: Professional code reviews with zero API costs!

## 🆘 Troubleshooting

**Issue**: "Connection refused to Ollama"  
**Solution**: Make sure `ollama serve` is running

**Issue**: "Model not found"  
**Solution**: Pull the model first: `ollama pull llama3.2`

**Issue**: "Out of memory"  
**Solution**: Try smaller model: `ollama pull llama3.2:1b`

---

✅ **You now have a production-ready AI code review system that costs $0 to run!**
