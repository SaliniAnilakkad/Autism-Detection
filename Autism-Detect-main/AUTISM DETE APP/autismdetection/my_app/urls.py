# my_app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('predict-autism/', views.predict_autism, name='predict_autism'),
]
