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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Ambient Glow Effects */}
      <div className="ambient-glow-teal" style={{ top: '20%', left: '10%' }} />
      <div className="ambient-glow-teal" style={{ bottom: '30%', right: '10%' }} />

      <div className="relative w-full max-w-md z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-6 text-white hover:bg-primary/10 smooth-transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="glass-card border-2 border-primary">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto glow-teal">
              <Bot className="w-9 h-9 text-white" />
            </div>
            <CardTitle className="text-3xl text-white">
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Create Account"}
              {mode === "verify" && "Verify Email"}
            </CardTitle>
            <CardDescription className="text-white/70 text-base">
              {mode === "login" && "Login to access your CI/CD healing dashboard"}
              {mode === "signup" && "Sign up to start healing your pipelines"}
              {mode === "verify" && `We sent a code to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">{error}</AlertDescription>
              </Alert>
            )}

            {mode === "verify" ? (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="code" className="text-white text-base">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-3xl tracking-widest bg-input border-primary text-white h-16"
                    disabled={isLoading}
                    autoFocus
                  />
                  <p className="text-xs text-white/60 text-center">
                    Check browser console for the verification code
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary h-12 text-base"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Verify Email
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-white hover:bg-primary/10 smooth-transition"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="w-full text-white/70 hover:text-white text-sm"
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
              <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white text-base">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 bg-input border-primary text-white h-12 text-base"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary h-12 text-base"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
                    <span className="w-full border-t border-primary/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-white/60">
                      {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full btn-secondary h-12 text-base"
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
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-xs text-white/70 text-center leading-relaxed">
                  🔒 Your data is stored locally in your browser
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white/50 mt-6">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
