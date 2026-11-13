import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, Badge, Empty, ErrorNote, PageHeader, Spinner } from '../../../components/Admin/ui';

const PostList = () => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/posts/admin')
      .then(({ data }) => setPosts(data))
      .catch((err) => { setPosts([]); setError(apiError(err, 'Couldn’t load posts.')); });
  }, []);

  const remove = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This can’t be undone.`)) return;
    try {
      await api.delete(`/posts/${post._id}`);
      setPosts((list) => list.filter((p) => p._id !== post._id));
    } catch (err) {
      setError(apiError(err, 'Couldn’t delete the post.'));
    }
  };

  return (
    <>
      <PageHeader
        title="Blog"
        description="Notes and articles shown at /blog. Write in Markdown, or drop rough notes and let AI draft the post."
        actions={<Link to="/admin/blog/new" className="btn-primary"><Plus size={16} aria-hidden /> New post</Link>}
      />
      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}
      {posts === null ? (
        <Spinner label="Loading posts…" />
      ) : posts.length === 0 ? (
        <Empty Icon={FileText} title="No posts yet" action={<Link to="/admin/blog/new" className="btn-primary"><Plus size={16} aria-hidden /> Write your first post</Link>}>
          Good topics: a system you designed, a hard bug you fixed, what you learned at PayPal, a DSA pattern explained.
        </Empty>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p._id} className="flex items-center gap-4 rounded-2xl glass p-4">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <Link to={`/admin/blog/edit/${p._id}`} className="truncate font-semibold text-foreground hover:text-accent-dark">{p.title}</Link>
                  {p.isPublished ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}
                </p>
                <p className="mt-0.5 truncate text-sm text-text-muted">
                  {p.readingMinutes} min read · updated {new Date(p.updatedAt).toLocaleDateString()}
                  {p.tags?.length ? ` · ${p.tags.join(', ')}` : ''}
                </p>
              </div>
              {p.isPublished && (
                <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title} on site`} className="rounded-lg p-2 text-text-subtle hover:bg-accent/15 hover:text-foreground">
                  <ExternalLink size={17} aria-hidden />
                </a>
              )}
              <Link to={`/admin/blog/edit/${p._id}`} aria-label={`Edit ${p.title}`} className="rounded-lg p-2 text-text-subtle hover:bg-accent/15 hover:text-foreground"><Pencil size={17} aria-hidden /></Link>
              <button type="button" onClick={() => remove(p)} aria-label={`Delete ${p.title}`} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={17} aria-hidden /></button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PostList;
