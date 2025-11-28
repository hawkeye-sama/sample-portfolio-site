import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Sparkles, Scan, Aperture } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeImageWithGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        setError("File size too large. Limit is 4MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setMimeType(file.type);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const base64Data = selectedImage.split(',')[1];
      const result = await analyzeImageWithGemini(base64Data, mimeType, prompt);
      setAnalysis(result);
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="vision" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-20">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <Scan size={32} className="text-white" />
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
                    VISUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">INTELLIGENCE</span>
                </h2>
                <p className="text-gray-400 max-w-lg">Powered by Gemini 3 Pro Vision.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Zone */}
                <div 
                    className="relative group bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden min-h-[500px] flex flex-col transition-all hover:bg-white/[0.04]"
                >
                    {!selectedImage ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex flex-col items-center justify-center cursor-pointer p-10 border-2 border-dashed border-white/5 group-hover:border-white/20 transition-all m-4 rounded-2xl"
                        >
                            <div className="w-20 h-20 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Upload size={28} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Upload visual asset</h3>
                            <p className="text-gray-500 text-sm">Drop your image here or click to browse</p>
                        </div>
                    ) : (
                        <div className="relative flex-1 bg-black">
                            <img src={selectedImage} alt="Analysis Target" className="w-full h-full object-contain" />
                            <button 
                                onClick={clearImage}
                                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                    
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

                    {selectedImage && (
                        <div className="p-6 border-t border-white/5 bg-white/[0.02] backdrop-blur-xl absolute bottom-0 left-0 right-0">
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="What should I look for?"
                                className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors mb-4"
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                {isAnalyzing ? 'Processing...' : 'Run Analysis'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Zone */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden min-h-[500px]">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Aperture size={200} />
                    </div>
                    
                    {analysis ? (
                        <div className="relative z-10 h-full overflow-y-auto custom-scrollbar pr-4">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-mono text-green-500 uppercase">Analysis Complete</span>
                            </div>
                            <ReactMarkdown 
                              className="prose prose-invert prose-lg max-w-none"
                              components={{
                                p: ({node, ...props}) => <p className="text-gray-300 font-light leading-relaxed mb-4" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                                h1: ({node, ...props}) => <h3 className="text-white text-xl font-bold mb-4" {...props} />,
                                h2: ({node, ...props}) => <h4 className="text-white text-lg font-bold mb-3" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-400 mb-2" {...props} />,
                              }}
                            >
                                {analysis}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                             <div className="text-center">
                                <p className="font-mono text-xs uppercase tracking-widest mb-2">System Standby</p>
                                <p className="text-2xl font-bold text-gray-600">Waiting for Data</p>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>
  );
};

export default ImageAnalyzer;