import React, { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Loader2, Mail, Save, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import { apiError, Card, ErrorNote, Field, inputCls, PageHeader, Spinner, Toggle } from '../../components/Admin/ui';

const Saved = ({ children }) => (
  <p role="status" className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={16} aria-hidden /> {children}</p>
);

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwDone, setPwDone] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setSettings(data))
      .catch((err) => setError(apiError(err, 'Couldn’t load settings.')));
  }, []);

  const save = async (patch) => {
    setSaving(true);
    setError('');
    setSaved('');
    try {
      const { data } = await api.put('/settings', patch);
      setSettings(data);
      setSaved('Saved. The site shows it within a minute.');
    } catch (err) {
      setError(apiError(err, 'Couldn’t save settings.'));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwDone(false);
    if (pw.newPassword !== pw.confirm) { setPwError('The two new passwords don’t match.'); return; }
    setPwBusy(true);
    try {
      await api.put('/auth/password', { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      setPwDone(true);
    } catch (err) {
      setPwError(apiError(err, 'Couldn’t change the password.'));
    } finally {
      setPwBusy(false);
    }
  };

  if (!settings) return error ? <ErrorNote>{error}</ErrorNote> : <Spinner label="Loading settings…" />;
  const otw = settings.openToWork;
  const setOtw = (patch) => setSettings((s) => ({ ...s, openToWork: { ...s.openToWork, ...patch } }));

  return (
    <>
      <PageHeader title="Settings" description="Your availability badge, contact-form emails and admin password." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Sparkles size={18} className="text-accent-dark" aria-hidden /> Open-to-work badge</h2>
          <p className="text-sm text-text-muted">Shown at the top of the homepage. Turn it off when you aren&rsquo;t looking.</p>
          <Toggle checked={otw.enabled} onChange={(v) => setOtw({ enabled: v })} label="Show the badge" description="A glowing green dot with your text." />
          <Field label="Badge text" hint="Short, e.g. “Open to SDE roles from June 2027”. Max 80 characters.">
            <input value={otw.text} maxLength={80} onChange={(e) => setOtw({ text: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Extra detail (optional)" hint="Shown on hover, e.g. “Bangalore / remote · full-time”.">
            <input value={otw.detail} maxLength={140} onChange={(e) => setOtw({ detail: e.target.value })} className={inputCls} />
          </Field>
          {/* Preview */}
          <div className="rounded-xl border border-dashed border-border-strong p-4">
            <p className="mb-2 text-xs text-text-subtle">Preview</p>
            {otw.enabled && otw.text ? (
              <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" aria-hidden /> {otw.text}
              </span>
            ) : <span className="text-sm text-text-muted">Badge hidden</span>}
          </div>
          <button type="button" disabled={saving} onClick={() => save({ openToWork: otw })} className="btn-primary disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Save size={16} aria-hidden />} Save badge
          </button>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Mail size={18} className="text-accent-dark" aria-hidden /> Contact form emails</h2>
            <Toggle
              checked={settings.contactAutoReply}
              onChange={(v) => save({ contactAutoReply: v })}
              label="Send an automatic “thanks” reply"
              description="People who use the contact form get a short confirmation from you via Brevo. You always get their message by email."
            />
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><KeyRound size={18} className="text-accent-dark" aria-hidden /> Change password</h2>
            <form onSubmit={changePassword} className="mt-4 space-y-4">
              <Field label="Current password">
                <input type="password" required autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} className={inputCls} />
              </Field>
              <Field label="New password" hint="At least 10 characters, with letters and a number.">
                <input type="password" required minLength={10} autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Confirm new password">
                <input type="password" required autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputCls} />
              </Field>
              {pwError && <ErrorNote>{pwError}</ErrorNote>}
              {pwDone && <Saved>Password changed. Use the new one next time you log in.</Saved>}
              <button type="submit" disabled={pwBusy} className="btn-primary disabled:opacity-60">
                {pwBusy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <KeyRound size={16} aria-hidden />} Change password
              </button>
            </form>
          </Card>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {error && <ErrorNote>{error}</ErrorNote>}
        {saved && <Saved>{saved}</Saved>}
      </div>
    </>
  );
};

export default Settings;
