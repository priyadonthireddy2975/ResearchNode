import React from 'react';
import { Layers } from 'lucide-react';

const Correlations = () => {
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
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Upload more documents in the Library to generate correlation graphs.</p>
            </div>
        </div>
    );
};

export default Correlations;
