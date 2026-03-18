import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ArrowRight, UserPlus, Phone, Lock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CustomerLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  
  const [loginForm, setLoginForm] = useState({ phone: "", pin: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    phone: "",
    location: "",
    pin: ""
  });

  async function handleLogin(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("phone", loginForm.phone);
      formData.append("pin", loginForm.pin);
      
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Login failed");
      if (data.user.role !== "customer") throw new Error("Please use customer login page");
      
      localStorage.setItem("seva_user", JSON.stringify(data.user));
      localStorage.setItem("seva_token", data.token);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setBusy(true);
    setToast("");
    try {
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerForm.name,
          phone: registerForm.phone,
          pin: registerForm.pin,
          role: "customer",
          location: registerForm.location
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Registration failed");
      
      setToast("Registration successful! Please login with your credentials.");
      setIsRegister(false);
      setRegisterForm({ name: "", phone: "", location: "", pin: "" });
    } catch (err) {
      setToast(err.message);
    } finally {
      setBusy(false);
      setTimeout(() => setToast(""), 3000);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-leaf/90 to-leaf/70 justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-white text-center">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Leaf className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome Customer</h2>
          <p className="text-white/80 text-lg max-w-md">Connect with local service providers, get medicines delivered, and access farm supplies all in one place.</p>
          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center"><p className="text-3xl font-bold">500+</p><p className="text-white/70 text-sm">Providers</p></div>
            <div className="text-center"><p className="text-3xl font-bold">1000+</p><p className="text-white/70 text-sm">Services</p></div>
            <div className="text-center"><p className="text-3xl font-bold">24/7</p><p className="text-white/70 text-sm">Support</p></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-stone-50">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => i18n.changeLanguage("en")} className={`px-3 py-1 text-sm rounded ${i18n.language === "en" ? "bg-leaf text-white" : "bg-white"}`}>EN</button>
          <button onClick={() => i18n.changeLanguage("te")} className={`px-3 py-1 text-sm rounded ${i18n.language === "te" ? "bg-leaf text-white" : "bg-white"}`}>TE</button>
          <button onClick={() => i18n.changeLanguage("hi")} className={`px-3 py-1 text-sm rounded ${i18n.language === "hi" ? "bg-leaf text-white" : "bg-white"}`}>HI</button>
        </div>

        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-leaf rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="font-display text-4xl text-stone-800">SevaSetu</h1>
            <p className="mt-2 text-stone-500 text-lg">
              {isRegister ? "Create New Account" : t("customerLogin")}
            </p>
          </div>

          {toast && (
            <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600 border border-green-100">
              {toast}
            </div>
          )}

          {isRegister ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-stone-700">Full Name</label>
                <input 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 focus:border-leaf focus:outline-none" 
                  placeholder="Your full name" 
                  value={registerForm.name} 
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700">Phone Number</label>
                <div className="relative mt-2">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input 
                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 focus:border-leaf focus:outline-none" 
                    placeholder="9000000001" 
                    value={registerForm.phone} 
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700">Location</label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input 
                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 focus:border-leaf focus:outline-none" 
                    placeholder="Chilakaluripet" 
                    value={registerForm.location} 
                    onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700">Create PIN (6 digits)</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input 
                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 tracking-widest focus:border-leaf focus:outline-none" 
                    type="password" 
                    placeholder="123456" 
                    value={registerForm.pin} 
                    onChange={(e) => setRegisterForm({ ...registerForm, pin: e.target.value })} 
                    required 
                    maxLength={6} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={busy} 
                className="w-full rounded-2xl bg-leaf px-4 py-4 font-semibold text-white text-lg hover:bg-leaf/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {busy ? "Creating Account..." : "Create Account"}
              </button>
              
              <button 
                type="button"
                onClick={() => setIsRegister(false)} 
                className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold text-stone-600 hover:bg-stone-50"
              >
                Already have an account? Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-stone-700">Phone Number</label>
                <div className="relative mt-2">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input 
                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 focus:border-leaf focus:outline-none" 
                    placeholder="9000000001" 
                    value={loginForm.phone} 
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700">PIN</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input 
                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 tracking-widest focus:border-leaf focus:outline-none" 
                    type="password" 
                    placeholder="123456" 
                    value={loginForm.pin} 
                    onChange={(e) => setLoginForm({ ...loginForm, pin: e.target.value })} 
                    required 
                    maxLength={6} 
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={busy} 
                className="w-full rounded-2xl bg-leaf px-4 py-4 font-semibold text-white text-lg hover:bg-leaf/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {busy ? "Signing in..." : t("signIn")}
                {!busy && <ArrowRight className="w-5 h-5" />}
              </button>

              <button 
                type="button"
                onClick={() => setIsRegister(true)} 
                className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" /> Register as Customer
              </button>
            </form>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button onClick={() => navigate("/login/customer")} className="text-sm font-bold text-leaf">{t("customerLogin")}</button>
            <span className="text-stone-300">|</span>
            <button onClick={() => navigate("/login/provider")} className="text-sm text-stone-500 hover:text-clay">{t("providerLogin")}</button>
            <span className="text-stone-300">|</span>
            <button onClick={() => navigate("/login/admin")} className="text-sm text-stone-500 hover:text-soil">{t("adminLogin")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
