"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  from: "user" | "bot";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/dialogflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      const botMessage: Message = {
        from: "bot",
        text: data.reply || "Lo siento, no entendí eso.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error de comunicación con el servidor." },
      ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col h-[600px] border rounded shadow-lg bg-white">
      <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md break-words ${
              msg.from === "user"
                ? "bg-blue-600 text-white self-end rounded-bl-2xl rounded-tr-2xl"
                : "bg-gray-200 text-gray-900 self-start rounded-br-2xl rounded-tl-2xl"
            }`}
            style={{ wordBreak: "break-word" }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex"
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-400"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 text-white px-5 rounded-full hover:bg-blue-700 transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}