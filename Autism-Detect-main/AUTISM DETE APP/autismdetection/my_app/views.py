# my_app/views.py

import joblib
from django.http import JsonResponse
from rest_framework.decorators import api_view
import pandas as pd
from sklearn.impute import SimpleImputer

# Load model and scaler at the top so they're only loaded once
voting_classifier = joblib.load('my_app/models/voting_classifier_model.pkl')
scaler = joblib.load('my_app/models/scaler.pkl')

@api_view(['POST'])
def predict_autism(request):
    # Extract input data from POST request
    data = request.data
    print("Data received from frontend:", data)
    
    if not data:
        return JsonResponse({'error': 'No data received'}, status=400)
    

    # Organize data into DataFrame
    new_data = pd.DataFrame({
    #'patientId': [data.get('patientId')],
    'SEX': [data.get('SEX')],
    'AGE': [data.get('AGE')],
    'FIQ': [data.get('FIQ')],
    'VIQ': [data.get('VIQ')],
    'PIQ': [data.get('PIQ')],
    'ADOS_TOTAL': [data.get('ADOS_TOTAL')],
    'ADOS_COMM': [data.get('ADOS_COMM')],
    'ADOS_SOCIAL': [data.get('ADOS_SOCIAL')],
    'ADOS_STEREO_BEHAV': [data.get('ADOS_STEREO_BEHAV')],
    'SRS_RAW_TOTAL': [data.get('SRS_RAW_TOTAL')],
    'AQ_TOTAL': [data.get('AQ_TOTAL')]
})
   
    print(new_data)
    # Check for empty DataFrame
    if new_data.empty:
        return JsonResponse({'error': 'Missing data in request'}, status=400)

    # Impute missing values (if necessary)
    imputer = SimpleImputer(strategy='mean')
    new_data_imputed = new_data.copy()
    new_data_imputed = imputer.fit_transform(new_data_imputed)

    # Scale the data (assuming the scaler is trained on similar data)
    new_data_scaled = scaler.transform(new_data_imputed)

    # Make prediction
    prediction = voting_classifier.predict(new_data_scaled)
    prediction_proba = voting_classifier.predict_proba(new_data_scaled)

    # Return the prediction result as a JSON response
    return JsonResponse({
        'prediction': int(prediction[0]),
        'probability': prediction_proba[0].tolist(),
        'patientId': data.get('patientId'),
        'age': data.get('AGE'),
        
    
    })