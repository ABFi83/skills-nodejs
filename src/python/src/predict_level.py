import json
import numpy as np
from joblib import load
import os

# Paths to the model and label encoder
base_dir = os.path.dirname(os.path.realpath(__file__))
input_path_skill_level_model = os.path.join(base_dir, "..", "models", "skill_level_model.joblib")
input_path_label_encoder = os.path.join(base_dir, "..", "models", "label_encoder.joblib")
input_path_feature_names = os.path.join(base_dir, "..", "models", "features.json")

# Load the model, label encoder, and feature names
model = load(input_path_skill_level_model)
label_encoder = load(input_path_label_encoder)

with open(input_path_feature_names, 'r') as f:
    expected_features = json.load(f)  # Load feature names from the saved JSON file

def predict_level(skills: dict) -> str:
    # Create the input vector ensuring all expected features are present (fill missing features with 0)
    input_vector = np.array([[skills.get(f, 0) for f in expected_features]])

    # Make the prediction
    prediction = model.predict(input_vector)[0]
    
    # Return the predicted level
    return label_encoder.inverse_transform([prediction])[0]


# Example use
example_user = {"angularjs": 1, "react": 1, "java": 1}  # Example with dynamic skills (missing "c#" skill)
predicted_level = predict_level(example_user)
print(f"Predicted level: {predicted_level}")
