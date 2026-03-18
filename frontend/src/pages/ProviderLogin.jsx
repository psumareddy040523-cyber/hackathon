import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, ArrowRight, UserPlus, Phone, Lock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProviderLogin() {
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
    pin: "",
    serviceType: "electrician"
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
      if (data.user.role !== "provider") throw new Error("Please use provider login page");
      
      localStorage.setItem("seva_user", JSON.stringify(data.user));
      localStorage.setItem("seva_token", data.token);
      navigate("/provider/dashboard");
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
          role: "provider",
          location: registerForm.location,
          service_type: registerForm.serviceType
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Registration failed");
      
      setToast("Registration successful! Please login with your credentials.");
      setIsRegister(false);
      setRegisterForm({ name: "", phone: "", location: "", pin: "", serviceType: "electrician" });
    } catch (err) {
      setToast(err.message);
    } finally {
      setBusy(false);
      setTimeout(() => setToast(""), 3000);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => i18n.changeLanguage("en")} className={`px-3 py-1 text-sm rounded ${i18n.language === "en" ? "bg-clay text-white" : "bg-white"}`}>EN</button>
          <button onClick={() => i18n.changeLanguage("te")} className={`px-3 py-1 text-sm rounded ${i18n.language === "te" ? "bg-clay text-white" : "bg-white"}`}>TE</button>
          <button onClick={() => i18n.changeLanguage("hi")} className={`px-3 py-1 text-sm rounded ${i18n.language === "hi" ? "bg-clay text-white" : "bg-white"}`}>HI</button>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-clay rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Wrench className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-4xl text-stone-800">SevaSetu</h1>
            <p className="mt-2 text-stone-500 text-lg">
              {isRegister ? "Partner Registration" : t("providerLogin")}
            </p>
          </div>

          {toast && (
            <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600 border border-green-100">
              {toast}
            </div>
          )}

          {isRegister ? (
            <form onSubmit={handleRegister} className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100 space-y-5">
              <div>
                <label className="text-sm font-bold text-stone-700">Business/Your Name</label>
                <input 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 focus:border-clay focus:outline-none bg-stone-50" 
                  placeholder="Suresh Electric Works" 
                  value={registerForm.name} 
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700">Phone Number</label>
                <input 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 focus:border-clay focus:outline-none bg-stone-50" 
                  placeholder="9100000001" 
                  value={registerForm.phone} 
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700">Service Type</label>
                <select 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 focus:border-clay focus:outline-none bg-stone-50"
                  value={registerForm.serviceType}
                  onChange={(e) => setRegisterForm({ ...registerForm, serviceType: e.target.value })}
                >
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="tractor_rental">Tractor Rental</option>
                  <option value="pump_repair">Pump Repair</option>
                  <option value="medicines">Pharmacy</option>
                  <option value="fertilizers">Fertilizers</option>
                  <option value="seeds">Seeds</option>
                  <option value="pesticides">Pesticides</option>
                  <option value="tools">Tools</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700">Location</label>
                <input 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 focus:border-clay focus:outline-none bg-stone-50" 
                  placeholder="Chilakaluripet" 
                  value={registerForm.location} 
                  onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700">Create PIN (6 digits)</label>
                <input 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 tracking-widest focus:border-clay focus:outline-none bg-stone-50" 
                  type="password" 
                  placeholder="123456" 
                  value={registerForm.pin} 
                  onChange={(e) => setRegisterForm({ ...registerForm, pin: e.target.value })} 
                  required 
                  maxLength={6} 
                />
              </div>

              <button 
                type="submit" 
                disabled={busy} 
                className="w-full rounded-2xl bg-clay px-4 py-4 font-semibold text-white text-lg hover:bg-clay/90 transition-colors disabled:opacity-60"
              >
                {busy ? "Creating Account..." : "Register as Provider"}
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
            <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100 space-y-5">
              <div>
                <label className="text-sm font-bold text-stone-700">Phone Number</label>
                <div className="relative mt-2">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input 
                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 focus:border-clay focus:outline-none bg-stone-50" 
                    placeholder="9100000001" 
                    value={loginForm.phone} 
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-stone-700">PIN</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input 
                    className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 tracking-widest focus:border-clay focus:outline-none bg-stone-50" 
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
                className="w-full rounded-2xl bg-clay px-4 py-4 font-semibold text-white text-lg hover:bg-clay/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {busy ? "Signing in..." : t("signIn")}
                {!busy && <ArrowRight className="w-5 h-5" />}
              </button>

              <button 
                type="button"
                onClick={() => setIsRegister(true)} 
                className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 font-semibold text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" /> Register as Provider
              </button>
            </form>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button onClick={() => navigate("/login/customer")} className="text-sm text-stone-500 hover:text-leaf">{t("customerLogin")}</button>
            <span className="text-stone-300">|</span>
            <button onClick={() => navigate("/login/provider")} className="text-sm font-bold text-clay">{t("providerLogin")}</button>
            <span className="text-stone-300">|</span>
            <button onClick={() => navigate("/login/admin")} className="text-sm text-stone-500 hover:text-soil">{t("adminLogin")}</button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-clay to-clay/80 justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Partner with SevaSetu</h2>
          <p className="text-white/80 text-lg max-w-md mx-auto">Grow your business by connecting with customers in your area. Offer services and supplies directly to those who need them.</p>
          <div className="mt-12 grid grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold">₹50K+</p>
              <p className="text-white/70 text-sm">Avg. Monthly Earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-white/70 text-sm">Active Providers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
