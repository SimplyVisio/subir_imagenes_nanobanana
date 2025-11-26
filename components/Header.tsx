import React from 'react';
import { Layers, Zap } from 'lucide-react';
import { APP_NAME } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Layers className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {APP_NAME}
            </h1>
            <p className="text-xs text-slate-500 font-medium">n8n & Sora Connector</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Sistema Operativo
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-brand-400">
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};