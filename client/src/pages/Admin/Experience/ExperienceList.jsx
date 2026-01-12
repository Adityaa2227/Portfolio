import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ExperienceList = () => {
    const [experiences, setExperiences] = useState([]);

    const fetchExperience = async () => {
        const { data } = await api.get('/experience');
        setExperiences(data);
    };

    useEffect(() => { fetchExperience(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/experience/${id}`);
            setExperiences(experiences.filter(e => e._id !== id));
            toast.success('Experience deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="p-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Experience</h2>
                <Link to="/admin/experience/new" className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={18} /> Add New
                </Link>
            </div>
            <div className="space-y-4">
                {experiences.map(exp => (
                    <div key={exp._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{exp.role}</h3>
                            <p className="text-gray-400">{exp.company}</p>
                        </div>
                        <div className="flex gap-4">
                            <Link to={`/admin/experience/edit/${exp._id}`} className="text-blue-400 hover:text-blue-300">
                                <Edit size={20} />
                            </Link>
                            <button onClick={() => handleDelete(exp._id)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceList;
