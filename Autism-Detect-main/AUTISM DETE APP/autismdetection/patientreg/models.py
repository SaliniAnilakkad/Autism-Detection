from django.db import models

# Create your models here.


class Patient(models.Model):
    unique_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.unique_id} - {self.name}"
class PregnancyDetails(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="pregnancy_details")
    sugar_level = models.CharField(max_length=50)
    abortion_history = models.CharField(max_length=50)
    bmi = models.CharField(max_length=50)
    blood_pressure = models.CharField(max_length=50)

    def __str__(self):
        return f"Pregnancy Details for Patient ID: {self.patient.unique_id}"


class BirthMilestones(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="birth_milestones")
    weight = models.CharField(max_length=50)
    premature_birth = models.CharField(max_length=50)
    lifting_head_month = models.IntegerField()
    rolling_over_month = models.IntegerField()
    sitting_up_month = models.IntegerField()
    crawling_month = models.IntegerField()
    standing_with_support_month = models.IntegerField()
    standing_individually_month = models.IntegerField()

    def __str__(self):
        return f"Birth Milestones for Patient ID: {self.patient.unique_id}"
    
