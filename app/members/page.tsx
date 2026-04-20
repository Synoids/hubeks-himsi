// Server Component — forces dynamic (SSR) rendering for the route
export const dynamic = 'force-dynamic';

import MembersClient from './MembersClient';

export default function MembersPage() {
  return <MembersClient />;
}
