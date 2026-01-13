import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { Upload, X, Save } from 'lucide-react';

const ProjectForm = () => {
  const { id } = useParams(); // If id exists, it's Edit mode
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: 'Other',
    tags: '',
    githubLink: '',
    liveLink: '',
    youtubeVideoUrl: '',
    isFeatured: false,
    isPublished: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    const { data } = await api.get(`/projects/admin`); 
    // Optimization: create /api/projects/:id endpoint for admin explicitly or just use the list filter? 
    // Actually the PUT endpoint needs the ID.
    // I don't have a Get Single Project public endpoint in Public Routes yet? I have "All".
    // I should probably add GET /:id to project routes for efficiency, but I can filter from the list or just Add GET /:id.
    // Wait, projectRoutes has `/:id`. The public GET / is list. The /:id is PUT/DELETE.
    // I didn't add GET /:id. I should add it or just lazy load from the list if I had state management, but here I should fetch.
    // I will filter from the Admin list for now for simplicity or just fetch standard GET items?
    // Let's just create GET /projects/:id properly in backend later or now?
    // I'll filter from array in frontend if I had context, but I don't.
    // I will add GET /:id to backend quickly or just hack it.
    // I'll Hack it: fetch all admin projects and find by ID.
    const all = data;
    const project = all.find(p => p._id === id);
    if (project) {
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies.join(', '),
            category: project.category || 'Other',
            tags: project.tags.join(', '),
            githubLink: project.githubLink || '',
            liveLink: project.liveLink || '',
            youtubeVideoUrl: project.youtubeVideoUrl || '',
            isFeatured: project.isFeatured,
            isPublished: project.isPublished,
        });
        if (project.projectImage) {
            setPreview(project.projectImage.startsWith('http') ? project.projectImage : `${import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000'}${project.projectImage}`);
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
    });
    if (imageFile) {
        data.append('image', imageFile);
    }

    try {
      if (id) {
        await api.put(`/projects/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/projects', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error(error);
      alert('Error saving project');
    } finally {
        setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{id ? 'Edit Project' : 'New Project'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-xl font-semibold text-primary">Basic Info</h3>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2 focus:border-primary outline-none" 
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 focus:border-primary outline-none h-32" 
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required
                    />
                </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-xl font-semibold text-primary">Media & Links</h3>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Project Image</label>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-32 mx-auto object-cover rounded" />
                        ) : (
                            <div className="py-8 text-gray-400">
                                <Upload className="mx-auto mb-2" />
                                <span>Click to Upload</span>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">YouTube URL (Embed)</label>
                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" 
                        value={formData.youtubeVideoUrl} onChange={e => setFormData({...formData, youtubeVideoUrl: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">GitHub</label>
                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" 
                            value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Live Demo</label>
                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" 
                            value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                 <h3 className="text-xl font-semibold text-primary">Tech & Tags</h3>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Technologies (comma separated)</label>
                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" placeholder="React, Node.js, MongoDB"
                        value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})}
                    />
                </div>
                <div>
                     <label className="block text-sm text-gray-400 mb-1">Category</label>
                     <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" placeholder="Full Stack / Game / Tool"
                         value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                     />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" placeholder="Full Stack, UI/UX"
                        value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})}
                    />
                </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-xl font-semibold text-primary">Settings</h3>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-primary" 
                            checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})}
                        />
                        <span>Published</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-primary" 
                             checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                        />
                        <span>Featured</span>
                    </label>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/admin/projects')} className="px-6 py-2 rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="bg-primary hover:bg-blue-600 px-8 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Project'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
