"""
Classifier Agent
================
Classifies a parsed failure into one of 6 exact bug types.
"""

import re
from typing import Any

BUG_TYPES = ["LINTING", "SYNTAX", "LOGIC", "TYPE_ERROR", "IMPORT", "INDENTATION"]


class ClassifierAgent:
    """
    Identifies the exact bug type from a failure record.
    Returns one of: LINTING | SYNTAX | LOGIC | TYPE_ERROR | IMPORT | INDENTATION
    """

    RULES = [
        ("IMPORT",      [r"ImportError", r"ModuleNotFoundError", r"Cannot find module",
                          r"No module named", r"from .+ import", r"require\("]),
        ("INDENTATION", [r"IndentationError", r"unexpected indent", r"expected an indented block",
                          r"unindent does not match"]),
        ("SYNTAX",      [r"SyntaxError", r"Unexpected token", r"unexpected EOF",
                          r"invalid syntax", r"error TS\d+"]),
        ("TYPE_ERROR",  [r"TypeError", r"AttributeError", r"is not callable",
                          r"has no attribute", r"Cannot read propert"]),
        ("LINTING",     [r"flake8", r"pylint", r"eslint", r"E\d{3}", r"W\d{3}",
                          r"trailing whitespace", r"line too long", r"missing whitespace"]),
        ("LOGIC",       [r"AssertionError", r"Expected .+ received", r"assert .+ ==",
                          r"FAILED.*assert", r"not equal", r"expected.*but got"]),
    ]

    def classify(self, failure: dict[str, Any]) -> str:
        context = failure.get("error_context", "") + failure.get("raw_log", "")
        context = context[:2000]  # Limit context size

        for bug_type, patterns in self.RULES:
            for pattern in patterns:
                if re.search(pattern, context, re.IGNORECASE):
                    return bug_type

        return "LOGIC"  # Default fallback
