'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Program } from '@/types/program';
import Navbar from '@/components/Navbar';
import ProgramTable from '@/components/ProgramTable';
import ProgramForm from '@/components/ProgramForm';
import DeleteConfirm from '@/components/DeleteConfirm';

export default function ProgramsClient() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching programs:', error.message);
    } else {
      setPrograms(data as Program[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Filtered list
  const filtered = programs.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false) ||
      (p.target?.toLowerCase().includes(q) ?? false);
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const planned = programs.filter(p => p.status === 'planned').length;
  const ongoing = programs.filter(p => p.status === 'ongoing').length;
  const completed = programs.filter(p => p.status === 'completed').length;

  async function confirmDelete() {
    if (!deletingProgram) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', deletingProgram.id);
      if (error) throw new Error(error.message);
      setDeletingProgram(null);
      await fetchPrograms();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingProgram(null);
    fetchPrograms();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Program Kerja</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data program kerja, relasi, dan aktivitas himpunan.
          </p>
        </div>

        {/* ── Stats Cards ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card px-5 py-4 border-l-4 border-l-slate-400">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Program</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{programs.length}</p>
          </div>
           <div className="card px-5 py-4 border-l-4 border-l-blue-500">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Berjalan</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{ongoing}</p>
          </div>
          <div className="card px-5 py-4 border-l-4 border-l-emerald-500">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Selesai</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{completed}</p>
          </div>
          <div className="card px-5 py-4 border-l-4 border-l-amber-500">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Direncanakan</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{planned}</p>
          </div>
        </div>

        {/* ── Main Table Card ──────────────────────── */}
        <div className="card">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-sm">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari program, deskripsi..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

               {/* Status filter */}
               <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2 pl-3 pr-8 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                <option value="">Semua Status</option>
                <option value="planned">Direncanakan</option>
                <option value="ongoing">Berjalan</option>
                <option value="completed">Selesai</option>
              </select>
            </div>

             <button
              onClick={() => { setEditingProgram(null); setShowForm(true); }}
              className="btn-primary whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Program
            </button>
          </div>

          {/* Result count */}
          {!loading && (
            <div className="px-6 py-2 bg-slate-50/50 border-b border-slate-100">
              <p className="text-xs text-slate-500">
                Menampilkan <strong>{filtered.length}</strong> dari <strong>{programs.length}</strong> program
                {searchQuery && <> — pencarian &ldquo;<strong>{searchQuery}</strong>&rdquo;</>}
              </p>
            </div>
          )}

          <ProgramTable
            programs={filtered}
            onEdit={(p) => { setEditingProgram(p); setShowForm(true); }}
            onDelete={(p) => setDeletingProgram(p)}
            loading={loading}
          />
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <ProgramForm
          program={editingProgram}
          onClose={() => { setShowForm(false); setEditingProgram(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      {deletingProgram && (
        <DeleteConfirm
          itemName={deletingProgram.name}
          itemLabel="Program Kerja"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingProgram(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
