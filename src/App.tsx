import { Bot } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Header from "./components/Header";
import KnowledgeBase from "./components/KnowledgeBase";
import Message from "./components/Message";
import VoiceInput from "./components/VoiceInput";
import type { ImportantData, MessageType } from "./types";

// Main App Component
const VoiceAIApp: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
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
    console.log(message);

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
