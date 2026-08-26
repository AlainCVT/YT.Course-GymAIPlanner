import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';

import { authClient } from '@/lib/auth';

function App() {
  return (
    <NeonAuthUIProvider authClient={authClient} defaultTheme="dark">
      <></>
    </NeonAuthUIProvider>
  );
}

export default App;
