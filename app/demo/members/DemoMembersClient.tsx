'use client';

import { useState, useEffect } from 'react';
import { Member, isBirthdayToday } from '@/types/member';
import Navbar from '@/components/Navbar';
import MemberTable from '@/components/MemberTable';

// --- MOCK DATA ---
const INITIAL_MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    nim: '12345678',
    division: 'Hubungan Eksternal',
    position: 'Kepala Divisi',
    phone: '08123456789',
    email: 'ahmad@example.com',
    birth_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Siti Aminah',
    nim: '12345679',
    division: 'Media & Informasi',
    position: 'Staff',
    phone: '08123456780',
    email: 'siti@example.com',
    birth_date: '2002-05-15',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Budi Santoso',
    nim: '12345680',
    division: 'Riset dan Teknologi',
    position: 'Staff',
    phone: '08123456781',
    email: 'budi@example.com',
    birth_date: '2001-11-20',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    nim: '12345681',
    division: 'PPSDM',
    position: 'Staff',
    phone: '08123456782',
    email: 'dewi@example.com',
    birth_date: '2003-01-10',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Rizky Pratama',
    nim: '12345682',
    division: 'Kastrat',
    position: 'Staff',
    phone: '08123456783',
    email: 'rizky@example.com',
    birth_date: '2002-08-25',
    created_at: new Date().toISOString(),
  },
];

export default function DemoMembersClient() {
  const [members] = useState<Member[]>(INITIAL_MOCK_MEMBERS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const divisions = Array.from(
    new Set(members.map((m) => m.division).filter(Boolean) as string[])
  ).sort();

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

  const birthdayToday = members.filter((m) => isBirthdayToday(m.birth_date));

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-amber-500 text-white py-2 px-4 text-center text-sm font-bold sticky top-0 z-[60]">
        🚀 PORTFOLIO DEMO MODE: Fitur Tambah/Edit/Hapus dinonaktifkan untuk keamanan.
      </div>
      
      <Navbar userEmail="demo@portfolio.com" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Anggota (Demo)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Halaman ini menampilkan data simulasi anggota HIMSI.
          </p>
        </div>

        {/* Birthday Banner */}
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
                  placeholder="Cari nama, NIM, divisi..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <select
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className="py-2 pl-3 pr-8 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                <option value="">Semua Divisi</option>
                {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button className="btn-primary whitespace-nowrap opacity-50 cursor-not-allowed pointer-events-none">
              Tambah Anggota
            </button>
          </div>

          <MemberTable
            members={filtered}
            onEdit={() => alert('Mode Demo: Fitur edit dinonaktifkan')}
            onDelete={() => alert('Mode Demo: Fitur hapus dinonaktifkan')}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
