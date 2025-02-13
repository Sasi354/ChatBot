import { useState } from "react";
import { Button } from "../component/ui/button";
import { Input } from "../component/ui/input";
import { Send } from "lucide-react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server"; 

const Chatbot = () => {
  const api = anyApi
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);

  const sendMessage  = useMutation(api.createChatMessage);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    setInput("");

    const { botResponse } = await sendMessage({ userMessage });
    setMessages([...messages, { text: botResponse, sender: "bot" }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 my-1 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex border-t">
        <Input
          className="flex-1 p-3 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button className="ml-2 p-3 bg-blue-500 text-white rounded-lg" onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
