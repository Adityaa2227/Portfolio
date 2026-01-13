import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Plus, Edit2, Trash2, Save, X, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../../../components/Admin/SortableItem';
import { toast } from 'react-hot-toast';

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ category: '', name: '', icon: '', order: 0, isPublished: true });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await api.get('/skills/admin');
    // Ensure sorted by order
    setSkills(data.sort((a,b) => a.order - b.order));
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({ ...skill });
    setIsCreating(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ category: '', name: '', icon: '', order: 0, isPublished: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, formData);
      } else {
        await api.post('/skills', formData);
      }
      fetchSkills();
      resetForm();
    } catch (error) {
      alert('Error saving skill');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete skill?')) {
        await api.delete(`/skills/${id}`);
        fetchSkills();
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
        setSkills((items) => {
            const oldIndex = items.findIndex((item) => item._id === active.id);
            const newIndex = items.findIndex((item) => item._id === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);

            const updates = newItems.map((item, index) => ({
                _id: item._id,
                order: index
            }));

            api.put('/skills/reorder', { skills: updates })
               .catch(() => toast.error('Failed to save order'));

            return newItems;
        });
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Skills</h1>
        {!isCreating && !editingId && (
            <button 
                onClick={() => setIsCreating(true)} 
                className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
            <Plus size={20} />
            <span>Add Skill</span>
            </button>
        )}
      </div>

      {/* Form (Inline or Top) */}
      {(isCreating || editingId) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl mb-8 border border-white/10">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Skill' : 'New Skill'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" 
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Frontend" required />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="React" required />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Icon (Class/URL)</label>
                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-2" 
                        value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="fab fa-react" required />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Order</label>
                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2" 
                        value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 p-2 rounded flex justify-center items-center"><Save/></button>
                    <button type="button" onClick={resetForm} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 p-2 rounded flex justify-center items-center"><X/></button>
                </div>
            </form>
        </motion.div>
      )}

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-8">
            {Object.keys(groupedSkills).map(category => (
                <div key={category}>
                    <h2 className="text-xl font-semibold mb-4 text-primary border-b border-white/10 pb-2">{category}</h2>
                    <SortableContext items={groupedSkills[category].map(s => s._id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {groupedSkills[category].map(skill => (
                                <SortableItem key={skill._id} id={skill._id}>
                                    <div className="glass-card p-4 rounded-lg flex justify-between items-center group cursor-grab active:cursor-grabbing">
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-500"><GripVertical size={16}/></div>
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xl overflow-hidden">
                                                {/* Try to render img if url, else text/icon class */}
                                                {skill.icon.startsWith('http') ? <img src={skill.icon} className="w-6 h-6 object-contain" /> : <span className="text-sm">Icon</span>}
                                            </div>
                                            <div>
                                                <div className="font-bold">{skill.name}</div>
                                                <div className="text-xs text-gray-500">Order: {skill.order}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(skill)} className="text-blue-400 hover:text-white"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(skill._id)} className="text-red-400 hover:text-white"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </div>
            ))}
        </div>
      </DndContext>
    </div>
  );
};

export default SkillList;
