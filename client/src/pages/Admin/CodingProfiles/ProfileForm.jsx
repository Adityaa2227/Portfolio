import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-hot-toast';

const ProfileForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        handle: '',
        stats: '',
        desc: '',
        icon: '',
        link: '',
        color: ''
    });

    useEffect(() => {
        if (id) {
            const fetchProfile = async () => {
                const { data } = await api.get('/coding-profiles');
                const profile = data.find(p => p._id === id);
                if (profile) setFormData(profile);
            };
            fetchProfile();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/coding-profiles/${id}`, formData);
                toast.success('Profile updated');
            } else {
                await api.post('/coding-profiles', formData);
                toast.success('Profile created');
            }
            navigate('/admin/profiles');
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    return (
        <div className="p-6 text-white min-h-screen flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg space-y-4">
                <h2 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Coding Profile</h2>
                
                <input required placeholder="Platform Name (e.g. LeetCode)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <input required placeholder="Handle / Username" value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <input required placeholder="Stats (e.g. 500+ Solved)" value={formData.stats} onChange={e => setFormData({...formData, stats: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <textarea placeholder="Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-700 p-3 rounded" rows="3" />
                <input required placeholder="Icon URL" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <input required placeholder="Profile Link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <input placeholder="Text Color Class (e.g. text-yellow-500)" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />

                <button type="submit" className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-700">Save</button>
            </form>
        </div>
    );
};

export default ProfileForm;
