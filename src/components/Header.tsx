import { Brain } from "lucide-react";

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

export default Header;
