import os
import re
from typing import List, Dict
from sentence_transformers import SentenceTransformer
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import torch

class LocalLLMService:
    """Free local LLM service using Hugging Face transformers - no API calls needed"""
    
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")
        
        # Initialize a lightweight model for summarization
        self.summarizer = None
        self.generator = None
        self._init_models()
    
    def _init_models(self):
        """Initialize models lazily to avoid startup delays"""
        try:
            # Use a lightweight model for text generation
            print("Loading local LLM models...")
            
            # For summarization - lightweight and efficient
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=0 if self.device == "cuda" else -1,
                max_length=512,
                min_length=50
            )
            
            # For text generation - using a smaller model for speed
            self.generator = pipeline(
                "text-generation",
                model="microsoft/DialoGPT-medium",
                device=0 if self.device == "cuda" else -1,
                max_length=1000,
                temperature=0.7,
                do_sample=True,
                pad_token_id=50256
            )
            
            print("Local LLM models loaded successfully!")
            
        except Exception as e:
            print(f"Error loading models: {e}")
            # Fallback to rule-based approach
            self.summarizer = None
            self.generator = None
    
    def _clean_diff_text(self, text: str) -> str:
        """Clean and format diff text for better processing"""
        if not text or not text.strip():
            return ""
        
        lines = text.split('\n')
        meaningful_lines = []
        current_file = None
        skip_binary = False
        
        for line in lines:
            line = line.strip()
            
            # Detect file headers
            if line.startswith('diff --git'):
                current_file = line
                # Check if this is a binary file we should skip
                binary_extensions = ['.pyc', '.pyo', '.pyd', '.so', '.dll', '.exe', '.bin', 
                                   '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.tar', '.gz']
                skip_binary = any(ext in line.lower() for ext in binary_extensions)
                
                if not skip_binary:
                    # Extract clean file names
                    try:
                        parts = line.split()
                        if len(parts) >= 4:
                            file_a = parts[2].replace('a/', '')
                            file_b = parts[3].replace('b/', '')
                            meaningful_lines.append(f"Modified file: {file_b}")
                    except:
                        meaningful_lines.append("File modified")
                continue
            
            # Skip binary files completely
            if skip_binary:
                continue
            
            # Skip binary file indicators and index lines
            if any(indicator in line for indicator in ['Binary files', 'differ', 'index ']):
                continue
            
            # Handle file path lines
            if line.startswith('---') or line.startswith('+++'):
                if line.startswith('---'):
                    file_path = line[4:].strip()
                    if file_path.startswith('a/'):
                        file_path = file_path[2:]
                    if file_path != '/dev/null':
                        meaningful_lines.append(f"Original: {file_path}")
                elif line.startswith('+++'):
                    file_path = line[4:].strip()
                    if file_path.startswith('b/'):
                        file_path = file_path[2:]
                    if file_path != '/dev/null':
                        meaningful_lines.append(f"Modified: {file_path}")
                continue
            
            # Handle hunk headers
            if line.startswith('@@'):
                # Extract line numbers
                try:
                    hunk_info = line.split('@@')[1].strip()
                    meaningful_lines.append(f"Changes at: {hunk_info}")
                except:
                    meaningful_lines.append("Code section changed")
                continue
            
            # Handle actual code changes
            if line.startswith('+') and not line.startswith('+++'):
                # Added line
                code_line = line[1:].strip()
                if self._is_readable_code(code_line):
                    meaningful_lines.append(f"Added: {code_line}")
            elif line.startswith('-') and not line.startswith('---'):
                # Removed line
                code_line = line[1:].strip()
                if self._is_readable_code(code_line):
                    meaningful_lines.append(f"Removed: {code_line}")
            elif line.startswith(' '):
                # Context line
                code_line = line[1:].strip()
                if self._is_readable_code(code_line) and len(meaningful_lines) < 80:
                    meaningful_lines.append(f"Context: {code_line}")
        
        return '\n'.join(meaningful_lines[:100])  # Limit to 100 lines
    
    def _is_readable_code(self, line: str) -> bool:
        """Check if a line contains readable code (not binary garbage)"""
        if not line or len(line.strip()) < 1:
            return False
        
        # Skip very long lines that might be minified code
        if len(line) > 200:
            return False
        
        # Check for common code patterns
        code_indicators = ['import', 'from', 'def ', 'class ', 'if ', 'for ', 'while ', 
                          'return', 'print', 'function', 'const ', 'let ', 'var ', 
                          '{', '}', '(', ')', ';', '=', ':', '//']
        
        # If it contains common code patterns, it's likely readable
        if any(indicator in line for indicator in code_indicators):
            return True
        
        # Check character composition
        printable_chars = sum(1 for c in line if c.isprintable() or c.isspace())
        if len(line) > 5 and printable_chars / len(line) < 0.8:
            return False
        
        # Skip lines with too many special characters (likely binary)
        special_char_count = sum(1 for c in line if not (c.isalnum() or c.isspace() or c in '.,;:()[]{}+-=/<>?!@#$%^&*_|\\"\' '))
        if len(line) > 10 and special_char_count / len(line) > 0.4:
            return False
        
        return True
    
    def _rule_based_summary(self, chunks: List[str]) -> str:
        """Generate a detailed summary by parsing actual diff format"""
        if not chunks:
            return "No changes detected in this pull request."
        
        # Combine all chunks
        full_text = '\n'.join(chunks)
        
        # Parse the diff properly
        files_changed = {}
        current_file = None
        
        for line in full_text.split('\n'):
            # Track current file from diff header
            if line.startswith('diff --git'):
                # Extract file path from "diff --git a/file b/file"
                parts = line.split()
                if len(parts) >= 4:
                    file_path = parts[3]  # b/path/to/file
                    if file_path.startswith('b/'):
                        file_path = file_path[2:]
                    current_file = file_path
                    if current_file not in files_changed:
                        files_changed[current_file] = {'added': 0, 'removed': 0, 'changes': []}
            
            # Count actual code changes (not headers)
            elif line.startswith('+') and not line.startswith('+++') and current_file:
                files_changed[current_file]['added'] += 1
                # Store actual change content (first 60 chars)
                change_content = line[1:].strip()
                if change_content:  # Only non-empty changes
                    short_content = change_content[:60] + "..." if len(change_content) > 60 else change_content
                    files_changed[current_file]['changes'].append(f"➕ {short_content}")
            
            elif line.startswith('-') and not line.startswith('---') and current_file:
                files_changed[current_file]['removed'] += 1
                # Store actual change content (first 60 chars)
                change_content = line[1:].strip()
                if change_content:  # Only non-empty changes
                    short_content = change_content[:60] + "..." if len(change_content) > 60 else change_content
                    files_changed[current_file]['changes'].append(f"➖ {short_content}")
        
        # Calculate totals
        total_added = sum(f['added'] for f in files_changed.values())
        total_removed = sum(f['removed'] for f in files_changed.values())
        
        # Analyze change types
        change_types = []
        all_changes = '\n'.join(['\n'.join(f['changes']) for f in files_changed.values()])
        
        if 'import' in all_changes.lower() or 'from ' in all_changes:
            change_types.append("📦 Import statements")
        if any(keyword in all_changes for keyword in ['def ', 'function ', 'async def']):
            change_types.append("🔧 Function definitions")
        if 'class ' in all_changes:
            change_types.append("📋 Class definitions")
        if any(keyword in all_changes.lower() for keyword in ['test', 'spec', 'describe', 'it(']):
            change_types.append("🧪 Test code")
        if any(keyword in all_changes for keyword in ['return', 'if ', 'for ', 'while ']):
            change_types.append("⚙️ Logic changes")
        if any(keyword in all_changes.lower() for keyword in ['config', 'settings', '.json', '.yml', '.yaml']):
            change_types.append("⚙️ Configuration")
        if any(keyword in all_changes for keyword in ['#', '//', '/*']):
            change_types.append("� Comments")
        
        # Generate summary
        summary_parts = []
        summary_parts.append("## 🔍 Code Review Summary")
        summary_parts.append("")
        
        if files_changed:
            summary_parts.append(f"**📁 Files Modified:** {len(files_changed)}")
            summary_parts.append("")
            
            # Show detailed file changes
            for file_path, changes in list(files_changed.items())[:3]:  # Show first 3 files
                summary_parts.append(f"### 📄 `{file_path}`")
                if changes['added'] > 0:
                    summary_parts.append(f"- ✅ **{changes['added']}** lines added")
                if changes['removed'] > 0:
                    summary_parts.append(f"- ❌ **{changes['removed']}** lines removed")
                
                # Show sample changes
                sample_changes = [c for c in changes['changes'] if c.strip()][:3]  # First 3 non-empty changes
                if sample_changes:
                    summary_parts.append("- 📝 **Key changes:**")
                    for change in sample_changes:
                        summary_parts.append(f"  - `{change}`")
                summary_parts.append("")
            
            if len(files_changed) > 3:
                remaining_files = list(files_changed.keys())[3:]
                summary_parts.append(f"**Additional files:** {', '.join([f'`{f}`' for f in remaining_files[:5]])}")
                if len(remaining_files) > 5:
                    summary_parts.append(f"... and {len(remaining_files) - 5} more")
                summary_parts.append("")
        
        summary_parts.append(f"**📊 Overall Statistics:**")
        summary_parts.append(f"- ✅ Total lines added: **{total_added}**")
        summary_parts.append(f"- ❌ Total lines removed: **{total_removed}**")
        summary_parts.append(f"- 📈 Net change: **{total_added - total_removed:+d}** lines")
        summary_parts.append("")
        
        if change_types:
            summary_parts.append(f"**🏷️ Change Types:**")
            for change_type in change_types:
                summary_parts.append(f"- {change_type}")
            summary_parts.append("")
        
        # Add insights based on actual changes
        if total_added > total_removed * 2:
            summary_parts.append("**💡 Analysis:** This appears to be a **feature addition** with significant new code.")
        elif total_removed > total_added * 2:
            summary_parts.append("**💡 Analysis:** This appears to be a **code cleanup** or removal of functionality.")
        elif abs(total_added - total_removed) < 5:
            summary_parts.append("**💡 Analysis:** This appears to be a **refactoring** or minor modification.")
        elif total_added == total_removed:
            summary_parts.append("**💡 Analysis:** This appears to be a **code replacement** or format change.")
        else:
            summary_parts.append("**💡 Analysis:** This PR contains a **mixed set of changes** with both additions and removals.")
        
        summary_parts.append("")
        summary_parts.append("*Generated using rule-based analysis - no API calls required*")
        
        return '\n'.join(summary_parts)
    
    def generate_summary(self, chunks: List[str]) -> str:
        """Generate a summary of code diff chunks"""
        try:
            if not chunks:
                return "No code changes to summarize."
            
            # Use rule-based approach only (more reliable for code analysis)
            # ML models for general text summarization don't work well for code diffs
            return self._rule_based_summary(chunks)
            
        except Exception as e:
            return f"Error generating summary: {str(e)}"
    
    def answer_question(self, chunks: List[str], question: str) -> str:
        """Answer a question about the code changes"""
        try:
            if not chunks:
                return "No code changes available to answer questions about."
            
            # Use rule-based approach only for reliability
            # ML text generation models hallucinate on code analysis tasks
            
            # Combine all chunks for analysis
            full_text = '\n'.join(chunks)
            question_lower = question.lower()
            
            if 'what' in question_lower and 'change' in question_lower:
                return self._rule_based_summary(chunks)
            elif 'how many' in question_lower:
                added = len([line for line in full_text.split('\n') if line.startswith('+') and not line.startswith('+++')])
                removed = len([line for line in full_text.split('\n') if line.startswith('-') and not line.startswith('---')])
                return f"**Answer:** This PR contains {added} added lines and {removed} removed lines."
            elif 'file' in question_lower:
                files = set()
                for line in full_text.split('\n'):
                    if line.startswith('+++') or line.startswith('---'):
                        parts = line.split()
                        if len(parts) > 1:
                            file_path = parts[1]
                            if file_path.startswith('a/') or file_path.startswith('b/'):
                                file_path = file_path[2:]
                            if file_path and file_path != '/dev/null':
                                files.add(file_path)
                return f"**Answer:** Files modified: {', '.join(list(files))}"
            elif 'add' in question_lower:
                added_lines = []
                for line in full_text.split('\n'):
                    if line.startswith('+') and not line.startswith('+++'):
                        added_lines.append(line[1:].strip())
                if added_lines:
                    return f"**Answer:** Added content includes:\n" + "\n".join(f"- `{line}`" for line in added_lines[:5])
                else:
                    return f"**Answer:** No lines were added in this PR."
            elif 'remove' in question_lower or 'delete' in question_lower:
                removed_lines = []
                for line in full_text.split('\n'):
                    if line.startswith('-') and not line.startswith('---'):
                        removed_lines.append(line[1:].strip())
                if removed_lines:
                    return f"**Answer:** Removed content includes:\n" + "\n".join(f"- `{line}`" for line in removed_lines[:5])
                else:
                    return f"**Answer:** No lines were removed in this PR."
            else:
                return f"**Answer:** I can analyze this PR's changes. Try asking:\n- 'What changed?'\n- 'How many lines were added/removed?'\n- 'Which files were modified?'\n- 'What was added?'\n- 'What was removed?'"
            
        except Exception as e:
            return f"Error answering question: {str(e)}"

# Global instance
local_llm_service = None

def get_local_llm_service():
    """Get or create local LLM service instance"""
    global local_llm_service
    if local_llm_service is None:
        local_llm_service = LocalLLMService()
    return local_llm_service
