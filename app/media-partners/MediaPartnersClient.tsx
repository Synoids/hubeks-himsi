'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MediaPartner } from '@/types/mediaPartner';
import PartnerTable from '@/components/PartnerTable';
import PartnerForm from '@/components/PartnerForm';
import DeleteConfirm from '@/components/DeleteConfirm';
import Navbar from '@/components/Navbar';

export default function MediaPartnersClient() {

  const [partners, setPartners] = useState<MediaPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<MediaPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<MediaPartner | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  // Fetch partners
  const fetchPartners = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media_partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partners:', error.message);
    } else {
      setPartners(data as MediaPartner[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Filtered list
  const filtered = partners.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (p.type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalActive = partners.filter((p) => p.status === 'active').length;
  const totalInactive = partners.filter((p) => p.status === 'inactive').length;
  const totalWithMou = partners.filter((p) => p.mou_url).length;



  function handleAddPartner() {
    setEditingPartner(null);
    setShowForm(true);
  }

  function handleEditPartner(partner: MediaPartner) {
    setEditingPartner(partner);
    setShowForm(true);
  }

  function handleDeletePartner(partner: MediaPartner) {
    setDeletingPartner(partner);
  }

  async function confirmDelete() {
    if (!deletingPartner) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('media_partners')
        .delete()
        .eq('id', deletingPartner.id);

      if (error) throw new Error(error.message);

      setDeletingPartner(null);
      await fetchPartners();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingPartner(null);
    fetchPartners();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Mitra Media</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola mitra media, sponsor, dan komunitas HIMSI beserta dokumen MoU.
          </p>
        </div>

        {/* ── Stats Cards ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Mitra</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{partners.length}</p>
          </div>
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Aktif</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{totalActive}</p>
          </div>
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nonaktif</p>
            <p className="text-3xl font-bold text-slate-400 mt-1">{totalInactive}</p>
          </div>
          <div className="card px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Punya MoU</p>
            <p className="text-3xl font-bold text-cyan-600 mt-1">{totalWithMou}</p>
          </div>
        </div>

        {/* ── Main Card ───────────────────────── */}
        <div className="card">
          {/* Card Header: search + filter + add */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  id="search-partners"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, tipe, kontak..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Status filter */}
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="py-2 pl-3 pr-8 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>

            {/* Add button */}
            <button
              id="btn-add-partner"
              onClick={handleAddPartner}
              className="btn-primary whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Tambah Mitra
            </button>
          </div>

          {/* Result count */}
          {!loading && (
            <div className="px-6 py-2 bg-slate-50/50 border-b border-slate-100">
              <p className="text-xs text-slate-500">
                Menampilkan <strong>{filtered.length}</strong> dari <strong>{partners.length}</strong> mitra
                {searchQuery && (
                  <> untuk pencarian &ldquo;<strong>{searchQuery}</strong>&rdquo;</>
                )}
              </p>
            </div>
          )}

          {/* Table */}
          <PartnerTable
            partners={filtered}
            onEdit={handleEditPartner}
            onDelete={handleDeletePartner}
            loading={loading}
          />
        </div>
      </main>

      {/* ── Modals ─────────────────────────────── */}
      {showForm && (
        <PartnerForm
          partner={editingPartner}
          onClose={() => {
            setShowForm(false);
            setEditingPartner(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {deletingPartner && (
        <DeleteConfirm
          itemName={deletingPartner.name}
          itemLabel="Mitra Media"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingPartner(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
