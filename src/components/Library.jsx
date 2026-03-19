import React, { useEffect, useState } from 'react';
import { History, FileText } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/api');

const Library = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Fetch from backend later
        fetch(`${API_BASE}/documents`)
            .then(res => res.json())
            .then(data => setDocuments(data.documents || []))
            .catch(err => console.error("Failed to fetch documents", err));
    }, []);

    return (
        <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                    <History size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Research Library</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your uploaded papers and datasets.</p>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {documents.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No documents uploaded yet.</p>
                ) : (
                    documents.map((doc, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <FileText size={24} color="var(--accent)" />
                            <div style={{ wordBreak: 'break-all' }}>
                                <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>{doc.filename}</h4>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{(doc.size / 1024).toFixed(2)} KB</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Library;
