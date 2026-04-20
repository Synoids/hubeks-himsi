'use client';

import { MediaPartner } from '@/types/mediaPartner';

interface PartnerTableProps {
  partners: MediaPartner[];
  onEdit: (partner: MediaPartner) => void;
  onDelete: (partner: MediaPartner) => void;
  loading?: boolean;
}

export default function PartnerTable({ partners, onEdit, onDelete, loading }: PartnerTableProps) {
  function handleViewMou(partner: MediaPartner) {
    if (partner.mou_url) {
      window.open(partner.mou_url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Tidak ada MoU yang diunggah untuk mitra ini.');
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/5" />
            <div className="h-4 bg-slate-200 rounded w-1/5" />
            <div className="h-5 bg-slate-200 rounded-full w-16" />
            <div className="ml-auto flex gap-2">
              <div className="h-8 bg-slate-200 rounded-lg w-16" />
              <div className="h-8 bg-slate-200 rounded-lg w-16" />
              <div className="h-8 bg-slate-200 rounded-lg w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        <p className="text-base font-medium text-slate-500">Belum ada mitra media</p>
        <p className="text-sm text-slate-400 mt-1">Klik &ldquo;Tambah Mitra&rdquo; untuk menambahkan mitra baru.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" id="partner-table">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Nama
            </th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Tipe
            </th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Kontak Person
            </th>
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {partners.map((partner) => (
            <tr
              key={partner.id}
              className="hover:bg-blue-50/40 transition-colors duration-100 group"
            >
              {/* Name + Email */}
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {partner.name}
                </div>
                {partner.email && (
                  <div className="text-xs text-slate-400 mt-0.5">{partner.email}</div>
                )}
              </td>

              {/* Type */}
              <td className="px-4 py-4">
                {partner.type ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                    {partner.type}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>

              {/* Contact Person + Phone */}
              <td className="px-4 py-4">
                <div className="text-slate-700">{partner.contact_person || '—'}</div>
                {partner.phone && (
                  <div className="text-xs text-slate-400 mt-0.5">{partner.phone}</div>
                )}
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                {partner.status === 'active' ? (
                  <span className="badge-active">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Aktif
                  </span>
                ) : (
                  <span className="badge-inactive">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                    Nonaktif
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 flex-wrap">
                  {/* View MoU */}
                  <button
                    id={`btn-view-mou-${partner.id}`}
                    onClick={() => handleViewMou(partner)}
                    title={partner.mou_url ? 'Lihat MoU' : 'Tidak ada MoU'}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                      partner.mou_url
                        ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200 hover:border-cyan-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    MoU
                  </button>

                  {/* Edit */}
                  <button
                    id={`btn-edit-${partner.id}`}
                    onClick={() => onEdit(partner)}
                    className="btn-ghost text-xs py-1.5 px-3"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    id={`btn-delete-${partner.id}`}
                    onClick={() => onDelete(partner)}
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
