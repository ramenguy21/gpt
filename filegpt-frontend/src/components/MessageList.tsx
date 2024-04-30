import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean;
  isTyping: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading, isTyping }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;

  // if (isTyping == 1) {
  //   const temp = messages[-1]
  //   temp.content = 'FileGPT is thinking...'
  //   messages.push(temp)
  // } else if (isTyping == 2) {
  //   messages.pop()
  // }

  console.log("IS TYPING", isTyping)
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message, index) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            { 
              <div
                className={cn(
                  "rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10",
                  {
                    "bg-blue-600 text-white": message.role === "user",
                  }
                )}
              >
                <p>{message.content}</p>
              </div>
            }

          </div>
        );
      })}

      {isTyping && messages.length > 0 && messages[messages.length - 1].role === "user" && <div className="flex justify-start pr-10">
          <div className="rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10">
            <p>FileGPT is thinking...</p>
          </div>
        </div>
      }

    </div>
  );
};

export default MessageList;
