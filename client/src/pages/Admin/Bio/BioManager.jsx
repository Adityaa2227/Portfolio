import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { toast } from 'react-hot-toast';

const BioManager = () => {
    const [formData, setFormData] = useState({
        greeting: '',
        introduction: '',
        bioDescription: '',
        stats: [] // [{label: 'Label', value: 'Value', icon: ''}]
    });

    useEffect(() => {
        fetchBio();
    }, []);

    const fetchBio = async () => {
        try {
            const { data } = await api.get('/bio');
            setFormData(data || { greeting: '', introduction: '', bioDescription: '', stats: [] });
        } catch (error) {
            console.error('Error fetching bio:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/bio', formData);
            toast.success('Bio updated successfully');
        } catch (error) {
            toast.error('Failed to update bio');
            console.error(error);
        }
    };

    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Manage Bio / About Me</h2>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-gray-800 p-8 rounded-xl shadow-lg">
                <div>
                    <label className="block text-gray-400 mb-2">Greeting (e.g., Who I Am)</label>
                    <input 
                        type="text" 
                        name="greeting" 
                        value={formData.greeting} 
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Short Introduction</label>
                    <textarea 
                        name="introduction" 
                        value={formData.introduction} 
                        onChange={handleChange}
                        rows="3"
                        className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Detailed Description</label>
                    <div className="text-xs text-gray-500 mb-1">Supports basic HTML if needed for line breaks</div>
                    <textarea 
                        name="bioDescription" 
                        value={formData.bioDescription} 
                        onChange={handleChange}
                        rows="6"
                        className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Stats could be added here dynamically, for now simplified */}
                
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default BioManager;
