import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [phone] = useState("admin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("pin", pin);
      
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Login failed");
      
      localStorage.setItem("seva_user", JSON.stringify(data.user));
      localStorage.setItem("seva_token", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soil/90 to-stone-900 p-6">
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => i18n.changeLanguage("en")} className="px-3 py-1 text-sm rounded bg-white/10 text-white hover:bg-white/20">EN</button>
        <button onClick={() => i18n.changeLanguage("te")} className="px-3 py-1 text-sm rounded bg-white/10 text-white hover:bg-white/20">TE</button>
        <button onClick={() => i18n.changeLanguage("hi")} className="px-3 py-1 text-sm rounded bg-white/10 text-white hover:bg-white/20">HI</button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-display text-5xl text-white mb-2">SevaSetu</h1>
          <p className="text-white/70 text-lg">{t("adminLogin")}</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-bold text-stone-700">Username</label>
              <div className="relative mt-2">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 focus:border-soil focus:outline-none bg-stone-50" 
                  placeholder="admin" 
                  value={phone} 
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-stone-700">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input 
                  className="w-full rounded-2xl border-2 border-stone-200 px-4 py-3 pl-12 tracking-widest focus:border-soil focus:outline-none bg-stone-50" 
                  type="password" 
                  placeholder="Enter password" 
                  value={pin} 
                  onChange={(e) => setPin(e.target.value)} 
                  required 
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
              className="w-full rounded-2xl bg-soil px-4 py-4 font-semibold text-white text-lg hover:bg-soil/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy ? "Signing in..." : t("signIn")}
              {!busy && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => navigate("/login/customer")} className="text-sm text-white/70 hover:text-white">{t("customerLogin")}</button>
          <span className="text-white/30">|</span>
          <button onClick={() => navigate("/login/provider")} className="text-sm text-white/70 hover:text-white">{t("providerLogin")}</button>
          <span className="text-white/30">|</span>
          <button onClick={() => navigate("/login/admin")} className="text-sm font-bold text-white">{t("adminLogin")}</button>
        </div>
      </div>
    </div>
  );
}
