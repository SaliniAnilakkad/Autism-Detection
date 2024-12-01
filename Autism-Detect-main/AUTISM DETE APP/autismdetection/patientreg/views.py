from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer,PatientCheckSerializer,PregnancyDetailsSerializer,BirthMilestonesSerializer

@api_view(['POST'])
def register_patient(request):
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Save unique_id and other data directly
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyPatientView(APIView):
    def post(self, request):
        print("created")
        unique_id = request.data.get('unique_id')
        try:
            patient = Patient.objects.get(unique_id=unique_id)
            return Response({'message': 'Patient found', 'patient': patient.name}, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        
class HistoryView(APIView): 
    def post(self, request):
        patient_id = request.data.get('patientID') 
        print("HistoryView POST called") 
        print(f"Request data: {request.data}") 

        #print(f"Request data: {request.data}") 
        errors = {}
        try: 
            patient = Patient.objects.get(unique_id=patient_id) 
        except Patient.DoesNotExist: 
                return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND) 
        # Deserialize pregnancy details 
        pregnancy_details_data = request.data.get('pregnancyDetails', {}) 
        pregnancy_details_data['patient'] = patient.id 
        pregnancy_serializer = PregnancyDetailsSerializer(data=pregnancy_details_data) 
        
        # Deserialize birth milestones 
        birth_milestones_data = request.data.get('birthMilestones', {}) 
        birth_milestones_data['patient'] = patient.id 
        birth_milestones_serializer = BirthMilestonesSerializer(data=birth_milestones_data) 
        if pregnancy_serializer.is_valid() and birth_milestones_serializer.is_valid(): 
            pregnancy_serializer.save() 
            birth_milestones_serializer.save() 
            print("created") 
            return Response({ "pregnancyDetails": pregnancy_serializer.data, "birthMilestones": birth_milestones_serializer.data }, status=status.HTTP_201_CREATED) 
        
        # If any serializer has errors errors = {} 
        if not pregnancy_serializer.is_valid(): 
            errors["pregnancyDetails"] = pregnancy_serializer.errors 
        if not birth_milestones_serializer.is_valid(): 
            errors["birthMilestones"] = birth_milestones_serializer.errors 
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)