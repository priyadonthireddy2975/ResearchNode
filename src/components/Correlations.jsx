import React, { useEffect, useState } from 'react';
import { Layers, Activity } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/api');

const Correlations = () => {
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/correlations`)
            .then(res => res.json())
            .then(data => {
                if (data.insights) {
                    setInsights(data.insights);
                }
            })
            .catch(err => console.error("Failed to fetch correlations", err));
    }, []);

    return (
        <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                    <Layers size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Correlations Engine</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Discover hidden links between your uploaded literature.</p>
                </div>
            </div>
            
            {insights.length === 0 ? (
                <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Upload more documents in the Library to generate correlation graphs.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {insights.map((insight, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--accent)' }}>
                            <Activity size={24} color="var(--accent)" />
                            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                {insight}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Correlations;
