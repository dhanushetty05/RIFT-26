import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { User, Session, AuthError } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, use demo mode
    if (!isSupabaseConfigured || !supabase) {
      console.warn('⚠️ Supabase not configured. Using demo mode. See AUTH_QUICKSTART.md to set up authentication.');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    if (!supabase) return;
    
    try {
      // Try to get profile from profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading profile:", error);
      }

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: profile.name || authUser.user_metadata?.name || authUser.email!.split("@")[0],
          avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url,
        });
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email!.split("@")[0],
          avatar_url: authUser.user_metadata?.avatar_url,
        };

        const { error: insertError } = await supabase
          .from("profiles")
          .insert([newProfile]);

        if (insertError) {
          console.error("Error creating profile:", insertError);
        }

        setUser(newProfile);
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error);
      // Fallback to auth user data
      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email!.split("@")[0],
        avatar_url: authUser.user_metadata?.avatar_url,
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) {
      throw new Error("Supabase not configured. Please set up your environment variables.");
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              name,
            },
          ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || "Failed to sign up");
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase not configured. Please set up your environment variables.");
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || "Failed to sign in");
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error("Supabase not configured. Please set up your environment variables.");
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || "Failed to sign in with Google");
    }
  };

  const signInWithGithub = async () => {
    if (!supabase) {
      throw new Error("Supabase not configured. Please set up your environment variables.");
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || "Failed to sign in with GitHub");
    }
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error("Supabase not configured. Please set up your environment variables.");
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message || "Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
