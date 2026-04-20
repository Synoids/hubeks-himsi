'use client';

interface DeleteConfirmProps {
  /** Display name of the item being deleted */
  itemName: string;
  /** Label for what kind of item (e.g. "Mitra Media" or "Anggota") */
  itemLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirm({
  itemName,
  itemLabel = 'item',
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmProps) {
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onCancel();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        id="delete-confirm-modal"
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        {/* Icon */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 id="delete-title" className="text-lg font-bold text-slate-800 text-center">
            Hapus {itemLabel}?
          </h2>
          <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
            Anda akan menghapus{' '}
            <span className="font-semibold text-slate-700">&ldquo;{itemName}&rdquo;</span>.{' '}
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            id="btn-cancel-delete"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 btn-secondary justify-center"
          >
            Batal
          </button>
          <button
            id="btn-confirm-delete"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 active:scale-95"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menghapus...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Ya, Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
