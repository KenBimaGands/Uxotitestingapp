import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { supabase } from '/src/lib/supabase';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  useEffect(() => {
    // Initialize auth on app load
    console.log('=== APP: Initializing ===');
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('=== APP: Auth state changed ===', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out via Supabase');
        clearAuth();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed, updating store');
        useAuthStore.setState({
          accessToken: session.access_token,
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: 'Evaluator'
          },
          isAuthenticated: true
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth, clearAuth]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}