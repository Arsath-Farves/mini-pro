import sys
import json
from transformers import pipeline

# Use a lightweight multilingual toxicity classifier
# Alternatives: 'unitary/multilingual-toxic-xlm-roberta'
MODEL_NAME = "unitary/multilingual-toxic-xlm-roberta"

def moderate_content():
    try:
        # Load the pipeline (this will download the model on first run)
        # We use a global variable to keep it in memory if we were running a long process,
        # but here we spawn it per request for simplicity in this demo environment.
        classifier = pipeline("text-classification", model=MODEL_NAME)

        # Read input from stdin
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"toxic": False, "score": 0}))
            return

        # Perform classification
        results = classifier(input_data)
        
        # The model 'unitary/multilingual-toxic-xlm-roberta' outputs multiple scores.
        # We'll check if any 'toxic' related label is high.
        # In a simple version, we check the main label.
        
        is_toxic = False
        top_score = 0
        
        for res in results:
            if res['label'] != 'toxic': # Depending on the model, labels match toxicity categories
                # For this specific model, it usually returns a list of scores for different types of toxicity.
                pass
        
        # Generic handling for text-classification pipelines:
        # Most models return [{'label': 'LABEL_X', 'score': 0.99}]
        # For toxicity models:
        toxic_labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
        
        toxicity_score = 0
        for result in results:
            if result['label'].lower() in toxic_labels and result['score'] > 0.5:
                is_toxic = True
                toxicity_score = max(toxicity_score, result['score'])

        print(json.dumps({
            "toxic": is_toxic,
            "score": float(toxicity_score)
        }))

    except Exception as e:
        sys.stderr.write(f"Error in moderation script: {str(e)}\n")
        # Fallback to safe if error occurs (or block - depending on policy)
        print(json.dumps({"toxic": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    moderate_content()
