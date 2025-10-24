
import React, { useState } from 'react';
import { CurriculumTopic } from '../types';
import { AnsibleIcon } from './icons';

interface SidebarProps {
  curriculum: CurriculumTopic[];
  onSelectTopic: (topic: string) => void;
  activeTopic: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ curriculum, onSelectTopic, activeTopic }) => {
  const [openSections, setOpenSections] = useState<string[]>(curriculum.map(c => c.title));

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="w-full md:w-80 bg-slate-900/70 backdrop-blur-sm border-r border-slate-700/50 flex-shrink-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-700/50">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <AnsibleIcon className="w-8 h-8 mr-3 text-red-500" />
          Ansible Navigator
        </h1>
        <p className="text-sm text-slate-400 mt-1">AI-Powered Learning</p>
      </div>
      <nav className="p-4">
        <ul>
          {curriculum.map((section) => (
            <li key={section.title} className="mb-4">
              <button 
                onClick={() => toggleSection(section.title)}
                className="w-full text-left font-semibold text-slate-300 hover:text-white transition-colors duration-200 flex justify-between items-center"
              >
                {section.title}
                 <svg className={`w-4 h-4 transform transition-transform ${openSections.includes(section.title) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
              {openSections.includes(section.title) && (
                <ul className="mt-2 pl-4 border-l border-slate-700">
                  {section.subtopics.map((subtopic) => (
                    <li key={subtopic}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectTopic(subtopic);
                        }}
                        className={`block py-1.5 px-2 text-sm rounded transition-all duration-200 ${
                          activeTopic === subtopic
                            ? 'bg-red-500/20 text-red-400 font-medium'
                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                        }`}
                      >
                        {subtopic}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
