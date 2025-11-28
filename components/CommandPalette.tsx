
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Terminal, Zap, Hash, ArrowRight } from 'lucide-react';
import { playClick, playHover } from '../utils/audio';

interface CommandItem {
    id: string;
    label: string;
    icon: React.FC<any>;
    shortcut?: string;
    action: () => void;
    group: string;
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
      { id: 'home', label: 'Go to Home', icon: Hash, group: 'Navigation', action: () => window.location.href = '#home' },
      { id: 'projects', label: 'View Projects', icon: Hash, group: 'Navigation', action: () => window.location.href = '#projects' },
      { id: 'skills', label: 'Check Capabilities', icon: Hash, group: 'Navigation', action: () => window.location.href = '#skills' },
      { id: 'contact', label: 'Init Contact', icon: Hash, group: 'Navigation', action: () => window.location.href = '#contact' },
      { id: 'terminal', label: 'Focus Terminal', icon: Terminal, group: 'Actions', shortcut: 'T', action: () => document.getElementById('terminal')?.scrollIntoView() },
      { id: 'reload', label: 'System Reboot', icon: Zap, group: 'System', shortcut: 'R', action: () => window.location.reload() },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
      const handleKeydown = (e: KeyboardEvent) => {
          if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              setIsOpen(prev => !prev);
              playClick();
          }
          if (e.key === 'Escape') {
              setIsOpen(false);
          }
      };
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const execute = (cmd: CommandItem) => {
      playClick();
      cmd.action();
      setIsOpen(false);
      setQuery('');
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] px-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Palette */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#ccff00] shadow-[0_0_50px_rgba(204,255,0,0.15)] rounded-xl overflow-hidden flex flex-col clip-corner"
                >
                    {/* Header */}
                    <div className="flex items-center px-4 py-4 border-b border-gray-800">
                        <Search className="text-gray-500 w-5 h-5 mr-3" />
                        <input 
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type a command or search..."
                            className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none font-mono text-lg h-6"
                        />
                        <div className="hidden md:flex items-center gap-1 text-xs text-gray-600 font-mono bg-white/5 px-2 py-1 rounded">
                            <span>ESC</span> TO CLOSE
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                        {filteredCommands.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 font-mono text-sm">
                                NO_MATCHING_PROTOCOLS_FOUND
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {filteredCommands.map((cmd, idx) => (
                                    <button
                                        key={cmd.id}
                                        onClick={() => execute(cmd)}
                                        onMouseEnter={() => { setSelectedIndex(idx); playHover(); }}
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all ${
                                            idx === selectedIndex ? 'bg-[#ccff00] text-black' : 'text-gray-400 hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <cmd.icon size={18} />
                                            <span className="font-medium">{cmd.label}</span>
                                        </div>
                                        {cmd.shortcut && (
                                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                                                idx === selectedIndex ? 'bg-black/20' : 'bg-white/10'
                                            }`}>
                                                {cmd.shortcut}
                                            </span>
                                        )}
                                        {idx === selectedIndex && (
                                            <ArrowRight size={16} className="animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase">
                        <span>System Command Nexus</span>
                        <span>v.4.1.0</span>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};

export default CommandPalette;
