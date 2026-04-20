export type MediaPartner = {
  id: string;
  name: string;
  type: string | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  mou_url: string | null;
  status: 'active' | 'inactive';
  created_at: string;
};

export type MediaPartnerInsert = Omit<MediaPartner, 'id' | 'created_at'>;

export const PARTNER_TYPES = ['Media', 'Sponsor', 'Community', 'Government', 'NGO', 'Other'] as const;
export const PARTNER_STATUSES = ['active', 'inactive'] as const;
