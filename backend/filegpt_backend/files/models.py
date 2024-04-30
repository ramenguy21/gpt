from django.db import models
from django.conf import settings
from django.core.files.storage import default_storage
from django.utils.deconstruct import deconstructible

@deconstructible
class UserUploadPath:
    def __init__(self, sub_path):
        self.sub_path = sub_path

    def __call__(self, instance, filename):
        # Construct the upload path based on user_id and filename
        return f"{instance.user_id}/{filename}"


class UploadedFile(models.Model):
    user_id = models.CharField(max_length=255, blank=False)
    file = models.FileField(upload_to=UserUploadPath(''), max_length=255)
    upload_url = models.URLField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
    
    def save(self, *args, **kwargs):
        self.upload_url = self.file.url.split("?")[0]
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.file and default_storage.exists(self.file.name):
            self.file.delete(save=False)
        super().delete(*args, **kwargs)