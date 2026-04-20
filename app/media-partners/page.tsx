// Server Component — forces dynamic (SSR) rendering for the entire route.
// The actual UI lives in MediaPartnersClient (client component).
export const dynamic = 'force-dynamic';

import MediaPartnersClient from './MediaPartnersClient';

export default function MediaPartnersPage() {
  return <MediaPartnersClient />;
}
