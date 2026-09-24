import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (!isSupabaseConfigured) {
          // Check if there is a local demo session saved in localStorage
          const localDemoUser = localStorage.getItem('travel_explorer_demo_user');
          if (localDemoUser && mounted) {
            const parsed = JSON.parse(localDemoUser);
            setUser(parsed.user);
            setSession(parsed.session);
          }
          if (mounted) setLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
        }

        // Listen for Supabase auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
          }
        });

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.warn('[AuthContext] Auth init warning:', err.message);
        if (mounted) {
          setAuthError(err.message);
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    setAuthError(null);

    if (!isSupabaseConfigured) {
      // Graceful local demo login for development preview before user keys are added
      const demoUser = {
        id: 'demo-user-123',
        email: email.trim(),
        user_metadata: { full_name: email.split('@')[0] || 'Explorer' },
        created_at: new Date().toISOString()
      };
      const demoSession = {
        access_token: 'demo-jwt-token-preview',
        user: demoUser
      };
      setUser(demoUser);
      setSession(demoSession);
      localStorage.setItem('travel_explorer_demo_user', JSON.stringify({ user: demoUser, session: demoSession }));
      return { data: { user: demoUser, session: demoSession }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setAuthError(err.message);
      return { data: null, error: err };
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, fullName = '') => {
    setAuthError(null);

    if (!isSupabaseConfigured) {
      // Graceful local demo signup for development preview before user keys are added
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: email.trim(),
        user_metadata: { full_name: fullName || email.split('@')[0] || 'Traveler' },
        created_at: new Date().toISOString()
      };
      const demoSession = {
        access_token: 'demo-jwt-token-preview',
        user: demoUser
      };
      setUser(demoUser);
      setSession(demoSession);
      localStorage.setItem('travel_explorer_demo_user', JSON.stringify({ user: demoUser, session: demoSession }));
      return { data: { user: demoUser, session: demoSession }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setAuthError(err.message);
      return { data: null, error: err };
    }
  };

  // Sign out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      localStorage.removeItem('travel_explorer_demo_user');
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const value = {
    user,
    session,
    loading,
    authError,
    isSupabaseConfigured,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
