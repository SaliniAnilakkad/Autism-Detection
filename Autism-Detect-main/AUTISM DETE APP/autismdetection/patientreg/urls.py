from django.urls import path
from .views import register_patient,VerifyPatientView,HistoryView
urlpatterns = [
    path('verify-patient/', VerifyPatientView.as_view(), name='verify_patient'),
    path('register/', register_patient, name='register_patient'),
    path('history/', HistoryView.as_view(), name='history'),
]
