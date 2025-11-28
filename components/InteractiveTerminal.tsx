
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, X, Save, LogOut, ChevronRight } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { PROJECTS, SKILLS, EXPERIENCE, HERO_DESCRIPTION } from '../constants';
import { dispatchAchievement } from './Gamification';
import { playTyping, playError, playClick, playAchievement } from '../utils/audio';
import { triggerSystemWipe } from './SystemWipe';

// --- Types & Interfaces ---

type FileType = 'file' | 'dir';

interface FSNode {
  type: FileType;
  content?: string;
  children?: Record<string, FSNode>;
}

interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'error' | 'success' | 'info' | 'secret' | 'warning';
  content: string;
}

// --- Initial File System Generation ---

const generateInitialFS = (): FSNode => {
  const projectsFiles: Record<string, FSNode> = {};
  PROJECTS.forEach((p, i) => {
    projectsFiles[`${p.title.toLowerCase().replace(/\s+/g, '_')}.txt`] = {
      type: 'file',
      content: `TITLE: ${p.title}\nTAGS: ${p.tags.join(', ')}\nLINK: ${p.link}\n\nDESCRIPTION:\n${p.description}`
    };
  });

  const experienceContent = EXPERIENCE.map(e => 
    `ROLE: ${e.role}\nCOMPANY: ${e.company}\nPERIOD: ${e.period}\nDETAILS: ${e.description}\n`
  ).join('\n----------------------------------------\n\n');

  const skillsContent = SKILLS.map(s => 
    `[${s.category.toUpperCase()}]\n${s.items.join(', ')}`
  ).join('\n\n');

  return {
    type: 'dir',
    children: {
      'home': {
        type: 'dir',
        children: {
          'guest': {
            type: 'dir',
            children: {
              'projects': {
                type: 'dir',
                children: projectsFiles
              },
              'about.md': {
                type: 'file',
                content: HERO_DESCRIPTION
              },
              'skills.txt': {
                type: 'file',
                content: skillsContent
              },
              'experience.log': {
                type: 'file',
                content: experienceContent
              },
              'contact.info': {
                type: 'file',
                content: 'EMAIL: bahroze1@hotmail.com\nLINKEDIN: linkedin.com/in/bahroze-ali\nGITHUB: github.com'
              },
              'todo.txt': {
                type: 'file',
                content: '- Refactor core legacy code\n- Update portfolio design\n- Integrate GenAI features\n- [ ] Hide the treasure map'
              },
              '.secret_cache': {
                  type: 'dir',
                  children: {
                      'transmission_404.dat': {
                          type: 'file',
                          content: 'ENCRYPTED CONTENT. \nHINT: The browser console knows the way. \nKEY REQUIRED.'
                      }
                  }
              }
            }
          },
          'root': {
              type: 'dir',
              children: {
                  'system.conf': { type: 'file', content: 'ROOT_ACCESS=TRUE\nAI_MODEL=GEMINI-3-PRO' },
                  'shadow': { type: 'file', content: 'root:$6$rounds=656000$.e4... (ENCRYPTED)' }
              }
          }
        }
      },
      'var': { type: 'dir', children: { 'log': { type: 'dir', children: {} } } },
      'etc': { type: 'dir', children: {} }
    }
  };
};

const getOS = () => {
    if (typeof window === 'undefined') return 'Linux';
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    return "Unknown OS";
};

const InteractiveTerminal: React.FC = () => {
  // --- State ---
  const [fs, setFs] = useState<FSNode>(generateInitialFS());
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'guest']);
  const [user, setUser] = useState('guest');
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'BAHROZE_OS [Version 4.0.0-release]' },
    { type: 'system', content: '(c) 2024 Cyber Corp. All rights reserved.' },
    { type: 'info', content: 'Welcome to the interactive portfolio terminal.' },
    { type: 'info', content: 'Type "help" for a list of commands.' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editorFileName, setEditorFileName] = useState('');
  const [editorMessage, setEditorMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // --- Easter Eggs & Secrets ---
  useEffect(() => {
      // 1. Console Log Breadcrumb
      console.log(
          "%c STOP! %c \nIf you are looking for the secret command, check the cookies. \nLook for 'treasure_map'.", 
          "color: red; font-size: 30px; font-weight: bold;", 
          "color: #ccff00; font-size: 14px;"
      );
      
      // 2. Cookie Breadcrumb
      document.cookie = "treasure_map=cipher_key:PROTOCOL_OMEGA; path=/; SameSite=Strict";
      
  }, []);

  // --- Helpers ---

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !isEditorOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isEditorOpen, isProcessing]);

  // Focus management
  useEffect(() => {
    if (isEditorOpen) {
      editorRef.current?.focus();
    } else if (!isProcessing) {
      inputRef.current?.focus();
    }
  }, [isEditorOpen, isProcessing]);

  // Helper to add lines to history with limit
  const addToHistory = (lines: TerminalLine[]) => {
      setHistory(prev => {
          const newHistory = [...prev, ...lines];
          if (newHistory.length > 100) {
              return newHistory.slice(newHistory.length - 100);
          }
          return newHistory;
      });
  };

  const getNodeAt = (path: string[], root: FSNode): FSNode | undefined => {
    let current = root;
    for (const segment of path) {
      if (current.type === 'dir' && current.children && current.children[segment]) {
        current = current.children[segment];
      } else {
        return undefined;
      }
    }
    return current;
  };

  const resolvePath = (pathStr: string): string[] => {
    if (pathStr === '/') return [];
    if (pathStr === '~') return user === 'root' ? ['home', 'root'] : ['home', 'guest'];
    
    const parts = pathStr.split('/').filter(p => p);
    let newPath = pathStr.startsWith('/') ? [] : [...currentPath];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        if (newPath.length > 0) newPath.pop();
      } else {
        newPath.push(part);
      }
    }
    return newPath;
  };

  const getDirContent = (path: string[]): string[] => {
    const node = getNodeAt(path, fs);
    if (node && node.type === 'dir' && node.children) {
      return Object.keys(node.children).map(name => {
          const item = node.children![name];
          return item.type === 'dir' ? name + '/' : name;
      });
    }
    return [];
  };

  // --- File System Operations ---

  const writeFile = (path: string[], content: string) => {
    const fileName = path[path.length - 1];
    const dirPath = path.slice(0, -1);
    
    const newFs = JSON.parse(JSON.stringify(fs));
    let current = newFs;
    
    for (const segment of dirPath) {
      if (current.children[segment]) {
        current = current.children[segment];
      } else {
        return false;
      }
    }

    if (current.type === 'dir') {
      if (!current.children) current.children = {};
      current.children[fileName] = { type: 'file', content };
      setFs(newFs);
      return true;
    }
    return false;
  };

  const makeDir = (path: string[]) => {
      const dirName = path[path.length - 1];
      const parentPath = path.slice(0, -1);
      
      const newFs = JSON.parse(JSON.stringify(fs));
      let current = newFs;
      
      for(const segment of parentPath) {
          if(current.children && current.children[segment]) {
              current = current.children[segment];
          } else {
              return false;
          }
      }
      
      if(current.type === 'dir') {
          if(!current.children) current.children = {};
          if(current.children[dirName]) return false;
          current.children[dirName] = { type: 'dir', children: {} };
          setFs(newFs);
          return true;
      }
      return false;
  }

  const deleteNode = (path: string[]) => {
      const name = path[path.length - 1];
      const parentPath = path.slice(0, -1);
      
      const newFs = JSON.parse(JSON.stringify(fs));
      let current = newFs;
      
      for(const segment of parentPath) {
          if(current.children && current.children[segment]) {
              current = current.children[segment];
          } else {
              return false;
          }
      }

      if(current.type === 'dir' && current.children && current.children[name]) {
          delete current.children[name];
          setFs(newFs);
          return true;
      }
      return false;
  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const initiateHackerSequence = async () => {
       setIsProcessing(true);
       const os = getOS();
       // Generate a random local IP to look real
       const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`; 
       const targetDrive = os === 'Windows' ? 'C:\\Windows\\System32' : (os === 'MacOS' ? '/System/Library/CoreServices' : '/dev/sda1');

       const sequence: {text: string, type: TerminalLine['type'], delay: number}[] = [
           { text: `[SYSTEM] DETECTED UNAUTHORIZED ROOT COMMAND: rm -rf /`, type: 'error', delay: 800 },
           { text: `[NETWORK] TRACING ORIGIN IP...`, type: 'system', delay: 1000 },
           { text: `[NETWORK] TARGET IDENTIFIED: ${ip} (${os})`, type: 'warning', delay: 800 },
           { text: `[NETWORK] INITIATING REVERSE CONNECTION TO HOST...`, type: 'system', delay: 1500 },
           { text: `[NETWORK] CONNECTION ESTABLISHED.`, type: 'success', delay: 800 },
           { text: `[SECURITY] BYPASSING HOST FIREWALL...`, type: 'system', delay: 1200 },
           { text: `[SECURITY] EXPLOIT CVE-2024-XXXX INJECTED.`, type: 'warning', delay: 500 },
           { text: `[SECURITY] DUMPING MEMORY ADDR: 0x00400000 - 0x0040FFFF...`, type: 'system', delay: 500 },
           { text: `[SECURITY] DECRYPTING USER CREDENTIALS...`, type: 'warning', delay: 800 },
           { text: `[AUTH] ATTEMPT 1: ********** [FAILED]`, type: 'error', delay: 600 },
           { text: `[AUTH] ATTEMPT 2: ********** [FAILED]`, type: 'error', delay: 600 },
           { text: `[AUTH] ATTEMPT 3: ********** [SUCCESS]`, type: 'success', delay: 1000 },
           { text: `[ROOT] ROOT ACCESS GRANTED.`, type: 'error', delay: 800 },
           { text: `[SYSTEM] STOPPING SERVICES: [audio] [display] [network]...`, type: 'system', delay: 500 },
           { text: `[DISK] MOUNTING ${targetDrive} FOR DELETION...`, type: 'warning', delay: 1500 },
           { text: `[DISK] EXECUTING WIPE SEQUENCE...`, type: 'error', delay: 1000 },
       ];

       for (const step of sequence) {
           addToHistory([{ type: step.type, content: step.text }]);
           playTyping();
           if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
           await delay(step.delay);
       }
       
       // Rapid file deletion loop
       let count = 0;
       const interval = setInterval(() => {
           count++;
           const file = os === 'Windows' 
               ? `C:\\Windows\\System32\\${Math.random().toString(36).substring(7)}.dll`
               : `/usr/lib/${Math.random().toString(36).substring(7)}.so`;
               
           addToHistory([{ type: 'system', content: `DELETING: ${file}` }]);
           if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

           if (count > 50) {
               clearInterval(interval);
               triggerSystemWipe({ os });
               // We intentionally do not set isProcessing(false) here to keep input hidden until the "death" overlay takes over
           }
       }, 30);
  };

  // --- Command Processor ---

  const processCommand = async (cmdLine: string) => {
    if (!cmdLine.trim()) return;
    
    dispatchAchievement('TERMINAL_HACKER');

    const parts = cmdLine.trim().split(/\s+/);
    let cmd = parts[0];
    let args = parts.slice(1);

    const promptChar = user === 'root' ? '#' : '$';
    const location = currentPath.length === 0 ? '/' : currentPath[currentPath.length-1];
    
    addToHistory([{ type: 'input', content: `${user}@bahroze:${location}${promptChar} ${cmdLine}` }]);
    setCommandHistory(prev => [...prev, cmdLine]);
    setHistoryIndex(-1);

    // --- SECRET DECRYPTION ---
    if (cmd === 'decrypt') {
        if (args.length < 2) {
            addToHistory([{ type: 'error', content: 'usage: decrypt <file> <key>' }]);
            return;
        }
        if (args[0] === 'transmission_404.dat' && args[1] === 'PROTOCOL_OMEGA') {
            playAchievement();
            addToHistory([
                { type: 'success', content: 'DECRYPTION SUCCESSFUL...' },
                { type: 'secret', content: '--------------------------------' },
                { type: 'secret', content: 'THE MASTER KEY IS: "reveal_secrets"' },
                { type: 'secret', content: 'RUN THIS COMMAND TO SEE EVERYTHING.' },
                { type: 'secret', content: '--------------------------------' }
            ]);
            return;
        } else {
            playError();
            addToHistory([{ type: 'error', content: 'DECRYPTION FAILED: Invalid Key or File' }]);
            return;
        }
    }

    if (cmd === 'reveal_secrets') {
        playAchievement();
        addToHistory([
            { type: 'secret', content: '>>> SECRET CACHE REVEALED <<<' },
            { type: 'info', content: '1. Click the "V.3.1" version number in the header.' },
            { type: 'info', content: '2. Type "PROTOCOL_OMEGA" as a key to decrypt the hidden file in home/guest/.secret_cache' },
            { type: 'info', content: '3. There is a hidden pixel in the Hero section (bottom right corner).' },
            { type: 'info', content: '4. Check your browser cookies.' },
            { type: 'info', content: '5. Konami Code (Up, Up, Down, Down...) triggers Overdrive.' },
            { type: 'info', content: '6. Try "sudo rm -rf /" to destroy the portfolio.' }
        ]);
        dispatchAchievement('INSPECTOR_GADGET');
        return;
    }

    // Handle Sudo
    if (cmd === 'sudo') {
        if (args.length === 0) {
            addToHistory([{ type: 'info', content: 'usage: sudo <command>' }]);
            return;
        }
        if (args[0] === 'su') {
            setUser('root');
            setCurrentPath(['home', 'root']);
            addToHistory([{ type: 'success', content: 'Switched to user root.' }]);
            return;
        }
        cmd = args[0];
        args = args.slice(1);
        
        // Handle sudo rm -rf /
        if (cmd === 'rm' && args.includes('-rf') && args.includes('/')) {
             initiateHackerSequence();
             return;
        }
    }

    switch (cmd) {
      case 'help':
        addToHistory([{ 
          type: 'info', 
          content: `
  Available Commands:
  -------------------
  ls [-la]       List directory contents
  cd <dir>       Change directory
  cat <file>     Output file contents
  nano <file>    Advanced text editor
  mkdir <dir>    Create new directory
  rm <file>      Remove file/directory
  touch <file>   Create empty file
  decrypt <f> <k> Decrypt a secured file
  
  System:
  -------
  sudo           Execute as superuser
  whoami         Print effective userid
  date           Print system date/time
  echo <text>    Display a line of text
  history        Command history
  reboot         Reload system (refresh page)
  clear          Clear terminal buffer
  
  AI:
  ---
  ai <prompt>    Query Gemini-3-Pro
          ` 
        }]);
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      case 'reboot':
        window.location.reload();
        break;

      case 'date':
        addToHistory([{ type: 'output', content: new Date().toString() }]);
        break;

      case 'echo':
        addToHistory([{ type: 'output', content: args.join(' ') }]);
        break;

      case 'history':
        addToHistory([{ type: 'output', content: commandHistory.map((c, i) => `${i + 1}  ${c}`).join('\n') }]);
        break;

      case 'ls':
      case 'dir':
      case 'll':
        const targetPathLs = args[0] && !args[0].startsWith('-') ? resolvePath(args[0]) : currentPath;
        const nodeLs = getNodeAt(targetPathLs, fs);
        
        if (!nodeLs) {
            addToHistory([{ type: 'error', content: `ls: cannot access '${args[0]}': No such file or directory` }]);
        } else if (nodeLs.type === 'file') {
             addToHistory([{ type: 'output', content: args[0] }]);
        } else if (nodeLs.type === 'dir' && nodeLs.children) {
            const items = Object.entries(nodeLs.children).map(([name, node]) => {
                const isHidden = name.startsWith('.');
                if (isHidden && !args.includes('-la')) return null; // Hide dotfiles unless -la

                // Formatting
                let display = name;
                if (node.type === 'dir') display += '/';
                return display;
            }).filter(Boolean); // Filter out nulls
            
            addToHistory([{ type: 'output', content: items.join('    ') || '(empty)' }]);
        }
        break;

      case 'cd':
        const targetDir = args[0] || '~';
        const newPathCd = resolvePath(targetDir);
        const nodeCd = getNodeAt(newPathCd, fs);
        if (nodeCd && nodeCd.type === 'dir') {
            setCurrentPath(newPathCd);
        } else {
            addToHistory([{ type: 'error', content: `cd: ${args[0]}: No such directory` }]);
        }
        break;

      case 'pwd':
        addToHistory([{ type: 'output', content: '/' + currentPath.join('/') }]);
        break;

      case 'whoami':
        addToHistory([{ type: 'output', content: user }]);
        break;
      
      case 'cat':
        if(!args[0]) {
            addToHistory([{ type: 'error', content: 'usage: cat <filename>' }]);
            break;
        }
        const filePathCat = resolvePath(args[0]);
        const nodeCat = getNodeAt(filePathCat, fs);
        if(nodeCat && nodeCat.type === 'file') {
            addToHistory([{ type: 'output', content: nodeCat.content || '' }]);
        } else {
             addToHistory([{ type: 'error', content: `cat: ${args[0]}: No such file` }]);
        }
        break;

      case 'mkdir':
          if(!args[0]) {
            addToHistory([{ type: 'error', content: 'usage: mkdir <directory>' }]);
            break;
          }
          if (user !== 'root' && resolvePath(args[0])[0] === 'root') {
             addToHistory([{ type: 'error', content: `mkdir: permission denied` }]);
             break;
          }
          const pathMkdir = resolvePath(args[0]);
          if(makeDir(pathMkdir)) {
               addToHistory([{ type: 'success', content: `Directory '${args[0]}' created.` }]);
          } else {
               addToHistory([{ type: 'error', content: `mkdir: cannot create directory '${args[0]}': File exists or path invalid` }]);
          }
          break;
      
      case 'touch':
          if(!args[0]) {
              addToHistory([{ type: 'error', content: 'usage: touch <filename>' }]);
              break;
          }
          const pathTouch = resolvePath(args[0]);
          if(getNodeAt(pathTouch, fs)) {
          } else {
               if(writeFile(pathTouch, "")) {
                   addToHistory([{ type: 'success', content: `File '${args[0]}' created.` }]);
               } else {
                   addToHistory([{ type: 'error', content: `touch: cannot create file '${args[0]}'` }]);
               }
          }
          break;

      case 'rm':
          if(!args[0]) {
               addToHistory([{ type: 'error', content: 'usage: rm <filename>' }]);
               break;
          }
          
          // Handle root user rm -rf /
          if (user === 'root' && args.includes('-rf') && args.includes('/')) {
              initiateHackerSequence();
              return;
          }
          
          if (args[0] === '-rf' && args[1] === '/') {
              addToHistory([{ type: 'error', content: `Nice try, but I can't let you do that, ${user}.` }]);
              break;
          }
          const pathRm = resolvePath(args[0]);
          if(deleteNode(pathRm)) {
              addToHistory([{ type: 'success', content: `Removed '${args[0]}'` }]);
          } else {
               addToHistory([{ type: 'error', content: `rm: cannot remove '${args[0]}': No such file or directory` }]);
          }
          break;

      case 'nano':
      case 'vi':
      case 'vim':
          if(!args[0]) {
               addToHistory([{ type: 'error', content: 'usage: nano <filename>' }]);
               break;
          }
          const pathNano = resolvePath(args[0]);
          const nodeNano = getNodeAt(pathNano, fs);
          
          if (nodeNano && nodeNano.type === 'dir') {
              addToHistory([{ type: 'error', content: `nano: ${args[0]} is a directory` }]);
          } else {
              setEditorFileName(args[0]);
              setEditorContent(nodeNano && nodeNano.type === 'file' ? nodeNano.content || '' : '');
              setIsEditorOpen(true);
          }
          break;

      case 'ai':
          const prompt = args.join(' ');
          if(!prompt) {
              addToHistory([{ type: 'error', content: 'usage: ai <prompt>' }]);
          } else {
               setIsProcessing(true);
               try {
                   const response = await sendMessageToGemini(prompt);
                   addToHistory([{ type: 'success', content: `AI: ${response}` }]);
               } catch (e) {
                   addToHistory([{ type: 'error', content: 'Error connecting to AI subsystem.' }]);
               } finally {
                   setIsProcessing(false);
               }
          }
          break;

      default:
        addToHistory([{ type: 'error', content: `Command not found: ${cmd}` }]);
    }
  };

  // --- Input Handlers ---

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'Tab' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
        playTyping();
    }
    
    if (e.key === 'Enter') {
      playClick();
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.split(' ');
        
        if (parts.length === 1) {
            const commands = ['ls', 'cd', 'cat', 'nano', 'help', 'clear', 'sudo', 'ai', 'mkdir', 'touch', 'rm', 'whoami', 'date', 'history', 'reboot', 'echo', 'pwd', 'decrypt', 'reveal_secrets'];
            const match = commands.find(cmd => cmd.startsWith(parts[0]));
            if (match) {
                setInput(match + ' ');
            }
        } else {
            const currentInput = parts[parts.length - 1];
            if (currentInput) {
                 const dirContent = getDirContent(currentPath);
                 const match = dirContent.find(item => item.startsWith(currentInput));
                 if (match) {
                     parts[parts.length - 1] = match;
                     setInput(parts.join(' '));
                 }
            }
        }
    }
  };

  const saveFile = () => {
      const path = resolvePath(editorFileName);
      if(writeFile(path, editorContent)) {
          setEditorMessage('[ Wrote lines to disk ]');
          setTimeout(() => setEditorMessage(''), 2000);
      } else {
          setEditorMessage('[ Error writing file ]');
      }
  };

  const exitEditor = () => {
      setIsEditorOpen(false);
      addToHistory([{ type: 'system', content: `Closed editor for '${editorFileName}'` }]);
      setEditorFileName('');
      setEditorContent('');
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      playTyping();
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          saveFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
          e.preventDefault();
          exitEditor();
      }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto z-20 relative perspective-1000">
      
      <div 
        className={`w-full transition-all duration-500 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-8 ${isEditorOpen ? 'border-gray-800 bg-[#111]' : 'border-[#151515] bg-[#0c0c0c]'} relative animate-crt-flicker`}
        style={{
            maxHeight: '600px',
            minHeight: '400px',
            boxShadow: isEditorOpen ? '0 0 0 2px #333' : 'inset 0 0 100px rgba(0,0,0,0.9), 0 0 40px rgba(0, 255, 0, 0.1)' 
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
        <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>

        {/* MODERN NANO EDITOR MODE */}
        {isEditorOpen ? (
            <div className="h-full flex flex-col font-mono text-gray-300 relative z-10 bg-[#0f0f0f]">
                {/* Modern Editor Header */}
                <div className="bg-[#1a1a1a] text-gray-400 px-4 py-2 flex justify-between items-center text-sm border-b border-gray-800 select-none">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-white">nano 6.2</span>
                        <span className="bg-gray-800 px-2 py-0.5 rounded text-xs text-white">{editorFileName}</span>
                    </div>
                    <span className="text-[#ccff00]">{editorMessage || 'Modified'}</span>
                </div>

                {/* Editor Body */}
                <div className="flex-1 relative flex">
                    <div className="bg-[#1a1a1a] w-12 text-right pr-3 pt-4 text-gray-600 select-none text-sm border-r border-gray-800 leading-6 font-mono">
                        {editorContent.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <textarea
                        ref={editorRef}
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        onKeyDown={handleEditorKeyDown}
                        className="flex-1 bg-transparent text-gray-200 p-4 resize-none outline-none font-mono text-sm leading-6 border-none custom-scrollbar"
                        spellCheck={false}
                    />
                </div>

                {/* Modern Editor Footer */}
                <div className="bg-[#1a1a1a] border-t border-gray-800 text-gray-400 px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs select-none">
                     <div className="flex items-center gap-2 group cursor-pointer hover:text-white" onClick={saveFile}>
                        <span className="bg-gray-700 text-white px-1.5 rounded font-bold">^S</span> 
                        <span>Write Out</span>
                     </div>
                     <div className="flex items-center gap-2 group cursor-pointer hover:text-white" onClick={exitEditor}>
                        <span className="bg-gray-700 text-white px-1.5 rounded font-bold">^X</span> 
                        <span>Exit</span>
                     </div>
                     <div className="hidden md:flex items-center gap-2 text-gray-600">
                        <span className="bg-gray-800 px-1.5 rounded">^K</span> 
                        <span>Cut Text</span>
                     </div>
                     <div className="hidden md:flex items-center gap-2 text-gray-600">
                        <span className="bg-gray-800 px-1.5 rounded">^U</span> 
                        <span>Uncut Text</span>
                     </div>
                </div>
            </div>
        ) : (
            /* TERMINAL SHELL MODE */
            <div className="h-full flex flex-col font-mono text-[#ccff00] p-4 md:p-6 text-sm md:text-base relative z-10"
                 onClick={() => !isProcessing && inputRef.current?.focus()}
                 style={{ textShadow: "0 0 5px rgba(204, 255, 0, 0.4)" }}>
                
                {/* Scrollable Output */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                    {history.map((line, idx) => (
                        <div key={idx} className={`mb-1 break-words leading-snug whitespace-pre-wrap ${
                            line.type === 'error' ? 'text-red-500' :
                            line.type === 'warning' ? 'text-yellow-500' :
                            line.type === 'system' ? 'text-gray-500' :
                            line.type === 'info' ? 'text-blue-400' :
                            line.type === 'success' ? 'text-green-400' :
                            line.type === 'secret' ? 'text-purple-400 font-bold' :
                            'text-[#ccff00]'
                        }`}>
                            {line.content}
                        </div>
                    ))}
                    
                    {/* Active Input Line - Hidden during critical processing events for realism */}
                    {!isProcessing && (
                        <div className="flex items-center mt-2 group">
                            <span className={`mr-2 ${user === 'root' ? 'text-red-500' : 'text-blue-400'}`}>
                                {user}@bahroze:{currentPath.length > 0 ? currentPath[currentPath.length-1] : '/'}
                            </span>
                            <span className={`mr-2 font-bold ${user === 'root' ? 'text-red-500' : 'text-[#ccff00]'}`}>
                                {user === 'root' ? '#' : '$'}
                            </span>
                            <div className="relative flex-1">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isProcessing}
                                    autoFocus
                                    autoComplete="off"
                                    className="w-full bg-transparent border-none outline-none text-white font-bold caret-transparent"
                                />
                                {/* Custom Block Cursor */}
                                <div className="absolute top-0 left-0 pointer-events-none flex">
                                    <span className="opacity-0 whitespace-pre">{input}</span>
                                    <span className={`w-2.5 h-5 ${user === 'root' ? 'bg-red-500' : 'bg-[#ccff00]'} animate-pulse -ml-[1px]`}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Status Bar */}
                <div className="mt-2 pt-2 border-t border-[#ccff00]/20 flex justify-between text-xs text-gray-500 uppercase tracking-widest select-none">
                    <span>{isProcessing ? 'BUSY / EXEC' : user === 'root' ? 'ROOT ACCESS GRANTED' : 'READY'}</span>
                    <span>BAHROZE_OS_SHELL</span>
                </div>
            </div>
        )}
      </div>
    </section>
  );
};

export default InteractiveTerminal;
