import { Brain, Database, X } from "lucide-react";

interface KnowledgeBaseProps {
  userProfile: Record<string, string>;
  isOpen: boolean;
  onToggle: () => void;
}

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

export default KnowledgeBase;
