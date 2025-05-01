// app/chat/[id]/page.tsx
import { notFound } from "next/navigation";

type Chat = {
  id: number;
  user_id: number;
  title: string;
  chat_data: {
    id: number;
    text: string;
    sender: string;
    details: object;
    expanded: boolean;
    isLoading: boolean;
    isError: boolean;
  }[];
};

const API_BASE_URL = "http://localhost:8000";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE_URL}/chat-history`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const allChats: Chat[] = await res.json();
  const chatId = parseInt(params.id, 10);
  const selectedChat = allChats.find((chat) => chat.id === chatId);

  if (!selectedChat) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{selectedChat.title}</h1>
      <div className="space-y-4">
        {selectedChat.chat_data.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-100 text-right"
                : msg.sender === "assistant"
                ? "bg-gray-100 text-left"
                : "bg-green-100 text-left"
            }`}
          >
            <p className="text-sm text-gray-600">{msg.sender}</p>
            <p className="text-lg">{msg.text}</p>
            {msg.isError && (
              <div className="text-red-500 text-sm mt-2">
                Error: {msg.details}
              </div>
            )}
            {msg.isLoading && (
              <div className="text-yellow-500 text-sm mt-2">Loading...</div>
            )}
            {msg.details?.answer && (
              <div className="text-sm mt-2">
                <strong>Answer:</strong> {msg.details.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
