export type ProgramStatus = 'planned' | 'ongoing' | 'completed';

export const PROGRAM_STATUSES: ProgramStatus[] = ['planned', 'ongoing', 'completed'];

export interface Program {
  id: string;
  name: string;
  description: string | null;
  tujuan: string | null;
  sasaran: string | null;
  target: string | null;
  pelaksanaan: string | null;
  status: ProgramStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface ProgramInsert {
  name: string;
  description?: string;
  tujuan?: string;
  sasaran?: string;
  target?: string;
  pelaksanaan?: string;
  status: ProgramStatus;
  start_date?: string;
  end_date?: string;
}
