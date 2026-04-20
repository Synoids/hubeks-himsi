'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Member, isBirthdayToday, formatBirthDate, getAge } from '@/types/member';
import { MediaPartner } from '@/types/mediaPartner';
import Navbar from '@/components/Navbar';

export default function DashboardClient() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [partners, setPartners] = useState<MediaPartner[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const todayStr = today.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: membersData }, { data: partnersData }] = await Promise.all([
      supabase.from('members').select('*').order('name'),
      supabase.from('media_partners').select('*').order('created_at', { ascending: false }),
    ]);
    setMembers((membersData as Member[]) || []);
    setPartners((partnersData as MediaPartner[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    fetchData();
  }, [fetchData]);

  const birthdayToday = members.filter((m) => isBirthdayToday(m.birth_date));
  const activePartners = partners.filter((p) => p.status === 'active');
  const partnersWithMou = partners.filter((p) => p.mou_url);

  // Upcoming birthdays — next 30 days (excluding today)
  const upcomingBirthdays = members
    .filter((m) => {
      if (isBirthdayToday(m.birth_date)) return false;
      const [, month, day] = m.birth_date.split('-').map(Number);
      const thisYear = today.getFullYear();
      let bday = new Date(thisYear, month - 1, day);
      if (bday < today) bday = new Date(thisYear + 1, month - 1, day);
      const diffDays = Math.ceil((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    })
    .sort((a, b) => {
      function daysUntil(m: Member) {
        const [, month, day] = m.birth_date.split('-').map(Number);
        const thisYear = today.getFullYear();
        let bday = new Date(thisYear, month - 1, day);
        if (bday < today) bday = new Date(thisYear + 1, month - 1, day);
        return Math.ceil((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }
      return daysUntil(a) - daysUntil(b);
    })
    .slice(0, 5);

  function daysUntilBirthday(birthDate: string): number {
    const [, month, day] = birthDate.split('-').map(Number);
    const thisYear = today.getFullYear();
    let bday = new Date(thisYear, month - 1, day);
    if (bday < today) bday = new Date(thisYear + 1, month - 1, day);
    return Math.ceil((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  const StatSkeleton = () => (
    <div className="card px-5 py-4 animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-20 mb-3" />
      <div className="h-8 bg-slate-200 rounded w-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar userEmail={userEmail} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Welcome Header ─────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Selamat datang kembali 👋 &mdash; {todayStr}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/members" id="link-goto-members" className="btn-secondary text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Anggota
            </Link>
            <Link href="/media-partners" id="link-goto-partners" className="btn-primary text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              Mitra Media
            </Link>
          </div>
        </div>

        {/* ── Stats Grid ─────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <div className="card px-5 py-4 border-l-4 border-l-blue-500">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Anggota</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{members.length}</p>
                <Link href="/members" className="text-xs text-blue-500 hover:text-blue-700 mt-2 inline-block transition-colors">
                  Lihat semua →
                </Link>
              </div>
              <div className="card px-5 py-4 border-l-4 border-l-emerald-500">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mitra Aktif</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{activePartners.length}</p>
                <Link href="/media-partners" className="text-xs text-emerald-500 hover:text-emerald-700 mt-2 inline-block transition-colors">
                  Lihat semua →
                </Link>
              </div>
              <div className="card px-5 py-4 border-l-4 border-l-cyan-500">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mitra punya MoU</p>
                <p className="text-3xl font-bold text-cyan-600 mt-1">{partnersWithMou.length}</p>
                <p className="text-xs text-slate-400 mt-2">dari {partners.length} total</p>
              </div>
              <div className="card px-5 py-4 border-l-4 border-l-amber-400">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ultah Hari Ini</p>
                <p className={`text-3xl font-bold mt-1 ${birthdayToday.length > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {birthdayToday.length}
                </p>
                <p className="text-xs text-slate-400 mt-2">anggota</p>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── 🎉 Birthday Today ──────────────────── */}
          <div className="card overflow-visible" id="birthday-today-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎂</span>
                <h2 className="font-semibold text-slate-800 text-base">Ulang Tahun Hari Ini</h2>
              </div>
              {birthdayToday.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  {birthdayToday.length}
                </span>
              )}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : birthdayToday.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <span className="text-4xl mb-3">📅</span>
                  <p className="text-sm font-medium text-slate-500">Tidak ada ulang tahun hari ini</p>
                  <p className="text-xs text-slate-400 mt-1">Cek kembali besok!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {birthdayToday.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{m.name}</p>
                        <p className="text-xs text-slate-500">
                          {m.division || 'Tidak ada divisi'} · {getAge(m.birth_date) + 1} tahun 🎊
                        </p>
                      </div>
                      <div className="text-xl shrink-0">🎉</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 📅 Upcoming Birthdays ─────────────── */}
          <div className="card" id="upcoming-birthdays-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <h2 className="font-semibold text-slate-800 text-base">Ulang Tahun Mendatang</h2>
              </div>
              <span className="text-xs text-slate-400">30 hari ke depan</span>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 space-y-3 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-4 bg-slate-200 rounded w-2/5" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                      </div>
                      <div className="h-5 bg-slate-200 rounded-full w-16" />
                    </div>
                  ))}
                </div>
              ) : upcomingBirthdays.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <span className="text-4xl mb-3">🗓️</span>
                  <p className="text-sm font-medium text-slate-500">Tidak ada ulang tahun dalam 30 hari ke depan</p>
                </div>
              ) : (
                upcomingBirthdays.map((m) => {
                  const days = daysUntilBirthday(m.birth_date);
                  return (
                    <div key={m.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{m.name}</p>
                        <p className="text-xs text-slate-400">{formatBirthDate(m.birth_date)}</p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          days <= 7
                            ? 'bg-rose-100 text-rose-700'
                            : days <= 14
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {days === 1 ? 'Besok!' : `${days} hari`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {!loading && upcomingBirthdays.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                <Link
                  href="/members"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Lihat semua anggota →
                </Link>
              </div>
            )}
          </div>

          {/* ── Recent Partners ───────────────────── */}
          <div className="card lg:col-span-2" id="recent-partners-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <h2 className="font-semibold text-slate-800 text-base">Mitra Media Terbaru</h2>
              </div>
              <Link href="/media-partners" className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Lihat semua →
              </Link>
            </div>

            {loading ? (
              <div className="divide-y divide-slate-100">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/5" />
                    <div className="ml-auto h-5 bg-slate-200 rounded-full w-14" />
                  </div>
                ))}
              </div>
            ) : partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <span className="text-4xl mb-3">🤝</span>
                <p className="text-sm text-slate-500">Belum ada mitra media</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {partners.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                      {p.contact_person && (
                        <p className="text-xs text-slate-400 mt-0.5">{p.contact_person}</p>
                      )}
                    </div>
                    {p.type && (
                      <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 shrink-0">
                        {p.type}
                      </span>
                    )}
                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {p.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
