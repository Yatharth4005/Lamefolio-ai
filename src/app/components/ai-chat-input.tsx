import { Sparkles, Send } from "lucide-react";

export function AIChatInput() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Portfolio Assistant</h3>
          <p className="text-sm text-gray-500 mt-1">
            Describe your skills, experience, and projects. I'll help build your portfolio.
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          placeholder="E.g., I'm a full-stack developer with 5 years of experience in React and Node.js..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          rows={4}
        />
        <button className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
