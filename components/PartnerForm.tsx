'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MediaPartner, MediaPartnerInsert, PARTNER_TYPES, PARTNER_STATUSES } from '@/types/mediaPartner';

interface PartnerFormProps {
  partner?: MediaPartner | null; // null = Add mode, MediaPartner = Edit mode
  onClose: () => void;
  onSuccess: () => void;
}

export default function PartnerForm({ partner, onClose, onSuccess }: PartnerFormProps) {
  const isEdit = !!partner;
  const dialogRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<MediaPartnerInsert>({
    name: partner?.name || '',
    type: partner?.type || '',
    contact_person: partner?.contact_person || '',
    phone: partner?.phone || '',
    email: partner?.email || '',
    mou_url: partner?.mou_url || null,
    status: partner?.status || 'active',
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(partner?.mou_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selected.type)) {
      setError('Format file tidak didukung. Gunakan PDF, JPG, atau PNG.');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (selected.size > maxSize) {
      setError('Ukuran file maksimal 10 MB.');
      return;
    }

    setError(null);
    setFile(selected);
    setFilePreview(URL.createObjectURL(selected));
  }

  async function uploadMouFile(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const fileName = `mou_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('mou-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) throw new Error(`Upload gagal: ${error.message}`);

    const { data: urlData } = supabase.storage
      .from('mou-files')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let mouUrl = form.mou_url;

      // Upload new file if selected
      if (file) {
        setUploading(true);
        mouUrl = await uploadMouFile(file);
        setUploading(false);
      }

      const payload = { ...form, mou_url: mouUrl };

      if (isEdit && partner) {
        const { error } = await supabase
          .from('media_partners')
          .update(payload)
          .eq('id', partner.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('media_partners')
          .insert([payload]);
        if (error) throw new Error(error.message);
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        id="partner-form-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
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
            <h2 id="form-title" className="text-base font-semibold text-white">
              {isEdit ? 'Edit Mitra Media' : 'Tambah Mitra Media'}
            </h2>
          </div>
          <button
            id="btn-close-form"
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="px-6 py-5 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="label">
                Nama Mitra <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Metro TV, CNN Indonesia"
                className="input-field"
              />
            </div>

            {/* Type + Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="type" className="label">Tipe Mitra</label>
                <select
                  id="type"
                  name="type"
                  value={form.type || ''}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Pilih tipe</option>
                  {PARTNER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="label">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  {PARTNER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s === 'active' ? 'Aktif' : 'Nonaktif'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contact_person" className="label">Nama Kontak Person</label>
              <input
                id="contact_person"
                name="contact_person"
                type="text"
                value={form.contact_person || ''}
                onChange={handleChange}
                placeholder="Nama PIC dari mitra"
                className="input-field"
              />
            </div>

            {/* Phone + Email row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone" className="label">Nomor Telepon</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone || ''}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email || ''}
                  onChange={handleChange}
                  placeholder="email@mitra.com"
                  className="input-field"
                />
              </div>
            </div>

            {/* MoU File Upload */}
            <div>
              <label className="label">Dokumen MoU</label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 text-center cursor-pointer transition-all duration-150 group relative bg-slate-50/50 hover:bg-blue-50/30">
                <input
                  id="mou-file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                ) : filePreview && isEdit ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-slate-600">MoU sudah ada. Klik untuk ganti file.</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.44 1.845" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                        Klik untuk unggah MoU
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG — maks. 10 MB</p>
                    </div>
                  </div>
                )}
              </div>
              {filePreview && isEdit && !file && (
                <a
                  href={filePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs text-cyan-600 hover:text-cyan-700 underline"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Lihat MoU saat ini
                </a>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <button
              id="btn-cancel-form"
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              id="btn-submit-form"
              type="submit"
              disabled={saving || uploading}
              className="btn-primary min-w-[120px] justify-center"
            >
              {(saving || uploading) ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {uploading ? 'Mengunggah...' : 'Menyimpan...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {isEdit ? 'Simpan Perubahan' : 'Tambah Mitra'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
