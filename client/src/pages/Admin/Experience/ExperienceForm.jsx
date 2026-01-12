import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-hot-toast';

const ExperienceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        duration: '',
        description: '',
        skills: '' // Comma separated for input
    });

    useEffect(() => {
        if (id) {
            const fetchExp = async () => {
                const { data } = await api.get('/experience');
                const exp = data.find(e => e._id === id);
                if (exp) {
                    setFormData({
                        ...exp,
                        skills: exp.skills.join(', ')
                    });
                }
            };
            fetchExp();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim())
            };

            if (id) {
                await api.put(`/experience/${id}`, payload);
                toast.success('Experience updated');
            } else {
                await api.post('/experience', payload);
                toast.success('Experience created');
            }
            navigate('/admin/experience');
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    return (
        <div className="p-6 text-white min-h-screen flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg space-y-4">
                <h2 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Experience</h2>
                
                <input required placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <input required placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <input required placeholder="Duration (e.g. 2023 - Present)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />
                <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-700 p-3 rounded" rows="4" />
                <input placeholder="Skills (comma separated)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-gray-700 p-3 rounded" />

                <button type="submit" className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-700">Save</button>
            </form>
        </div>
    );
};

export default ExperienceForm;
