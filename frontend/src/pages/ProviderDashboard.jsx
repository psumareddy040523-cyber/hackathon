import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wrench, LogOut, Inbox, Send, MapPin, Clock, DollarSign, CheckCircle, XCircle, Star } from "lucide-react";
import { createOffer, fetchProviders, fetchProviderInbox } from "../services/api";

export default function ProviderDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [inbox, setInbox] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerForm, setOfferForm] = useState({ price: "", availability: "Available", eta_minutes: 30 });
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("seva_user") || "{}");
    if (!savedUser.phone) { navigate("/login/provider"); return; }
    setUser(savedUser);
    loadData();
  }, []);

  async function loadData() {
    try {
      const allProviders = await fetchProviders();
      setProviders(allProviders);
      const myProvider = allProviders.find(p => p.user_phone === user?.phone);
      if (myProvider) { setProviderId(String(myProvider.id)); loadInbox(myProvider.id); }
    } catch { }
  }

  async function loadInbox(pid) {
    try { const data = await fetchProviderInbox(pid); setInbox(data); } catch { }
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleSendOffer(e) {
    e.preventDefault();
    if (!selectedRequest || !providerId) return;
    try {
      await createOffer({ request: selectedRequest.id, provider: Number(providerId), price: Number(offerForm.price), availability: offerForm.availability, eta_minutes: Number(offerForm.eta_minutes), delivery_option: "Pickup only" });
      showToast("Offer sent successfully!");
      setSelectedRequest(null);
      setOfferForm({ price: "", availability: "Available", eta_minutes: 30 });
      loadInbox(providerId);
    } catch { showToast("Error sending offer"); }
  }

  function handleLogout() { localStorage.removeItem("seva_user"); localStorage.removeItem("seva_token"); navigate("/login/provider"); }

  const myProvider = providers.find(p => p.id === Number(providerId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-clay/5">
      {toast && (
        <div className="fixed left-1/2 top-4 -translate-x-1/2 z-50 rounded-xl bg-soil px-6 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
      
      <nav className="bg-white shadow-sm border-b border-stone-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-clay rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl text-clay">SevaSetu</h1>
              <p className="text-xs text-stone-500">{t("provider")}: {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button onClick={() => i18n.changeLanguage("en")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${i18n.language === "en" ? "bg-clay text-white" : "bg-stone-100"}`}>EN</button>
              <button onClick={() => i18n.changeLanguage("te")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${i18n.language === "te" ? "bg-clay text-white" : "bg-stone-100"}`}>TE</button>
              <button onClick={() => i18n.changeLanguage("hi")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${i18n.language === "hi" ? "bg-clay text-white" : "bg-stone-100"}`}>HI</button>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
              <LogOut className="h-4 w-4" /> {t("logout")}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        {myProvider && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-clay/10 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-clay" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-800">{myProvider.rating || "New"}</p>
                <p className="text-xs text-stone-500">Rating</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Inbox className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-800">{inbox.length}</p>
                <p className="text-xs text-stone-500">New Requests</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-800">{myProvider.max_service_km}km</p>
                <p className="text-xs text-stone-500">Service Range</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${myProvider.is_active ? "bg-green-100" : "bg-red-100"}`}>
                <CheckCircle className={`w-6 h-6 ${myProvider.is_active ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-800">{myProvider.is_active ? "Active" : "Inactive"}</p>
                <p className="text-xs text-stone-500">Status</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-clay to-clay/80 px-6 py-4 flex items-center gap-3">
                <Inbox className="w-5 h-5 text-white" />
                <h2 className="font-display text-xl text-white">{t("providerInbox")}</h2>
              </div>
              <div className="p-4">
                <select 
                  className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-clay focus:outline-none mb-4"
                  value={providerId} 
                  onChange={(e) => { setProviderId(e.target.value); loadInbox(e.target.value); }}
                >
                  <option value="">-- {t("selectProvider")} --</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.user_name} - {p.service_type}</option>)}
                </select>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {inbox.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedRequest?.id === req.id ? "border-clay bg-clay/10" : "border-stone-200 hover:border-clay/30"}`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-stone-800">#{req.id} - {req.category}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{req.status}</span>
                      </div>
                      <p className="text-sm text-stone-600 mt-1">{req.description || "No description"}</p>
                      <p className="text-xs text-stone-500 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</p>
                    </button>
                  ))}
                  {inbox.length === 0 && (
                    <div className="text-center py-8 text-stone-500">
                      <Inbox className="w-12 h-12 mx-auto mb-2 text-stone-300" />
                      <p>{t("noRequests")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-soil to-soil/80 px-6 py-4 flex items-center gap-3">
                <Send className="w-5 h-5 text-white" />
                <h2 className="font-display text-lg text-white">{t("sendOffer")}</h2>
              </div>
              <form onSubmit={handleSendOffer} className="p-6 space-y-4">
                {selectedRequest ? (
                  <div className="rounded-xl bg-clay/10 p-4 mb-4">
                    <p className="font-semibold text-clay">Selected Request</p>
                    <p className="text-sm text-stone-600">#{selectedRequest.id} - {selectedRequest.category}</p>
                    <p className="text-xs text-stone-500">{selectedRequest.location}</p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50 p-4 mb-4 text-amber-700 text-sm">
                    Select a request from inbox
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase">Price (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input 
                      className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 pl-10 focus:border-clay focus:outline-none" 
                      placeholder="500" 
                      type="number" 
                      value={offerForm.price} 
                      onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase">ETA (minutes)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input 
                      className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 pl-10 focus:border-clay focus:outline-none" 
                      placeholder="30" 
                      type="number" 
                      value={offerForm.eta_minutes} 
                      onChange={(e) => setOfferForm({ ...offerForm, eta_minutes: e.target.value })} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase">Availability</label>
                  <select 
                    className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-clay focus:outline-none" 
                    value={offerForm.availability} 
                    onChange={(e) => setOfferForm({ ...offerForm, availability: e.target.value })}
                  >
                    <option value="Available">{t("available")}</option>
                    <option value="Not Available">{t("notAvailable")}</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={!selectedRequest} 
                  className="w-full rounded-xl bg-clay px-4 py-4 font-semibold text-white text-lg hover:bg-clay/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Send Offer
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-clay/10 to-clay/5 rounded-2xl border border-clay/20 p-6">
              <h3 className="font-display text-lg text-clay mb-3">Boost Your Profile</h3>
              <p className="text-sm text-stone-600 mb-4">Complete your profile and add services to get more customers.</p>
              <button className="w-full rounded-xl bg-clay px-4 py-2 font-semibold text-white text-sm">Update Profile</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
