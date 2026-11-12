import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Common/Logo';
import { apiError, ErrorNote, Field, inputCls } from '../../components/Admin/ui';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.status === 401 ? 'Wrong username or password.' : apiError(err, 'Couldn’t log in. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center p-4">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 50% at 50% 30%, rgb(var(--c-accent) / 0.25), transparent 70%)' }} />
      <div className="relative w-full max-w-sm rounded-3xl glass-strong p-8 shadow-[0_30px_90px_-30px_rgb(var(--c-accent)/0.7)]">
        <div className="flex flex-col items-center text-center">
          <Logo className="text-5xl" />
          <h1 className="mt-5 font-heading text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-text-muted">Manage projects, resume, reviews and messages.</p>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field label="Username">
            <input required autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Password">
            <input required type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
          </Field>
          {error && <ErrorNote>{error}</ErrorNote>}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-70">
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Lock size={16} aria-hidden />}
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
