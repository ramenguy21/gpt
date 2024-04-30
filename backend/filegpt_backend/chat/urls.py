from django.urls import path
from .views import ChatDetail, ChatMessages, HealthCheck, UserChats

urlpatterns = [
    path('chat/<str:user_id>/<int:chat_id>/', ChatDetail.as_view(), name='chat-detail'),
    path('user-chats/<str:user_id>/', UserChats.as_view(), name='user-chats'),
    path('health-check/', HealthCheck.as_view(), name='health-check'),
    path('chat/<int:chat_id>/messages/', ChatMessages.as_view(), name='chat-messages'),
    path('chat/<int:chat_id>/messages/create/', ChatMessages.as_view(), name='create-message'),
]
