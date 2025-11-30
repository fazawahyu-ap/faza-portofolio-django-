from django.urls import path
from . import views

urlpatterns = [
    # Halaman Utama
    path('', views.index, name='index'),
    
    # API Feedback (INI YANG KURANG KEMARIN)
    path('api/submit-feedback/', views.submit_feedback, name='submit_feedback'),
]