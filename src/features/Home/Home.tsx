import { useAuth } from 'hooks/use-auth';
import React from 'react';

export default function Home(): JSX.Element {
  const auth = useAuth();
  
  return (
    <div>
      HOME
      <button onClick={auth.revokeAccess}>Revoke Access</button>
      <button onClick={auth.signOut}>Sign Out</button>
    </div>
  );
}
