'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/types/program';
import Navbar from '@/components/Navbar';
import ProgramTable from '@/components/ProgramTable';

const MOCK_PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'HIMSI Goes to School',
    description: 'Sosialisasi prodi ke SMA/SMK',
    tujuan: 'Meningkatkan peminat prodi',
    sasaran: 'Siswa SMA',
    target: '10 Sekolah',
    pelaksanaan: 'Mei 2026',
    status: 'ongoing',
    start_date: '2026-05-01',
    end_date: '2026-05-31',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Workshop Web Development',
    description: 'Pelatihan pembuatan website',
    tujuan: 'Skill up anggota',
    sasaran: 'Anggota HIMSI',
    target: '50 Peserta',
    pelaksanaan: 'Juni 2026',
    status: 'planned',
    start_date: '2026-06-15',
    end_date: '2026-06-16',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Company Visit',
    description: 'Kunjungan ke startup lokal',
    tujuan: 'Wawasan industri',
    sasaran: 'Anggota HIMSI',
    target: '30 Peserta',
    pelaksanaan: 'April 2026',
    status: 'completed',
    start_date: '2026-04-10',
    end_date: '2026-04-10',
    created_at: new Date().toISOString(),
  },
];

export default function DemoProgramsClient() {
  const [programs] = useState<Program[]>(MOCK_PROGRAMS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = programs.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false) ||
      (p.target?.toLowerCase().includes(q) ?? false);
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const planned = programs.filter(p => p.status === 'planned').length;
  const ongoing = programs.filter(p => p.status === 'ongoing').length;
  const completed = programs.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-amber-500 text-white py-2 px-4 text-center text-sm font-bold sticky top-0 z-[60]">
        🚀 PORTFOLIO DEMO MODE: Fitur Tambah/Edit/Hapus dinonaktifkan untuk keamanan.
      </div>
      
      <Navbar userEmail="demo@portfolio.com" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Program Kerja (Demo)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Halaman ini menampilkan data simulasi program kerja HIMSI.
          </p>
        </div>

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

        <div className="card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
              <div className="relative flex-1 min-w-[180px] max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari program, deskripsi..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
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
             <button className="btn-primary whitespace-nowrap opacity-50 cursor-not-allowed pointer-events-none">
              Tambah Program
            </button>
          </div>

          <ProgramTable
            programs={filtered}
            onEdit={() => alert('Mode Demo: Fitur edit dinonaktifkan')}
            onDelete={() => alert('Mode Demo: Fitur hapus dinonaktifkan')}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
