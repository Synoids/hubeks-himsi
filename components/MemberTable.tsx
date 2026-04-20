'use client';

import { Member, formatBirthDate, getAge, isBirthdayToday } from '@/types/member';

interface MemberTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  loading?: boolean;
}

export default function MemberTable({ members, onEdit, onDelete, loading }: MemberTableProps) {
  if (loading) {
    return (
      <div className="w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 animate-pulse">
            <div className="w-9 h-9 bg-slate-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
            <div className="h-4 bg-slate-200 rounded w-20 hidden sm:block" />
            <div className="h-4 bg-slate-200 rounded w-24 hidden md:block" />
            <div className="h-4 bg-slate-200 rounded w-28 hidden lg:block" />
            <div className="ml-auto flex gap-2">
              <div className="h-8 bg-slate-200 rounded-lg w-16" />
              <div className="h-8 bg-slate-200 rounded-lg w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <p className="text-base font-medium text-slate-500">Belum ada anggota</p>
        <p className="text-sm text-slate-400 mt-1">Klik &ldquo;Tambah Anggota&rdquo; untuk menambahkan anggota baru.</p>
      </div>
    );
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  const AVATAR_COLORS = [
    'bg-blue-500', 'bg-violet-500', 'bg-emerald-500',
    'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-pink-500',
  ];

  function getAvatarColor(name: string) {
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" id="member-table">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Anggota</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">NIM</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Divisi / Jabatan</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Tanggal Lahir</th>
            <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {members.map((member) => {
            const hasBirthday = isBirthdayToday(member.birth_date);
            return (
              <tr
                key={member.id}
                className={`hover:bg-blue-50/40 transition-colors duration-100 group ${hasBirthday ? 'bg-amber-50/40' : ''}`}
              >
                {/* Avatar + Name */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${getAvatarColor(member.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {member.name}
                        </span>
                        {hasBirthday && (
                          <span
                            title="Ulang tahun hari ini! 🎉"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200"
                          >
                            🎂 Ultah
                          </span>
                        )}
                      </div>
                      {member.email && (
                        <div className="text-xs text-slate-400 mt-0.5">{member.email}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* NIM */}
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {member.nim || '—'}
                  </span>
                </td>

                {/* Division + Position */}
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <div className="text-slate-700">{member.division || '—'}</div>
                  {member.position && (
                    <div className="text-xs text-slate-400 mt-0.5">{member.position}</div>
                  )}
                </td>

                {/* Birth Date + Age */}
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <div className="text-slate-700">{formatBirthDate(member.birth_date)}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{getAge(member.birth_date)} tahun</div>
                </td>

                {/* Actions */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      id={`btn-edit-member-${member.id}`}
                      onClick={() => onEdit(member)}
                      className="btn-ghost text-xs py-1.5 px-3"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      id={`btn-delete-member-${member.id}`}
                      onClick={() => onDelete(member)}
                      className="btn-danger text-xs py-1.5 px-3"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
