import { Code2, Briefcase, FolderGit2, Plus, Check } from "lucide-react";

const sections = [
  {
    icon: Code2,
    title: "Skills",
    description: "Programming languages & technologies",
    items: 12,
    completed: true,
  },
  {
    icon: Briefcase,
    title: "Experience",
    description: "Work history & achievements",
    items: 5,
    completed: true,
  },
  {
    icon: FolderGit2,
    title: "Projects",
    description: "Featured work & repositories",
    items: 8,
    completed: false,
  },
];

export function PortfolioSections() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sections.map((section) => (
        <div
          key={section.title}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <section.icon className="w-6 h-6 text-indigo-600" />
            </div>
            {section.completed ? (
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{section.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{section.items} items</span>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
