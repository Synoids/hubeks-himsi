'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Member, isBirthdayToday } from '@/types/member';
import Navbar from '@/components/Navbar';
import MemberTable from '@/components/MemberTable';
import MemberForm from '@/components/MemberForm';
import DeleteConfirm from '@/components/DeleteConfirm';

export default function MembersClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching members:', error.message);
    } else {
      setMembers(data as Member[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Unique divisions for filter dropdown
  const divisions = Array.from(
    new Set(members.map((m) => m.division).filter(Boolean) as string[])
  ).sort();

  // Filtered list
  const filtered = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      (m.nim?.toLowerCase().includes(q) ?? false) ||
      (m.division?.toLowerCase().includes(q) ?? false) ||
      (m.position?.toLowerCase().includes(q) ?? false) ||
      (m.email?.toLowerCase().includes(q) ?? false);
    const matchDivision = !filterDivision || m.division === filterDivision;
    return matchSearch && matchDivision;
  });

  // Birthday members
  const birthdayToday = members.filter((m) => isBirthdayToday(m.birth_date));

  async function confirmDelete() {
    if (!deletingMember) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', deletingMember.id);
      if (error) throw new Error(error.message);
      setDeletingMember(null);
      await fetchMembers();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingMember(null);
    fetchMembers();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Anggota</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data anggota HIMSI dan informasi ulang tahun mereka.
          </p>
        </div>

        {/* ── Birthday Banner ──────────────────────── */}
        {!loading && birthdayToday.length > 0 && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 p-5 shadow-md shadow-amber-200">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎂</div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-white text-base">Selamat Ulang Tahun!</h2>
                <p className="text-amber-100 text-sm mt-0.5">
                  Hari ini ada {birthdayToday.length} anggota yang berulang tahun:
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {birthdayToday.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white text-sm font-semibold border border-white/30"
                    >
                      🎉 {m.name}
                      {m.division && (
                        <span className="text-amber-100 font-normal text-xs">· {m.division}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Stats Cards ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Anggota</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{members.length}</p>
          </div>
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Divisi Aktif</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{divisions.length}</p>
          </div>
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ultah Hari Ini</p>
            <p className={`text-3xl font-bold mt-1 ${birthdayToday.length > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
              {birthdayToday.length}
            </p>
          </div>
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hasil Pencarian</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{filtered.length}</p>
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
                  id="search-members"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, NIM, divisi..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Division filter */}
              <select
                id="filter-division"
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className="py-2 pl-3 pr-8 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                <option value="">Semua Divisi</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              id="btn-add-member"
              onClick={() => { setEditingMember(null); setShowForm(true); }}
              className="btn-primary whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Tambah Anggota
            </button>
          </div>

          {/* Result count */}
          {!loading && (
            <div className="px-6 py-2 bg-slate-50/50 border-b border-slate-100">
              <p className="text-xs text-slate-500">
                Menampilkan <strong>{filtered.length}</strong> dari <strong>{members.length}</strong> anggota
                {searchQuery && <> — pencarian &ldquo;<strong>{searchQuery}</strong>&rdquo;</>}
              </p>
            </div>
          )}

          <MemberTable
            members={filtered}
            onEdit={(m) => { setEditingMember(m); setShowForm(true); }}
            onDelete={(m) => setDeletingMember(m)}
            loading={loading}
          />
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <MemberForm
          member={editingMember}
          onClose={() => { setShowForm(false); setEditingMember(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      {deletingMember && (
        <DeleteConfirm
          itemName={deletingMember.name}
          itemLabel="Anggota"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingMember(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
