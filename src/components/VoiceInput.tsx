import { Mic, MicOff, Send } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";

interface VoiceInputProps {
  isListening: boolean;
  onToggleListening: () => void;
  onSendMessage: (message: string) => void;
  currentTranscript: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  isListening,
  onToggleListening,
  onSendMessage,
  currentTranscript,
}) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(currentTranscript);
  }, [currentTranscript]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleListening}
            className={`relative p-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
              isListening
                ? "bg-red-500 shadow-lg shadow-red-500/30 animate-pulse"
                : "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></div>
            )}
          </button>

          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">
              {isListening ? "Listening..." : "Click to speak or type below"}
            </div>
            <div className="text-lg font-medium text-white">
              {isListening ? "Say something..." : "Ready to chat"}
            </div>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here or use voice input..."
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
