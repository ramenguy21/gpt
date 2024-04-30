from django.db import models

class Chat(models.Model):
    file_url = models.URLField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=False)
    user_id = models.CharField(max_length=255, blank=False)
    file_key = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.file_key
    
class Message(models.Model):
    ROLE_CHOICES = (
        ('system', 'System'),
        ('user', 'User'),
    )

    chat_id = models.ForeignKey(Chat, on_delete=models.CASCADE)
    message_text = models.TextField()
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.pk} for Chat {self.chat_id.pk}"