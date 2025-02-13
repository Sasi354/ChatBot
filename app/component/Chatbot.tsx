import { useEffect, useState } from "react";

import { Send, X } from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [botMessage, setBotMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = useMutation(api.messages.sendMessage);
  const getMessage = useQuery(api.messages.getMessages);
  const botResponse = useAction(api.chatbot.generateChatbotResponse);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    sendMessage({ text: userMessage, sender: "user" });
    setLoading(true);
    try {
      const response = await botResponse({
        message: userMessage,
      });

      const data = await response;
      if (typeof data === "string") {
        setBotMessage(data);
        sendMessage({ text: botMessage, sender: "bot" });
      } else if (data.error) {
        console.error("Error:", data.error);
        alert("Failed to generate itinerary.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
    setInput("");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold">AI Assist</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Animated Orb */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-30 animate-pulse" />
          <div
            className="absolute inset-2 bg-green-400 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #4ade80, #22c55e)",
            }}
          />
        </div>

        {/* Question */}
        <div className="text-center space-y-1">
          <p className="text-gray-600">{input}</p>
          <p className="text-gray-600">Assitant:{loading? "loading.....": botMessage}</p>
        </div>

        {/* Suggestion Buttons */}
        {/* <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Generate Summary
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Are they a good fit for my job post?
          </Button>
          <Button variant="outline" className="w-full justify-start">
            What is their training style?
          </Button>
        </div> */}

        {/* <Button variant="outline" className="w-full text-gray-500">
          Show more
        </Button> */}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="relative">
          <Input
            placeholder="Ask me anything..."
            className="pr-20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="ghost"
            className="absolute  right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

{
  /* <Input
          className="flex-1 p-3 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button
          className="ml-2 p-3 bg-blue-500 text-white rounded-lg"
          onClick={handleSend}
        >
          <Send className="w-4 h-4" />
        </Button> */
}
