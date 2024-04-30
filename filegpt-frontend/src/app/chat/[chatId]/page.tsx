import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { getChatFromChatAndUserId, getChatFromUserId } from "@/lib/AxiosRequests";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {

  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const currentChat = await getChatFromChatAndUserId(userId, parseInt(chatId))
  const chats = await getChatFromUserId(userId)
  if (!chats || !currentChat) {
    return redirect("/");
  }

  const parts = currentChat?.file_url.split('/');
  parts[parts.length - 1] = currentChat?.file_key;

  const modifiedUrl = parts.join('/');


  return (
    <div className="flex h-screen">
      <div className="flex w-full h-screen">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={chats} chatId={parseInt(chatId)} isPro={true} />
        </div>
        {/* pdf viewer */}
        <div className="h-screen p-4 flex-[5]">
          <PDFViewer pdf_url={modifiedUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
