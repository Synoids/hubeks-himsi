'use client';

import { useState, useEffect } from 'react';
import { MediaPartner } from '@/types/mediaPartner';
import PartnerTable from '@/components/PartnerTable';
import Navbar from '@/components/Navbar';

const MOCK_PARTNERS: MediaPartner[] = [
  {
    id: '1',
    name: 'Tech Daily Indonesia',
    type: 'Media',
    contact_person: 'John Doe',
    phone: '0899887766',
    email: 'contact@techdaily.id',
    mou_url: 'dummy-url',
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Startup Palembang',
    type: 'Community',
    contact_person: 'Jane Smith',
    phone: '0899887755',
    email: 'hello@startupplg.com',
    mou_url: null,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Event Update',
    type: 'Media',
    contact_person: 'Michael',
    phone: '0899887744',
    email: 'ads@eventupdate.com',
    mou_url: 'dummy-url',
    status: 'inactive',
    created_at: new Date().toISOString(),
  },
];

export default function DemoPartnersClient() {
  const [partners] = useState<MediaPartner[]>(MOCK_PARTNERS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = partners.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (p.type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalActive = partners.filter((p) => p.status === 'active').length;
  const totalInactive = partners.filter((p) => p.status === 'inactive').length;
  const totalWithMou = partners.filter((p) => p.mou_url).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-amber-500 text-white py-2 px-4 text-center text-sm font-bold sticky top-0 z-[60]">
        🚀 PORTFOLIO DEMO MODE: Fitur Tambah/Edit/Hapus dinonaktifkan untuk keamanan.
      </div>
      
      <Navbar userEmail="demo@portfolio.com" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Mitra (Demo)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Halaman ini menampilkan data simulasi mitra media HIMSI.
          </p>
        </div>

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

        <div className="card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, tipe, kontak..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="py-2 pl-3 pr-8 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
            <button className="btn-primary whitespace-nowrap opacity-50 cursor-not-allowed pointer-events-none">
              Tambah Mitra
            </button>
          </div>

          <PartnerTable
            partners={filtered}
            onEdit={() => alert('Mode Demo: Fitur edit dinonaktifkan')}
            onDelete={() => alert('Mode Demo: Fitur hapus dinonaktifkan')}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
