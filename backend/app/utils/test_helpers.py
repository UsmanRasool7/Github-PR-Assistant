"""
Test utility functions for the GitHub PR Assistant.

This module provides helper functions for testing the AI code review system.
"""

def calculate_code_complexity(lines_of_code: int, cyclomatic_complexity: int) -> str:
    """
    Calculate the overall complexity score for a code file.
    
    Args:
        lines_of_code (int): Number of lines in the code file
        cyclomatic_complexity (int): Cyclomatic complexity score
        
    Returns:
        str: Complexity level (low, medium, high, very_high)
    """
    if lines_of_code < 50 and cyclomatic_complexity < 5:
        return "low"
    elif lines_of_code < 200 and cyclomatic_complexity < 15:
        return "medium"
    elif lines_of_code < 500 and cyclomatic_complexity < 25:
        return "high"
    else:
        return "very_high"

def format_review_score(score: float) -> str:
    """
    Format a review score into a human-readable string.
    
    Args:
        score (float): Review score between 0.0 and 1.0
        
    Returns:
        str: Formatted score with emoji
    """
    if score >= 0.9:
        return f"🌟 Excellent ({score:.1%})"
    elif score >= 0.7:
        return f"✅ Good ({score:.1%})"
    elif score >= 0.5:
        return f"⚠️ Needs Improvement ({score:.1%})"
    else:
        return f"❌ Poor ({score:.1%})"

class CodeReviewMetrics:
    """Class to track and calculate code review metrics."""
    
    def __init__(self):
        self.total_lines_reviewed = 0
        self.issues_found = 0
        self.suggestions_made = 0
        
    def add_review_data(self, lines: int, issues: int, suggestions: int):
        """Add data from a single review."""
        self.total_lines_reviewed += lines
        self.issues_found += issues
        self.suggestions_made += suggestions
        
    def get_issue_rate(self) -> float:
        """Calculate the rate of issues per line of code."""
        if self.total_lines_reviewed == 0:
            return 0.0
        return self.issues_found / self.total_lines_reviewed
        
    def get_summary(self) -> dict:
        """Get a summary of all metrics."""
        return {
            "total_lines": self.total_lines_reviewed,
            "total_issues": self.issues_found,
            "total_suggestions": self.suggestions_made,
            "issue_rate": self.get_issue_rate(),
            "suggestion_rate": self.suggestions_made / max(self.total_lines_reviewed, 1)
        }
