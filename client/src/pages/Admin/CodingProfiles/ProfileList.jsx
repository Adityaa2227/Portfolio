import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);

    const fetchProfiles = async () => {
        const { data } = await api.get('/coding-profiles');
        setProfiles(data);
    };

    useEffect(() => { fetchProfiles(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/coding-profiles/${id}`);
            setProfiles(profiles.filter(p => p._id !== id));
            toast.success('Profile deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="p-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Coding Profiles</h2>
                <Link to="/admin/profiles/new" className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={18} /> Add New
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map(profile => (
                    <div key={profile._id} className="bg-gray-800 p-6 rounded-lg relative group">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={profile.icon} alt={profile.name} className="w-10 h-10 object-contain" />
                            <div>
                                <h3 className="font-bold">{profile.name}</h3>
                                <p className="text-gray-400 text-sm">{profile.handle}</p>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/profiles/edit/${profile._id}`} className="bg-blue-500 p-2 rounded-full hover:bg-blue-600">
                                <Edit size={16} />
                            </Link>
                            <button onClick={() => handleDelete(profile._id)} className="bg-red-500 p-2 rounded-full hover:bg-red-600">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileList;
