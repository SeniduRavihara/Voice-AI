import { useEffect, useRef, useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [toUserId, setToUserId] = useState("");
  const socket = useRef<WebSocket | null>(null);
  const myUserId = "user123"; // simulate logged-in user

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080");

    socket.current.onopen = () => {
      socket.current?.send(
        JSON.stringify({ type: "register", userId: myUserId })
      );
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChatLog((prev) => [...prev, `${data.from}: ${data.message}`]);
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input && toUserId) {
      socket.current?.send(
        JSON.stringify({
          type: "message",
          toUserId,
          message: input,
        })
      );
      setChatLog((prev) => [...prev, `You to ${toUserId}: ${input}`]);
      setInput("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">Direct Chat</h2>
      <input
        value={toUserId}
        onChange={(e) => setToUserId(e.target.value)}
        placeholder="To User ID"
        className="w-full p-3 mb-4 border-2 rounded-lg focus:outline-none focus:border-indigo-500 transition duration-200 bg-gray-50"
      />
      <div
        className="h-64 border-2 rounded-xl overflow-y-auto mb-4 p-4 bg-gray-50 scroll-smooth"
      >
        {chatLog.map((msg, i) => (
          <div key={i} className="py-2 px-3 mb-2 bg-white rounded-lg shadow-sm">{msg}</div>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow p-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 transition duration-200 bg-gray-50"
        />
        <button 
          onClick={sendMessage}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition duration-200 font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;