from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/submit-feedback/', views.submit_feedback, name='submit_feedback'),
    path('api/chat-ai/', views.chat_with_ai, name='chat_ai'), # <--- TAMBAHKAN BARIS INI
]