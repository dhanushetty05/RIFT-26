import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  verified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  resendVerification: (email: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        const existingUser = users[email];

        if (!existingUser) {
          reject(new Error("Account not found. Please sign up first."));
          return;
        }

        if (!existingUser.verified) {
          reject(new Error("Email not verified. Please verify your email first."));
          return;
        }

        setUser(existingUser);
        localStorage.setItem("user", JSON.stringify(existingUser));
        resolve();
      }, 1000);
    });
  };

  const signup = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        
        if (users[email]) {
          reject(new Error("Account already exists. Please login instead."));
          return;
        }

        const newUser: User = {
          email,
          verified: false,
          createdAt: new Date().toISOString(),
        };

        users[email] = newUser;
        localStorage.setItem("users", JSON.stringify(users));

        // Generate and store verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codes = JSON.parse(localStorage.getItem("verificationCodes") || "{}");
        codes[email] = verificationCode;
        localStorage.setItem("verificationCodes", JSON.stringify(codes));

        console.log(`Verification code for ${email}: ${verificationCode}`);
        resolve();
      }, 1000);
    });
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const codes = JSON.parse(localStorage.getItem("verificationCodes") || "{}");
        const storedCode = codes[email];

        if (storedCode === code) {
          const users = JSON.parse(localStorage.getItem("users") || "{}");
          users[email].verified = true;
          localStorage.setItem("users", JSON.stringify(users));

          delete codes[email];
          localStorage.setItem("verificationCodes", JSON.stringify(codes));

          setUser(users[email]);
          localStorage.setItem("user", JSON.stringify(users[email]));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const resendVerification = async (email: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codes = JSON.parse(localStorage.getItem("verificationCodes") || "{}");
        codes[email] = verificationCode;
        localStorage.setItem("verificationCodes", JSON.stringify(codes));

        console.log(`New verification code for ${email}: ${verificationCode}`);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.verified,
        login,
        signup,
        verifyEmail,
        logout,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
