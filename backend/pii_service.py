from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import re

class PIIService:
    def __init__(self):
        self.analyzer = AnalyzerEngine()
        self.anonymizer = AnonymizerEngine()

    def scan_text(self, text: str):
        """Analyzes text for PII entities."""
        results = self.analyzer.analyze(text=text, language='en')
        return results

    def redact_text(self, text: str):
        """
        Redacts PII from text using unique tokens.
        Manual replacement to ensure reliability.
        """
        results = self.analyzer.analyze(text=text, language='en')
        
        # Filter results: 
        # 1. Higher score first
        # 2. Longer text first if same score
        # 3. Exclude UK_NHS as it misidentifies phone numbers
        results = [res for res in results if res.entity_type != "UK_NHS"]
        
        # 1. Sort by score (desc) and length (desc) to prioritize better matches
        results = sorted(results, key=lambda x: (-x.score, -(x.end - x.start)))
        
        # 2. Filter out overlaps based on priority
        keep_results = []
        for res in results:
            is_overlapping = False
            for kept in keep_results:
                if (res.start >= kept.start and res.start < kept.end) or \
                   (res.end > kept.start and res.end <= kept.end) or \
                   (kept.start >= res.start and kept.start < res.end):
                    is_overlapping = True
                    break
            if not is_overlapping:
                keep_results.append(res)
        
        # 3. Sort by start descending for replacement
        results = sorted(keep_results, key=lambda x: x.start, reverse=True)
        
        token_mapping = {}
        entity_counts = {}
        redacted_text = text

        for res in results:
            original_value = text[res.start:res.end]
            entity_type = res.entity_type
            
            # Get or create token
            token = None
            if original_value in token_mapping.values():
                for t, v in token_mapping.items():
                    if v == original_value:
                        token = t
                        break
            
            if not token:
                count = entity_counts.get(entity_type, 0) + 1
                entity_counts[entity_type] = count
                token = f"<{entity_type}_{count}>"
                token_mapping[token] = original_value
            
            # Replace in text
            redacted_text = redacted_text[:res.start] + token + redacted_text[res.end:]
            
        return redacted_text, token_mapping



# Singleton instance
pii_service = PIIService()
