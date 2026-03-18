import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                    <SettingsIcon size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Settings</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Configure ResearchNode preferences.</p>
                </div>
            </div>
            <div className="glass-panel" style={{ padding: '32px', maxWidth: '600px' }}>
                 <div style={{ marginBottom: '24px' }}>
                     <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>LLM Provider</label>
                     <select style={{ width: '100%', padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}>
                         <option>Local (Sentence Transformers + Mock RAG)</option>
                         <option value="openai" disabled>OpenAI (Requires API Key)</option>
                     </select>
                 </div>
                 <div>
                     <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>API Endpoint</label>
                     <input type="text" value="http://localhost:8000" disabled style={{ width: '100%', padding: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)' }} />
                 </div>
            </div>
        </div>
    );
};

export default Settings;
