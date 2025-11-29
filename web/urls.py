from django.urls import path
from . import views

urlpatterns = [
    # Halaman utama (root) akan memanggil fungsi 'index' di views.py
    path('', views.index, name='index'),
]