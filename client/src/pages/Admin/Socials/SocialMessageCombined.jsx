import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';

export const SocialList = () => {
    const [socials, setSocials] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newLink, setNewLink] = useState({ platform: '', url: '', icon: '' });

    useEffect(() => { fetchSocials() }, []);
    const fetchSocials = async () => { const { data } = await api.get('/socials/admin'); setSocials(data); };

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post('/socials', newLink);
        setIsCreating(false);
        setNewLink({ platform: '', url: '', icon: '' });
        fetchSocials();
    };

    const handleDelete = async (id) => {
        if(window.confirm('Delete?')) { await api.delete(`/socials/${id}`); fetchSocials(); }
    };
    
    return (
        <div>
            <div className="flex justify-between mb-8">
                <h1 className="text-3xl font-bold">Social Links</h1>
                <button onClick={() => setIsCreating(true)} className="bg-primary px-4 py-2 rounded text-white flex gap-2 items-center"><Plus size={18}/> Add Link</button>
            </div>
            {isCreating && (
                <form onSubmit={handleCreate} className="glass-panel p-4 mb-6 grid grid-cols-4 gap-4 items-end">
                    <input className="bg-black/20 p-2 rounded border border-white/10" placeholder="Platform (GitHub)" value={newLink.platform} onChange={e => setNewLink({...newLink, platform: e.target.value})} required />
                    <input className="bg-black/20 p-2 rounded border border-white/10" placeholder="URL" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} required />
                    <input className="bg-black/20 p-2 rounded border border-white/10" placeholder="Icon Class/URL" value={newLink.icon} onChange={e => setNewLink({...newLink, icon: e.target.value})} />
                    <button type="submit" className="bg-green-500/20 text-green-500 p-2 rounded border border-green-500/20">Save</button>
                </form>
            )}
            <div className="grid gap-4">
                {socials.map(s => (
                    <div key={s._id} className="glass-card p-4 flex justify-between items-center rounded-lg">
                        <div className="flex items-center gap-4">
                            <span className="font-bold">{s.platform}</span>
                            <span className="text-gray-400 text-sm truncate max-w-xs">{s.url}</span>
                        </div>
                        <button onClick={() => handleDelete(s._id)} className="text-red-400"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const MessageList = () => {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const fetchMessages = async () => { const { data } = await api.get('/contact'); setMessages(data); };
        fetchMessages();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Messages</h1>
            <div className="grid gap-4">
                {messages.map(m => (
                    <div key={m._id} className="glass-panel p-6 rounded-xl">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold">{m.name}</h3>
                            <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-primary text-sm mb-4">{m.email}</div>
                        <p className="text-gray-300 whitespace-pre-wrap bg-black/10 p-4 rounded">{m.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
