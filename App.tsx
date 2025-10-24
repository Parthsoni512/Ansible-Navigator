
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ContentPanel from './components/ContentPanel';
import ChatPanel from './components/ChatPanel';
import { CURRICULUM } from './constants';
import { fetchTopicContent } from './services/geminiService';

const App: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectTopic = useCallback(async (topic: string) => {
    if (topic === activeTopic) return;

    setActiveTopic(topic);
    setIsLoading(true);
    setContent('');

    const fetchedContent = await fetchTopicContent(topic);
    setContent(fetchedContent);
    setIsLoading(false);
  }, [activeTopic]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-900 font-sans">
      <Sidebar 
        curriculum={CURRICULUM} 
        onSelectTopic={handleSelectTopic} 
        activeTopic={activeTopic} 
      />
      <div className="flex-1 flex min-w-0">
        <ContentPanel 
          content={content} 
          isLoading={isLoading} 
          topic={activeTopic}
        />
        <ChatPanel />
      </div>
    </div>
  );
};

export default App;
