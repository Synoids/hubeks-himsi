'use client';

import { Program } from '@/types/program';

interface ProgramTableProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
  loading?: boolean;
}

export default function ProgramTable({ programs, onEdit, onDelete, loading }: ProgramTableProps) {
  if (loading) {
    return (
      <div className="w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 animate-pulse">
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
            <div className="h-4 bg-slate-200 rounded w-20 hidden sm:block" />
            <div className="h-4 bg-slate-200 rounded w-24 hidden md:block" />
             <div className="ml-auto flex gap-2">
              <div className="h-8 bg-slate-200 rounded-lg w-16" />
              <div className="h-8 bg-slate-200 rounded-lg w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-base font-medium text-slate-500">Belum ada program kerja</p>
        <p className="text-sm text-slate-400 mt-1">Klik &ldquo;Tambah Program&rdquo; untuk menambahkan program baru.</p>
      </div>
    );
  }

  function getStatusBadge(status: string) {
    if (status === 'ongoing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Berjalan
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Selesai
        </span>
      );
    }
    // planned (default)
    return (
       <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Direncanakan
        </span>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" id="program-table">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program / Info</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Target</th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Jadwal Pelaksanaan</th>
            <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {programs.map((program) => (
            <tr key={program.id} className="hover:bg-slate-50 transition-colors duration-100 group">
              {/* Program Name & Desc */}
              <td className="px-6 py-3.5">
                <div>
                  <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {program.name}
                  </span>
                  {program.description && (
                    <div className="text-xs text-slate-400 mt-0.5 max-w-[250px] truncate">{program.description}</div>
                  )}
                  {/* Show status on mobile only if hidden on sm */}
                  <div className="mt-2 sm:hidden">
                    {getStatusBadge(program.status)}
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-3.5 hidden sm:table-cell">
                {getStatusBadge(program.status)}
              </td>

              {/* Target */}
              <td className="px-4 py-3.5 hidden md:table-cell">
                <div className="text-slate-700 max-w-[200px] truncate" title={program.target || ''}>
                  {program.target || '—'}
                </div>
              </td>

              {/* Jadwal / Tanggal */}
              <td className="px-4 py-3.5 hidden lg:table-cell">
                <div className="text-slate-700">{program.pelaksanaan || '—'}</div>
                 {(program.start_date || program.end_date) && (
                   <div className="text-xs text-slate-400 mt-0.5">
                     {program.start_date ? program.start_date : '?'} {program.end_date ? ` s.d. ${program.end_date}` : ''}
                   </div>
                 )}
              </td>

              {/* Actions */}
              <td className="px-6 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  <button
                    id={`btn-edit-program-${program.id}`}
                    onClick={() => onEdit(program)}
                    className="btn-ghost text-xs py-1.5 px-3"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    id={`btn-delete-program-${program.id}`}
                    onClick={() => onDelete(program)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
