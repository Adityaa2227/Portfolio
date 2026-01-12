import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Upload, FileText, Check, Clock } from 'lucide-react';

const ResumeManager = () => {
  const [activeResume, setActiveResume] = useState(null);
  const [history, setHistory] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const { data } = await api.get('/resume/all');
    setActiveResume(data.find(r => r.isActive));
    setHistory(data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
        await api.post('/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        fetchResumes();
        setFile(null);
    } catch (error) {
        alert('Upload failed');
    } finally {
        setLoading(false);
    }
  };

  const handleActivate = async (id) => {
      try {
          await api.put(`/resume/${id}/active`);
          fetchResumes();
      } catch (error) {
          alert('Activation failed');
      }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resume Manager</h1>

        {/* Active Resume Card */}
        <div className="glass-panel p-8 rounded-xl mb-10 border border-primary/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-50">
                 <FileText size={100} className="text-primary/20" />
             </div>
             
             <h2 className="text-2xl font-bold mb-4">Active Resume</h2>
             {activeResume ? (
                 <div className="flex items-center gap-6">
                     <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4 border border-white/10">
                         <div className="p-3 bg-red-500/20 rounded-lg text-red-500"><FileText size={32}/></div>
                         <div>
                             <div className="font-semibold text-lg">{activeResume.fileName}</div>
                             <div className="text-sm text-gray-400">Uploaded: {new Date(activeResume.createdAt).toLocaleDateString()}</div>
                         </div>
                     </div>
                     <a href={`${import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000'}${activeResume.fileUrl}`} target="_blank" className="text-blue-400 hover:underline">View PDF</a>
                 </div>
             ) : (
                 <p className="text-gray-400">No active resume.</p>
             )}
        </div>

        {/* Upload New */}
        <div className="glass-panel p-6 rounded-xl mb-10">
            <h3 className="text-xl font-bold mb-4">Upload New Version</h3>
            <form onSubmit={handleUpload} className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">Select PDF File</label>
                    <input 
                        type="file" 
                        accept="application/pdf"
                        className="w-full bg-black/20 border border-white/10 rounded p-2"
                        onChange={e => setFile(e.target.files[0])}
                    />
                </div>
                <button 
                    disabled={!file || loading}
                    type="submit" 
                    className="bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <Upload size={18} />
                    {loading ? 'Uploading...' : 'Upload & Activate'}
                </button>
            </form>
        </div>

        {/* History */}
        <div>
            <h3 className="text-xl font-bold mb-4">History</h3>
            <div className="space-y-3">
                {history.map(item => (
                    <div key={item._id} className={`glass-card p-4 rounded-lg flex justify-between items-center ${item.isActive ? 'border-l-4 border-l-primary' : 'opacity-60'}`}>
                        <div className="flex items-center gap-4">
                             <FileText size={20} className="text-gray-400" />
                             <div>
                                 <div className="font-semibold">{item.fileName}</div>
                                 <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
                             </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {!item.isActive && (
                                <button onClick={() => handleActivate(item._id)} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-sm">
                                    Set Active
                                </button>
                            )}
                            {item.isActive && <span className="text-primary flex items-center gap-1"><Check size={14}/> Active</span>}
                            <a href={`${import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000'}${item.fileUrl}`} target="_blank" className="text-gray-400 hover:text-white"><Clock size={16}/></a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ResumeManager;
