import axios, { AxiosResponse } from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_URL

export interface UploadedFile {
    id: number;
    user_id: string;
    file: string;
    uploaded_at: string;
    upload_url: string;
    chat_id: number;
}

export interface Chat {
    id: number;
    file_url: string;
    created_at: string;
    user_id: string;
    file_key: string;
}

interface MyMessages {
  id: number;
  chat_id: number;
  message_text: string;
  role: 'system' | 'user';
  created_at: string;
}

export interface Message {
  id: string;
  chatId: number;
  content: string;
  role: 'assistant' | 'user';
  created_at: string;
}



export async function uploadFile(file: File, user_id: string): Promise<UploadedFile> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user_id);
    console.log("\n\n BASE URLS:", BASE_URL)
    const response: AxiosResponse<UploadedFile> = await axios.post(`${BASE_URL}/api/files/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getChatFromChatAndUserId(user_id: string, chat_id: number): Promise<Chat> {
  try {
    const response: AxiosResponse<Chat> = await axios.get(`${BASE_URL}/api/chats/chat/${user_id}/${chat_id}/`);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error getting chat:', error);
    throw error;
  }
}

export async function getChatFromUserId(user_id: string): Promise<Chat[]> {
  try {
    const response: AxiosResponse<Chat[]> = await axios.get(`${BASE_URL}/api/chats/user-chats/${user_id}/`);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error getting user chats:', error);
    throw error;
  }
}

export async function sendMessage(chat_id: number, question: string): Promise<string> {
  try {
    console.log("AXIOS FUNCTION: ", question)
    const response: AxiosResponse<string> = await axios.post(`${BASE_URL}/api/chats/chat/${chat_id}/messages/create/`, {"message_text": question}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getMessagesFromChatId(chat_id: number): Promise<Message[]> {
  try {
    const response: AxiosResponse<MyMessages[]> = await axios.get(`${BASE_URL}/api/chats/chat/${chat_id}/messages/`);

    return response.data!.map(({ id, chat_id, message_text, role, created_at }) => ({
      id: `${id}`,
      chatId: chat_id,
      content: message_text,
      role: role === 'system' ? 'assistant' : role,
      created_at
    }));
    

  } catch (error) {
    // Handle error
    console.error('Error getting messages:', error);
    throw error;
  }
}


