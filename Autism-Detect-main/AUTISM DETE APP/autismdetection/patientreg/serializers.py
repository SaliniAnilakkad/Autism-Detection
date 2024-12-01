from rest_framework import serializers
from .models import Patient,PregnancyDetails,BirthMilestones

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['unique_id', 'name', 'age', 'gender']
class PatientCheckSerializer(serializers.Serializer):
    patient_id = serializers.CharField(required=True)

class PregnancyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PregnancyDetails
        fields = ['patient', 'sugar_level', 'abortion_history', 'bmi', 'blood_pressure']

class BirthMilestonesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirthMilestones
        fields = [
            'patient', 'weight', 'premature_birth', 'lifting_head_month', 
            'rolling_over_month', 'sitting_up_month', 'crawling_month', 
            'standing_with_support_month', 'standing_individually_month'
        ]