from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .llm import process_question, similarity_search
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer

class ChatDetail(APIView):
    def get(self, request, user_id, chat_id):
        chat_object = get_object_or_404(Chat, pk=chat_id, user_id=user_id)
        serializer = ChatSerializer(chat_object)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserChats(APIView):
    def get(self, request, user_id):
        chats = Chat.objects.filter(user_id=user_id)
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ChatMessages(APIView):
    def post(self, request, chat_id):
        request.data['chat_id'] = chat_id 
        request.data['role'] = "user" 

        user_message_serializer = MessageSerializer(data=request.data)
        chat_object = get_object_or_404(Chat, pk=chat_id)

        if user_message_serializer.is_valid():
            user_message_serializer.save()
        else:
            return Response(user_message_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        answer_from_llm = process_question(request.data['message_text'], chat_object.file_key)
        sys_message_serializer = MessageSerializer(data={
            'chat_id': chat_id,
            'message_text': answer_from_llm,
            'role': 'system'
        })

        if sys_message_serializer.is_valid():
            sys_message_serializer.save()
        else:
            return Response(sys_message_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(answer_from_llm, status=status.HTTP_201_CREATED)


    def get(self, request, chat_id):
        messages = Message.objects.filter(chat_id=chat_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HealthCheck(APIView):
    def get(self, request):
        print("Health check working")
        return Response("Working", status=status.HTTP_200_OK)
