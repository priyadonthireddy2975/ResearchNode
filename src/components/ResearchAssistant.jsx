import React, { useState } from 'react';
import { Send, FileText, Upload, Sparkles, Quote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF, summarizePaper } from '../services/pdfService';

const ResearchAssistant = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Node ready. Upload scientific literature to begin multi-vector extraction.",
            type: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [paper, setPaper] = useState(null);
    const fileInputRef = React.useRef(null);


    const handleSend = () => {
        if (!input.trim()) return;

        const newMsg = { role: 'user', content: input, type: 'text' };
        setMessages([...messages, newMsg]);
        setInput('');

        // Simulate response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Based on the Methodology section of the provided paper, the researchers utilized a double-blind specialized neural architecture. This aligns with standard practices but introduces a novel 'Entropy Loss' function.",
                type: 'text',
                sources: [
                    { id: 1, title: 'Neural Dynamics in Scientific Inquiry', authors: 'Chen et al.', year: 2023 }
                ]
            }]);
        }, 1000);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const data = await extractTextFromPDF(file);
            const summary = summarizePaper(data.text);
            setPaper({
                name: file.name,
                pages: data.pageCount,
                title: summary.title,
                abstract: summary.abstract,
                keyFindings: summary.keyFindings,
                text: data.text
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I've analyzed **${file.name}** (${data.pageCount} pages). You can now ask specific questions about the methodology, results, or citations.`,
                type: 'text'
            }]);
        } catch (err) {
            console.error("PDF extraction failed:", err);
            alert(`Failed to read PDF: ${err.message || 'Unknown error'}. Please ensure the file is a valid PDF.`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
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
                                PDF, TXT, or LaTeX files supported. Analyzes methods, results, and citations instantly.
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
                                    gap: '8px'
                                }}>
                                {isUploading ? 'Analyzing...' : 'Select File'}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".pdf"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div>
                                <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Document Summary</span>
                                <h1 className="academic-serif" style={{ fontSize: '28px', marginTop: '8px', color: 'var(--text-primary)' }}>
                                    {paper.name}
                                </h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                                    Extracted from {paper.pages} pages • Technical Analysis Ready
                                </p>
                            </div>
                            <div style={{ padding: '8px 16px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={16} color="var(--success)" />
                                <span style={{ fontSize: '12px', fontWeight: 500 }}>Verified Citations</span>
                            </div>
                        </div>

                        <section style={{ marginBottom: '32px' }}>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={16} color="var(--accent)" /> Key Findings
                            </h4>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {paper.keyFindings.map((finding, i) => (
                                    <li key={i}>{finding}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Abstract / Introduction</h4>
                            <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: '12px', borderLeft: '3px solid var(--accent)' }}>
                                <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    "{paper.abstract}"
                                </p>
                            </div>
                        </section>
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
                                    boxShadow: msg.role === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
                                }}>
                                    {msg.content}

                                    {msg.sources && (
                                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', textAlign: 'left' }}>
                                            <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Sources</p>
                                            {msg.sources.map(s => (
                                                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                                                    <Quote size={10} /> {s.authors} ({s.year}). {s.title}.
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
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
                            placeholder="Synthesize insights from the literature..."
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
                            style={{
                                position: 'absolute',
                                right: '12px',
                                bottom: '12px',
                                background: 'var(--accent)',
                                color: 'white',
                                padding: '8px',
                                borderRadius: '8px'
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
