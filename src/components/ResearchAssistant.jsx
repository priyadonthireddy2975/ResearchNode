import React, { useState, useRef } from 'react';
import { Send, FileText, Upload, Sparkles, Quote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ResearchAssistant = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Node ready. Upload scientific literature to begin analysis.",
            type: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [paper, setPaper] = useState(null);
    const fileInputRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim() || isAnalyzing) return;
        
        const userInput = input;
        const newMsg = { role: 'user', content: userInput, type: 'text' };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsAnalyzing(true);

        try {
            const { data } = await axios.post(`${API_BASE}/analyze`, {
                query: userInput
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.synthesis,
                type: 'text',
                sources: data.citations.map((c, i) => ({ id: i, text: c }))
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: Could not process query. ${err.message}`,
                type: 'text'
            }]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axios.post(`${API_BASE}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setPaper({
                name: data.document.filename,
                size: data.document.size,
                keyFindings: [
                    "Document structure parsed successfully",
                    "Text extracted and indexed for querying",
                    "Ready for contextual analysis"
                ]
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I've analyzed **${data.document.filename}**. You can now ask specific questions about the methodology, results, or contexts within it.`,
                type: 'text'
            }]);
        } catch (err) {
            console.error("Upload failed:", err);
            alert(`Failed to upload PDF: ${err.message}`);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            {/* Hidden file input always mounted */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                style={{ display: 'none' }}
            />
            {/* PDF View / Summary Panel */}
            <div style={{
                flex: 1,
                borderRight: '1px solid var(--border)',
                background: 'var(--bg-primary)',
                padding: '32px',
                overflowY: 'auto'
            }} className="scroll-thin">
                {!paper ? (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        opacity: 0.8
                    }}>
                        <div className="glass-panel" style={{ padding: '48px', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ padding: '20px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent)', marginBottom: '24px' }}>
                                <Upload size={32} />
                            </div>
                            <h3 style={{ marginBottom: '12px' }}>Upload Research Paper</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                                PDF files supported. Analyzes methods, results, and citations instantly via secure backend endpoints.
                            </p>
                            <button
                                onClick={handleUploadClick}
                                disabled={isUploading}
                                style={{
                                    background: 'var(--accent)',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: isUploading ? 'not-allowed' : 'pointer'
                                }}>
                                {isUploading ? 'Uploading & Analyzing...' : 'Select File'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div>
                                <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Document Summary</span>
                                <h1 className="academic-serif" style={{ fontSize: '28px', marginTop: '8px', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                                    {paper.name}
                                </h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                                    File size: {(paper.size / 1024).toFixed(2)} KB • Indexing Complete
                                </p>
                            </div>
                            <div style={{ padding: '8px 16px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={16} color="var(--success)" />
                                <span style={{ fontSize: '12px', fontWeight: 500 }}>Backend Synced</span>
                            </div>
                        </div>

                        <section style={{ marginBottom: '32px' }}>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={16} color="var(--accent)" /> System Status
                            </h4>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {paper.keyFindings.map((finding, i) => (
                                    <li key={i}>{finding}</li>
                                ))}
                            </ul>
                        </section>
                        
                        <div style={{ marginTop: '32px' }}>
                             <button
                                onClick={handleUploadClick}
                                disabled={isUploading}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}>
                                {isUploading ? 'Uploading...' : 'Upload Another Document'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Chat Interface */}
            <div style={{
                width: '450px',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }} className="scroll-thin">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    marginBottom: '24px',
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    textAlign: msg.role === 'user' ? 'right' : 'left'
                                }}>
                                <div style={{
                                    display: 'inline-block',
                                    maxWidth: '90%',
                                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-tertiary)',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                                    borderTopLeftRadius: msg.role === 'user' ? '16px' : '4px',
                                    color: 'white',
                                    fontSize: '14px',
                                    lineHeight: 1.5,
                                    boxShadow: msg.role === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                                    textAlign: 'left'
                                }}>
                                    {msg.content}

                                    {msg.sources && msg.sources.length > 0 && (
                                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', textAlign: 'left' }}>
                                            <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Extracted Context</p>
                                            {msg.sources.map(s => (
                                                <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                                    <Quote size={10} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                                                    <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{s.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isAnalyzing && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '24px', textAlign: 'left' }}>
                                 <div style={{ display: 'inline-block', background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '4px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                     Synthesizing across internal endpoints...
                                 </div>
                             </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
                    <div style={{
                        position: 'relative',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '16px',
                        padding: '4px',
                        border: '1px solid var(--border)'
                    }}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Ask questions about uploaded literature..."
                            disabled={isAnalyzing}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                padding: '12px',
                                paddingRight: '48px',
                                resize: 'none',
                                height: '80px',
                                fontFamily: 'inherit',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isAnalyzing || !input.trim()}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                bottom: '12px',
                                background: input.trim() && !isAnalyzing ? 'var(--accent)' : 'var(--bg-secondary)',
                                color: 'white',
                                padding: '8px',
                                borderRadius: '8px',
                                cursor: input.trim() && !isAnalyzing ? 'pointer' : 'not-allowed',
                                transition: 'background 0.2s'
                            }}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchAssistant;
