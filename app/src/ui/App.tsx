import React from 'react';
import { ResponseWindow } from './ResponseWindow';
import { PromptBox } from './PromptBox';
import { SidePanel } from './SidePanel';

export function App(): JSX.Element {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_360px]">
      <main className="flex flex-col h-screen">
        <header className="p-3 border-b border-gray-800 flex items-center justify-between">
          <h1 className="font-semibold tracking-wide">Oracle Fury</h1>
          <div className="text-xs text-gray-400">TypeScript-first Demo</div>
        </header>
        <ResponseWindow />
        <PromptBox />
      </main>
      <aside className="border-l border-gray-800 h-screen overflow-auto">
        <SidePanel />
      </aside>
    </div>
  );
}