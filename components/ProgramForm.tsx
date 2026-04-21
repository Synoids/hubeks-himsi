'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Program, ProgramInsert, ProgramStatus, PROGRAM_STATUSES } from '@/types/program';

interface ProgramFormProps {
  program?: Program | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProgramForm({ program, onClose, onSuccess }: ProgramFormProps) {
  const isEdit = !!program;
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProgramInsert>({
    name: program?.name || '',
    description: program?.description || '',
    tujuan: program?.tujuan || '',
    sasaran: program?.sasaran || '',
    target: program?.target || '',
    pelaksanaan: program?.pelaksanaan || '',
    status: program?.status || 'planned',
    start_date: program?.start_date || '',
    end_date: program?.end_date || '',
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!form.name.trim()) { setError('Nama program wajib diisi.'); return; }

    setSaving(true);
    try {
       const payload = {
        name: form.name.trim(),
        description: form.description?.trim() || null,
        tujuan: form.tujuan?.trim() || null,
        sasaran: form.sasaran?.trim() || null,
        target: form.target?.trim() || null,
        pelaksanaan: form.pelaksanaan?.trim() || null,
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };

      if (isEdit && program) {
         const { error } = await supabase
          .from('programs')
          .update(payload)
          .eq('id', program.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('programs')
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

  const statusLabels: Record<ProgramStatus, string> = {
    planned: 'Direncanakan',
    ongoing: 'Berjalan',
    completed: 'Selesai',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
       <div
        id="program-form-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-700 to-blue-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {isEdit ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    )}
                </svg>
            </div>
            <h2 id="program-form-title" className="text-base font-semibold text-white">
              {isEdit ? 'Edit Program Kerja' : 'Tambah Program Kerja'}
            </h2>
          </div>
          <button
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
             {/* Name & Status */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               <div className="sm:col-span-2">
                 <label htmlFor="program-name" className="label">
                  Nama Program <span className="text-red-500">*</span>
                 </label>
                 <input
                  ref={firstInputRef}
                  id="program-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Studi Banding"
                  className="input-field"
                 />
               </div>
               <div>
                  <label htmlFor="program-status" className="label">Status</label>
                  <select
                    id="program-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {PROGRAM_STATUSES.map(status => (
                      <option key={status} value={status}>{statusLabels[status]}</option>
                    ))}
                  </select>
               </div>
             </div>

             {/* Description */}
             <div>
               <label htmlFor="program-description" className="label">Deskripsi</label>
               <textarea
                 id="program-description"
                 name="description"
                 rows={2}
                 value={form.description || ''}
                 onChange={handleChange}
                 placeholder="Deskripsi singkat..."
                 className="input-field"
               />
             </div>

             {/* Tujuan & Sasaran */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div>
                 <label htmlFor="program-tujuan" className="label">Tujuan</label>
                 <textarea
                   id="program-tujuan"
                   name="tujuan"
                   rows={2}
                   value={form.tujuan || ''}
                   onChange={handleChange}
                   className="input-field"
                 />
               </div>
               <div>
                 <label htmlFor="program-sasaran" className="label">Sasaran</label>
                 <textarea
                   id="program-sasaran"
                   name="sasaran"
                   rows={2}
                   value={form.sasaran || ''}
                   onChange={handleChange}
                   className="input-field"
                 />
               </div>
             </div>

             {/* Target & Pelaksanaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div>
                 <label htmlFor="program-target" className="label">Target</label>
                 <input
                   type="text"
                   id="program-target"
                   name="target"
                   value={form.target || ''}
                   onChange={handleChange}
                   className="input-field"
                 />
               </div>
               <div>
                 <label htmlFor="program-pelaksanaan" className="label">Pelaksanaan</label>
                 <input
                   type="text"
                   id="program-pelaksanaan"
                   name="pelaksanaan"
                   value={form.pelaksanaan || ''}
                   onChange={handleChange}
                   placeholder="Contoh: Bulan Agustus / Minggu ke-3"
                   className="input-field"
                 />
               </div>
             </div>

             {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div>
                 <label htmlFor="program-start-date" className="label">Tanggal Mulai (Opsional)</label>
                 <input
                   type="date"
                   id="program-start-date"
                   name="start_date"
                   value={form.start_date || ''}
                   onChange={handleChange}
                   className="input-field"
                 />
               </div>
               <div>
                 <label htmlFor="program-end-date" className="label">Tanggal Selesai (Opsional)</label>
                 <input
                   type="date"
                   id="program-end-date"
                   name="end_date"
                   value={form.end_date || ''}
                   onChange={handleChange}
                   className="input-field"
                 />
               </div>
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
            <button type="button" onClick={onClose} className="btn-secondary">
              Batal
            </button>
            <button
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
                  {isEdit ? 'Simpan Perubahan' : 'Tambah Program'}
                </>
              )}
            </button>
          </div>
         </form>
       </div>
    </div>
  );
}
