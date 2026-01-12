import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import { Plus, Edit2, Trash2, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await api.get('/projects/admin');
    setProjects(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link 
          to="/admin/projects/new" 
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={project._id} 
            className="glass-panel overflow-hidden rounded-xl group relative"
          >
            {/* Image Preview */}
            <div className="h-48 bg-gray-800 relative overflow-hidden">
                {project.projectImage ? (
                    <img src={project.projectImage.startsWith('http') ? project.projectImage : `${import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000'}${project.projectImage}`} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded border ${project.isPublished ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'}`}>
                        {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                </div>
            </div>

            <div className="p-4">
               <h3 className="text-xl font-bold mb-2">{project.title}</h3>
               <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>
               
               <div className="flex gap-2 mb-4 flex-wrap">
                    {project.technologies.slice(0, 3).map(t => (
                        <span key={t} className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300">{t}</span>
                    ))}
                    {project.technologies.length > 3 && <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>}
               </div>

               <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex gap-3">
                         {project.githubLink && <a href={project.githubLink} target="_blank" className="text-gray-400 hover:text-white"><Github size={18}/></a>}
                         {project.liveLink && <a href={project.liveLink} target="_blank" className="text-gray-400 hover:text-white"><ExternalLink size={18}/></a>}
                    </div>
                    <div className="flex gap-2">
                        <Link 
                            to={`/admin/projects/edit/${project._id}`}
                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                        >
                            <Edit2 size={18} />
                        </Link>
                        <button 
                            onClick={() => handleDelete(project._id)}
                            className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
