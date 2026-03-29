import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './store/useAuthStore';
import { useEffect, useRef } from 'react';
import { supabase } from '/src/lib/supabase';

export default function App() {
  const checkSession = useAuthStore((state) => state.checkSession);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  // Use a ref to prevent duplicate session checks
  const hasCheckedSession = useRef(false);
  
  useEffect(() => {
    // Check for existing session on app load (only once)
    if (!hasCheckedSession.current) {
      hasCheckedSession.current = true;
      checkSession();
    }

    // Listen for auth state changes (including token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          console.log('Setting user from auth state change');
          setUser(
            {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
              role: 'Evaluator'
            },
            session.access_token
          );
        }
      } else if (event === 'SIGNED_OUT') {
        // Only clear state, don't call logout() again to avoid loop
        console.log('User signed out, clearing state');
        clearAuth();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
    // Empty dependency array - we only want this to run once on mount
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}