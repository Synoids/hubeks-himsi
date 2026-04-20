'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Member, MemberInsert, DIVISIONS, POSITIONS } from '@/types/member';

interface MemberFormProps {
  member?: Member | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MemberForm({ member, onClose, onSuccess }: MemberFormProps) {
  const isEdit = !!member;
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<MemberInsert>({
    name: member?.name || '',
    nim: member?.nim || '',
    division: member?.division || '',
    position: member?.position || '',
    phone: member?.phone || '',
    email: member?.email || '',
    birth_date: member?.birth_date || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Focus first input on open
  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 100);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!form.name.trim()) { setError('Nama anggota wajib diisi.'); return; }
    if (!form.birth_date) { setError('Tanggal lahir wajib diisi.'); return; }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        nim: form.nim?.trim() || null,
        division: form.division || null,
        position: form.position || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        birth_date: form.birth_date,
      };

      if (isEdit && member) {
        const { error } = await supabase
          .from('members')
          .update(payload)
          .eq('id', member.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('members')
          .insert([payload]);
        if (error) throw new Error(error.message);
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        id="member-form-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-700 to-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isEdit ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                )}
              </svg>
            </div>
            <h2 id="member-form-title" className="text-base font-semibold text-white">
              {isEdit ? 'Edit Anggota' : 'Tambah Anggota'}
            </h2>
          </div>
          <button
            id="btn-close-member-form"
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="px-6 py-5 space-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="member-name" className="label">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="member-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Nama lengkap anggota"
                className="input-field"
              />
            </div>

            {/* NIM */}
            <div>
              <label htmlFor="member-nim" className="label">NIM</label>
              <input
                id="member-nim"
                name="nim"
                type="text"
                value={form.nim || ''}
                onChange={handleChange}
                placeholder="Nomor Induk Mahasiswa"
                className="input-field font-mono"
              />
            </div>

            {/* Division + Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="member-division" className="label">Divisi</label>
                <select
                  id="member-division"
                  name="division"
                  value={form.division || ''}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Pilih divisi</option>
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="member-position" className="label">Jabatan</label>
                <select
                  id="member-position"
                  name="position"
                  value={form.position || ''}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Pilih jabatan</option>
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="member-phone" className="label">Nomor Telepon</label>
                <input
                  id="member-phone"
                  name="phone"
                  type="tel"
                  value={form.phone || ''}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="member-email" className="label">Email</label>
                <input
                  id="member-email"
                  name="email"
                  type="email"
                  value={form.email || ''}
                  onChange={handleChange}
                  placeholder="email@mahasiswa.ac.id"
                  className="input-field"
                />
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="member-birth-date" className="label">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                id="member-birth-date"
                name="birth_date"
                type="date"
                required
                value={form.birth_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
              <p className="text-xs text-slate-400 mt-1">
                Digunakan untuk mengaktifkan fitur notifikasi ulang tahun.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <button id="btn-cancel-member" type="button" onClick={onClose} className="btn-secondary">
              Batal
            </button>
            <button
              id="btn-submit-member"
              type="submit"
              disabled={saving}
              className="btn-primary min-w-[130px] justify-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {isEdit ? 'Simpan Perubahan' : 'Tambah Anggota'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
