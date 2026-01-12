import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Check, X, Star, Trash2 } from 'lucide-react';

const TestimonialList = () => {
    const [testimonials, setTestimonials] = useState([]);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      const { data } = await api.get('/testimonials/admin');
      setTestimonials(data);
    };

    const handleApprove = async (id, status) => {
        await api.put(`/testimonials/${id}`, { isApproved: status });
        fetchData();
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete?")) {
            await api.delete(`/testimonials/${id}`);
            fetchData();
        }
    };
  
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Testimonials</h1>
        <div className="grid grid-cols-1 gap-6">
            {testimonials.map(t => (
                <div key={t._id} className="glass-panel p-6 rounded-xl flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{t.name}</h3>
                            <span className="text-sm text-gray-400">({t.role})</span>
                            <div className="flex items-center text-yellow-500 ml-4">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                        </div>
                        <p className="text-gray-300 italic">"{t.message}"</p>
                        <div className="mt-2 text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                         {t.isApproved ? (
                             <button onClick={() => handleApprove(t._id, false)} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded hover:bg-yellow-500/20">Unpublish</button>
                         ) : (
                             <button onClick={() => handleApprove(t._id, true)} className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded hover:bg-green-500/20">Approve</button>
                         )}
                         <button onClick={() => handleDelete(t._id)} className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/20"><Trash2 size={16}/></button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
};
export default TestimonialList;
