import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, Mail, Loader2, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login, signup, verifyEmail, resendVerification } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup" | "verify">("login");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await login(email);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await signup(email);
      toast.success("Verification code sent! Check console for code.");
      setMode("verify");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);

    try {
      const success = await verifyEmail(email, verificationCode);
      if (success) {
        toast.success("Email verified successfully!");
        navigate("/dashboard");
      } else {
        setError("Invalid verification code. Please try again.");
        toast.error("Invalid verification code");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await resendVerification(email);
      toast.success("New verification code sent! Check console.");
    } catch (err: any) {
      toast.error("Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9AE4CB]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#085078]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4 font-mono"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="glass-card border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Create Account"}
              {mode === "verify" && "Verify Email"}
            </CardTitle>
            <CardDescription className="font-mono">
              {mode === "login" && "Login to access your CI/CD healing dashboard"}
              {mode === "signup" && "Sign up to start healing your pipelines"}
              {mode === "verify" && `We sent a code to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {mode === "verify" ? (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="font-mono">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    disabled={isLoading}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    Check browser console for the verification code
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full font-mono"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify Email
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full font-mono"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="w-full font-mono text-xs"
                  onClick={() => {
                    setMode("signup");
                    setVerificationCode("");
                    setError("");
                  }}
                >
                  Use different email
                </Button>
              </form>
            ) : (
              <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 font-mono"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full font-mono"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === "login" ? "Logging in..." : "Creating account..."}
                    </>
                  ) : (
                    <>
                      {mode === "login" ? "Login" : "Sign Up"}
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-mono">
                      {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full font-mono"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError("");
                  }}
                >
                  {mode === "login" ? "Create Account" : "Login Instead"}
                </Button>
              </form>
            )}

            {mode !== "verify" && (
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground font-mono text-center">
                  🔒 Your data is stored locally in your browser
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground font-mono mt-4">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
