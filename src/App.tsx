import {
  Bot,
  Brain,
  Database,
  Mic,
  MicOff,
  Pause,
  Send,
  User,
  Volume2,
  X,
} from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface ImportantData {
  key: string;
  value: string;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
  importantData?: ImportantData[] | null;
}

interface VoiceInputProps {
  isListening: boolean;
  onToggleListening: () => void;
  onSendMessage: (message: string) => void;
  currentTranscript: string;
}

interface MessageProps {
  message?: string;
  isUser?: boolean;
  importantData?: ImportantData[] | null;
  isTyping?: boolean;
}

interface KnowledgeBaseProps {
  userProfile: Record<string, string>;
  isOpen: boolean;
  onToggle: () => void;
}

// Voice Input Component
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

// Message Component
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

// Knowledge Base Component
const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  userProfile,
  isOpen,
  onToggle,
}) => {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-6 right-6 p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Brain className="w-5 h-5 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed z-10 top-6 right-6 w-80 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">Knowledge Base</h3>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
          >
            <X className="text-white" />
          </button>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {Object.keys(userProfile).length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No information learned yet</p>
            <p className="text-xs mt-1">
              Start chatting to build your profile!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(userProfile).map(([key, value]) => (
              <div
                key={key}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="text-sm font-medium text-purple-400 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div className="text-sm text-gray-300">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center space-x-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          AI Learning Assistant
        </h1>
      </div>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Your personal AI that learns about you through conversation. Speak
        naturally and watch it remember what matters to you.
      </p>
    </div>
  );
};

// Main App Component
const VoiceAIApp: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfile, setUserProfile] = useState<Record<string, string>>({});
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  const handleToggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        handleSendMessage(transcript);
        resetTranscript();
      }
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { text: message, isUser: true, timestamp: Date.now() },
    ]);
    setIsListening(false);
    resetTranscript();
    setIsTyping(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const importantData = extractImportantData(message);

      // Update user profile with important data
      if (importantData.length > 0) {
        const newProfile = { ...userProfile };
        importantData.forEach((data) => {
          newProfile[data.key] = data.value;
        });
        setUserProfile(newProfile);
      }

      // Add AI response
      const aiResponse = generateAIResponse(message, importantData);
      setMessages((prev) => [
        ...prev,
        {
          text: aiResponse,
          isUser: false,
          timestamp: Date.now(),
          importantData: importantData.length > 0 ? importantData : null,
        },
      ]);
      setIsTyping(false);
    }, 2000);
  };

  const extractImportantData = (message: string): ImportantData[] => {
    const data: ImportantData[] = [];
    const text = message.toLowerCase();

    // Simple pattern matching for demo
    if (
      text.includes("my dog") ||
      text.includes("dog's name") ||
      text.includes("dog name")
    ) {
      const match = text.match(
        /(?:my dog|dog'?s? name is|dog name is|called)\s+(\w+)/
      );
      if (match) data.push({ key: "petName", value: match[1] });
    }

    if (
      text.includes("my name is") ||
      text.includes("i'm ") ||
      text.includes("i am ")
    ) {
      const match = text.match(/(?:my name is|i'm|i am)\s+(\w+)/);
      if (match) data.push({ key: "userName", value: match[1] });
    }

    if (text.includes("favorite") && text.includes("color")) {
      const match = text.match(/favorite color is (\w+)/);
      if (match) data.push({ key: "favoriteColor", value: match[1] });
    }

    if (text.includes("work") || text.includes("job")) {
      const match = text.match(
        /(?:work as|job as|i'm a|i am a)\s+([\w\s]+?)(?:\.|$|,|\s+and|\s+but)/
      );
      if (match) data.push({ key: "occupation", value: match[1].trim() });
    }

    return data;
  };

  const generateAIResponse = (
    message: string,
    importantData: ImportantData[]
  ): string => {
    if (importantData.length > 0) {
      const dataDescriptions = importantData
        .map(
          (d) =>
            `your ${d.key.replace(/([A-Z])/g, " $1").toLowerCase()} (${
              d.value
            })`
        )
        .join(" and ");
      return `That's great! I've learned about ${dataDescriptions}. I'll remember this information for our future conversations. Is there anything specific you'd like to talk about?`;
    }

    return "I understand! Thanks for sharing that with me. I'm always listening for important details about you so I can provide more personalized assistance. What else would you like to discuss?";
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">
            Your browser doesn't support speech recognition.
          </p>
          <p className="text-sm mt-2">
            Please use a supported browser like Chrome to use voice features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20'></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl p-6 mb-6">
          <div
            className="h-96 overflow-y-auto mb-6 pr-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#6366f1 transparent",
            }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to learn about you!</p>
                  <p className="text-sm">
                    Start a conversation and I'll remember the important
                    details.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <Message
                    key={index}
                    message={msg.text}
                    isUser={msg.isUser}
                    importantData={msg.importantData}
                    isTyping={false}
                  />
                ))}
                {isTyping && <Message isTyping={true} />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <VoiceInput
            isListening={isListening}
            onToggleListening={handleToggleListening}
            onSendMessage={handleSendMessage}
            currentTranscript={transcript}
          />
        </div>
      </div>

      <div className="">
        <KnowledgeBase
          userProfile={userProfile}
          isOpen={showKnowledgeBase}
          onToggle={() => setShowKnowledgeBase(!showKnowledgeBase)}
        />
      </div>
    </div>
  );
};

export default VoiceAIApp;
