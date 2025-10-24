
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface ContentPanelProps {
  content: string;
  isLoading: boolean;
  topic: string | null;
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 rounded-lg my-4 relative">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-700/50 rounded-t-lg">
        <span className="text-xs font-mono text-sky-400">{language}</span>
        <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors duration-200">
          {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ContentPanel: React.FC<ContentPanelProps> = ({ content, isLoading, topic }) => {

  const parseContent = (text: string) => {
    const parts = text.split(/```(\w*)\n([\s\S]*?)```/g);
    return parts.map((part, index) => {
      if (index % 3 === 1) { // language
        return null;
      }
      if (index % 3 === 2) { // code
        const language = parts[index - 1] || 'bash';
        return <CodeBlock key={index} language={language} code={part.trim()} />;
      }
      
      // Regular text, process for other markdown
      return (
        <div key={index} className="prose prose-invert prose-slate max-w-none"
          dangerouslySetInnerHTML={{
             __html: part
              .replace(/`([^`]+)`/g, '<code class="bg-slate-700/50 text-red-400 rounded-md px-1.5 py-0.5 font-mono text-sm">\$1</code>')
              .replace(/\n/g, '<br />')
              .replace(/### (.*)/g, '<h3 class="text-xl font-semibold mt-6 mb-2 text-white">\$1</h3>')
              .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b border-slate-700 pb-2 text-white">\$1</h2>')
              .replace(/^- (.*)/gm, '<li class="ml-6 list-disc">\$1</li>')
          }}
        />
      );
    });
  };
  
  const WelcomeScreen = () => (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-4xl font-bold text-white mb-2">Welcome to Ansible Navigator AI</h2>
        <p className="text-lg text-slate-400 max-w-2xl">
          Select a topic from the sidebar to begin your learning journey. For any questions, use the AI chat panel on the right.
        </p>
      </div>
  );

  const LoadingSkeleton = () => (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-8 bg-slate-700 rounded w-3/4"></div>
      <div className="space-y-4">
        <div className="h-4 bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
      </div>
      <div className="h-40 bg-slate-700 rounded"></div>
      <div className="space-y-4">
        <div className="h-4 bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <main className="flex-1 bg-slate-800/30 overflow-y-auto">
      {isLoading ? (
        <LoadingSkeleton />
      ) : topic ? (
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-extrabold text-white mb-6 border-b-2 border-red-500 pb-3">{topic}</h1>
          {parseContent(content)}
        </div>
      ) : (
        <WelcomeScreen />
      )}
    </main>
  );
};

export default ContentPanel;
