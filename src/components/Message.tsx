import { Bot, Database, Pause, User, Volume2 } from "lucide-react";
import { useState } from "react";
import type { ImportantData } from "../types";

interface MessageProps {
  message?: string;
  isUser?: boolean;
  importantData?: ImportantData[] | null;
  isTyping?: boolean;
}

const Message: React.FC<MessageProps> = ({
  message = "",
  isUser = false,
  importantData = null,
  isTyping = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start space-x-3`}
      >
        <div
          className={`p-3 rounded-full ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-purple-600"
              : "bg-gradient-to-r from-emerald-500 to-teal-600"
          } shadow-lg`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        <div className={`relative ${isUser ? "mr-3" : "ml-3"}`}>
          <div
            className={`p-4 rounded-2xl shadow-lg ${
              isUser
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-white/10 backdrop-blur-lg text-white border border-white/20"
            }`}
          >
            {isTyping ? (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">AI is thinking...</span>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed">{message}</p>
                {!isUser && (
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="mt-2 p-1 hover:bg-white/10 rounded transition-colors duration-200"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          {importantData && importantData.length > 0 && (
            <div className="mt-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl border border-yellow-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400">
                  Important Info Saved
                </span>
              </div>
              <div className="space-y-1">
                {importantData.map((data, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-300 bg-white/5 rounded-lg px-2 py-1"
                  >
                    <span className="font-medium text-yellow-400">
                      {data.key}:
                    </span>{" "}
                    {data.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
