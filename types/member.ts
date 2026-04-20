export type Member = {
  id: string;
  name: string;
  nim: string | null;
  division: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  birth_date: string; // ISO date string: YYYY-MM-DD
  created_at: string;
};

export type MemberInsert = Omit<Member, 'id' | 'created_at'>;

export const DIVISIONS = [
  'Hubungan Eksternal',
  'Hubungan Internal',
  'Keuangan',
  'Akademik',
  'Minat & Bakat',
  'Media & Komunikasi',
  'Pengabdian Masyarakat',
  'Penelitian & Pengembangan',
  'Lainnya',
] as const;

export const POSITIONS = [
  'Ketua',
  'Wakil Ketua',
  'Sekretaris',
  'Bendahara',
  'Kepala Divisi',
  'Wakil Kepala Divisi',
  'Staff',
  'Anggota',
] as const;

/** Returns true if the given ISO date string (YYYY-MM-DD) matches today's month & day */
export function isBirthdayToday(birthDate: string): boolean {
  const today = new Date();
  const [, month, day] = birthDate.split('-').map(Number);
  return month === today.getMonth() + 1 && day === today.getDate();
}

/** Returns age in years from a YYYY-MM-DD birth date string */
export function getAge(birthDate: string): number {
  const today = new Date();
  const [year, month, day] = birthDate.split('-').map(Number);
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }
  return age;
}

/** Format YYYY-MM-DD to readable Indonesian date e.g. "20 April 2000" */
export function formatBirthDate(birthDate: string): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const [year, month, day] = birthDate.split('-').map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
