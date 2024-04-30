
import { sendMessage } from "../../../lib/AxiosRequests"

export async function POST(req: Request) {
    const { messages, chatId } = await req.json();
    const lastMessage = messages[messages.length - 1];

    const response = await sendMessage(chatId, lastMessage.content)
    return new Response(response, { status: 200, headers: { 'Content-Type': 'text/plain' } });
}