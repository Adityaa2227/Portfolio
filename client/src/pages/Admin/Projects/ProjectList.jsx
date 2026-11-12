import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Pencil, Trash2, GripVertical, FolderGit2, ExternalLink, Star, Eye, EyeOff } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, Badge, Empty, ErrorNote, PageHeader, Spinner, fileUrl } from '../../../components/Admin/ui';

const Row = ({ project, onToggle, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li ref={setNodeRef} style={style} className={`flex items-center gap-3 rounded-2xl glass p-3 sm:gap-4 sm:p-4 ${isDragging ? 'z-10 border-accent shadow-xl' : ''}`}>
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${project.title}`}
        className="cursor-grab touch-none rounded-lg p-1.5 text-text-subtle hover:bg-accent/15 hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical size={18} aria-hidden />
      </button>

      <div className="hidden h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted sm:block">
        {project.projectImage && <img src={fileUrl(project.projectImage)} alt="" className="h-full w-full object-cover object-top" loading="lazy" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <Link to={`/admin/projects/edit/${project._id}`} className="truncate font-semibold text-foreground hover:text-accent-dark">{project.title}</Link>
          {project.isPublished ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
          {project.isFeatured && <Badge tone="accent"><Star size={11} className="fill-current" aria-hidden /> Featured</Badge>}
        </p>
        <p className="mt-0.5 truncate text-sm text-text-muted">{project.category} · {(project.technologies || []).slice(0, 4).join(', ')}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onToggle(project, 'isFeatured')}
          title={project.isFeatured ? 'Remove from featured' : 'Mark as featured'}
          aria-label={project.isFeatured ? `Remove ${project.title} from featured` : `Feature ${project.title}`}
          className={`rounded-lg p-2 hover:bg-accent/15 ${project.isFeatured ? 'text-amber-300' : 'text-text-subtle hover:text-foreground'}`}
        >
          <Star size={17} className={project.isFeatured ? 'fill-current' : ''} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onToggle(project, 'isPublished')}
          title={project.isPublished ? 'Hide from site' : 'Publish'}
          aria-label={project.isPublished ? `Hide ${project.title}` : `Publish ${project.title}`}
          className="rounded-lg p-2 text-text-subtle hover:bg-accent/15 hover:text-foreground"
        >
          {project.isPublished ? <Eye size={17} aria-hidden /> : <EyeOff size={17} aria-hidden />}
        </button>
        {project.slug && (
          <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer" title="View on site" aria-label={`View ${project.title} on site`} className="hidden rounded-lg p-2 text-text-subtle hover:bg-accent/15 hover:text-foreground sm:inline-flex">
            <ExternalLink size={17} aria-hidden />
          </a>
        )}
        <Link to={`/admin/projects/edit/${project._id}`} title="Edit" aria-label={`Edit ${project.title}`} className="rounded-lg p-2 text-text-subtle hover:bg-accent/15 hover:text-foreground">
          <Pencil size={17} aria-hidden />
        </Link>
        <button type="button" onClick={() => onDelete(project)} title="Delete" aria-label={`Delete ${project.title}`} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10">
          <Trash2 size={17} aria-hidden />
        </button>
      </div>
    </li>
  );
};

const ProjectList = () => {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = () =>
    api.get('/projects/admin')
      .then(({ data }) => setProjects(data))
      .catch((err) => { setProjects([]); setError(apiError(err, 'Couldn’t load projects.')); });

  useEffect(() => { load(); }, []);

  const onToggle = async (project, field) => {
    const next = !project[field];
    setProjects((list) => list.map((p) => (p._id === project._id ? { ...p, [field]: next } : p)));
    try {
      await api.put(`/projects/${project._id}`, { [field]: next });
    } catch (err) {
      setError(apiError(err, 'Couldn’t save that change.'));
      load();
    }
  };

  const onDelete = async (project) => {
    if (!window.confirm(`Delete “${project.title}”? This can’t be undone.`)) return;
    try {
      await api.delete(`/projects/${project._id}`);
      setProjects((list) => list.filter((p) => p._id !== project._id));
    } catch (err) {
      setError(apiError(err, 'Couldn’t delete the project.'));
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setProjects((items) => {
      const next = arrayMove(items, items.findIndex((i) => i._id === active.id), items.findIndex((i) => i._id === over.id));
      api.put('/projects/reorder', { items: next.map((p, order) => ({ _id: p._id, order })) })
        .catch((err) => setError(apiError(err, 'Couldn’t save the new order.')));
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Drag the handle to change the order on the site. The star features a project on the homepage; the eye shows or hides it."
        actions={<Link to="/admin/projects/new" className="btn-primary"><Plus size={16} aria-hidden /> New project</Link>}
      />
      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}
      {projects === null ? (
        <Spinner label="Loading projects…" />
      ) : projects.length === 0 ? (
        <Empty Icon={FolderGit2} title="No projects yet" action={<Link to="/admin/projects/new" className="btn-primary"><Plus size={16} aria-hidden /> Add your first project</Link>}>
          Projects you add here appear on the site straight away.
        </Empty>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={projects.map((p) => p._id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-3">
              {projects.map((p) => <Row key={p._id} project={p} onToggle={onToggle} onDelete={onDelete} />)}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </>
  );
};

export default ProjectList;
