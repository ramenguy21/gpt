from django.urls import path
from .views import FilesView, HealthCheck

urlpatterns = [
    path('upload/', FilesView.as_view(), name='file-upload'),
    path('delete/<int:file_id>/', FilesView.as_view(), name='file-delete'),
    path('health-check/', HealthCheck.as_view(), name='health-check'),
]
