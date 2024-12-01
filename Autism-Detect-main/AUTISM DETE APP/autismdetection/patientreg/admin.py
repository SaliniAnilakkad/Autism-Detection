from django.contrib import admin

# Register your models here.
from patientreg import models
admin.site.register(models.PregnancyDetails)
admin.site.register(models.BirthMilestones)
admin.site.register(models.Patient)