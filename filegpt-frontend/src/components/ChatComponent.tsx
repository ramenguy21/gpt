"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import { Message } from "ai";
import { getMessagesFromChatId } from "@/lib/AxiosRequests";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {

  const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_URL

  const [ sending, setSending ] = React.useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await getMessagesFromChatId(chatId)
      return response;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: `/api/chat`,
    body: {
      chatId
    },
    initialMessages: data || [],
    streamMode: "text",
  });

  const onFormSubmit = (event: any) => {
    setSending(true) 
    handleSubmit(event)
    setTimeout(()=>{setSending(false)},10000)
  }

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative h-screen overflow-scroll"
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <MessageList messages={messages} isLoading={isLoading} isTyping={sending}/>

      <form
        onSubmit={onFormSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
