import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_recommendations():
    try:
        # Read data from stdin
        input_data = json.loads(sys.stdin.read())
        
        student_interests = " ".join(input_data.get('student_interests', []))
        alumni_list = input_data.get('alumni', [])
        
        if not alumni_list:
            print(json.dumps([]))
            return

        if not student_interests:
            # If no interests, return top 3 alumni (maybe sorted by something else or just first 3)
            print(json.dumps(alumni_list[:3]))
            return

        # Prepare data for TF-IDF
        # Each entry is a space-separated string of skills
        documents = [student_interests] + [" ".join(a.get('skills', [])) for a in alumni_list]
        
        # Vectorize
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        # Calculate Cosine Similarity between student (index 0) and all alumni (index 1 onwards)
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
        
        # Get scores
        scores = cosine_sim[0]
        
        # Combine with alumni data
        for i, alumnus in enumerate(alumni_list):
            alumnus['score'] = float(scores[i])
            
        # Sort by score descending
        recommended_alumni = sorted(alumni_list, key=lambda x: x['score'], reverse=True)
        
        # Return top 3
        print(json.dumps(recommended_alumni[:3]))

    except Exception as e:
        sys.stderr.write(f"Error in recommendation script: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    calculate_recommendations()
