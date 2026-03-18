import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf, Pill, Tractor, Wrench, LogOut, Plus, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { acceptOffer, rejectOffer, completeRequest, createRequest, fetchProviders, fetchUsers } from "../services/api";

const MODULES = [
  { key: "service", label: "Local Services", icon: Wrench, color: "bg-clay/15 text-clay" },
  { key: "medicine", label: "Prescription Medicine", icon: Pill, color: "bg-leaf/15 text-leaf" },
  { key: "farm", label: "Farm Supplies", icon: Leaf, color: "bg-millet/35 text-soil" },
];

export default function CustomerDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ category: "service", service_type: "electrician", product_name: "", quantity: "", description: "", location: "Chilakaluripet", latitude: "16.0898", longitude: "80.1670", preferred_time: "Today evening" });
  const [myRequests, setMyRequests] = useState([]);
  const [createdRequest, setCreatedRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [toast, setToast] = useState("");
  const [showNewRequest, setShowNewRequest] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("seva_user") || "{}");
    if (!savedUser.phone) { navigate("/login/customer"); return; }
    setUser(savedUser);
    loadData(savedUser.id);
  }, []);

  async function loadData(userId) {
    try {
      const [allUsers, allProviders] = await Promise.all([fetchUsers(), fetchProviders()]);
      setUsers(allUsers);
      setProviders(allProviders);
      const myUser = allUsers.find(u => u.phone === user?.phone);
      if (myUser) loadMyRequests(myUser.id);
    } catch { }
  }

  async function loadMyRequests(userId) {
    try {
      const res = await fetch(`http://localhost:8000/api/my-requests/?user_id=${userId}&user_role=customer`);
      const data = await res.json();
      setMyRequests(data);
    } catch { }
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleCreateRequest(e) {
    e.preventDefault();
    try {
      const savedUser = JSON.parse(localStorage.getItem("seva_user") || "{}");
      const myUser = users.find(u => u.phone === savedUser.phone);
      if (!myUser) { showToast("User not found"); return; }
      
      const payload = { user: myUser.id, ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) };
      const req = await createRequest(payload);
      setCreatedRequest(req);
      showToast(t("postRequest") + " #" + req.id);
      loadMyRequests(myUser.id);
    } catch (error) { showToast("Error creating request"); }
  }

  async function loadOffers(requestId) {
    try {
      const res = await fetch(`http://localhost:8000/api/request/${requestId}/offers/`);
      const data = await res.json();
      setOffers(data);
    } catch { }
  }

  useEffect(() => { if (createdRequest) loadOffers(createdRequest.id); }, [createdRequest]);

  async function handleAcceptOffer(offerId) {
    try { await acceptOffer(offerId); showToast("Offer accepted!"); loadOffers(createdRequest.id); } catch { showToast("Error"); }
  }

  async function handleRejectOffer(offerId) {
    try { await rejectOffer(offerId); showToast("Offer rejected"); loadOffers(createdRequest.id); } catch { showToast("Error"); }
  }

  async function handleComplete() {
    if (!createdRequest) return;
    try { await completeRequest(createdRequest.id); showToast("Request completed!"); setCreatedRequest(null); setOffers([]); } catch { showToast("Error"); }
  }

  function handleLogout() { localStorage.removeItem("seva_user"); localStorage.removeItem("seva_token"); navigate("/login/customer"); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-leaf/5">
      {toast && (
        <div className="fixed left-1/2 top-4 -translate-x-1/2 z-50 rounded-xl bg-soil px-6 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
      
      <nav className="bg-white shadow-sm border-b border-stone-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-leaf rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl text-leaf">SevaSetu</h1>
              <p className="text-xs text-stone-500">{t("consumer")}: {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button onClick={() => i18n.changeLanguage("en")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${i18n.language === "en" ? "bg-leaf text-white" : "bg-stone-100"}`}>EN</button>
              <button onClick={() => i18n.changeLanguage("te")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${i18n.language === "te" ? "bg-leaf text-white" : "bg-stone-100"}`}>TE</button>
              <button onClick={() => i18n.changeLanguage("hi")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${i18n.language === "hi" ? "bg-leaf text-white" : "bg-stone-100"}`}>HI</button>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
              <LogOut className="h-4 w-4" /> {t("logout")}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-leaf to-leaf/80 px-6 py-4">
                <h2 className="font-display text-xl text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" /> {t("postRequest")}
                </h2>
              </div>
              <form onSubmit={handleCreateRequest} className="p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {MODULES.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setForm({ ...form, category: item.key })}
                      className={`rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-all ${form.category === item.key ? "border-leaf bg-leaf text-white" : "border-stone-200 bg-white text-stone-600 hover:border-leaf/50"}`}
                    >
                      <item.icon className="mx-auto mb-2 h-6 w-6" />
                      {item.label}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase">{t("description")}</label>
                    <input 
                      className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 focus:border-leaf focus:outline-none" 
                      placeholder="Describe your requirement..." 
                      value={form.description} 
                      onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase">{t("location")}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input 
                        className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 pl-10 focus:border-leaf focus:outline-none" 
                        value={form.location} 
                        onChange={(e) => setForm({ ...form, location: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>
                
                <button className="w-full rounded-xl bg-leaf px-4 py-4 font-semibold text-white text-lg hover:bg-leaf/90 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Submit Request
                </button>
              </form>
            </div>

            {createdRequest && (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-clay to-clay/80 px-6 py-4 flex justify-between items-center">
                  <h2 className="font-display text-xl text-white">{t("offersComparison")}</h2>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">Request #{createdRequest.id}</span>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div key={offer.id} className="flex items-center justify-between rounded-xl border-2 border-stone-200 p-4 hover:border-leaf/30 transition-colors">
                        <div>
                          <p className="font-bold text-stone-800">{offer.provider_name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${offer.status === "pending" ? "bg-amber-100 text-amber-700" : offer.status === "accepted" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"}`}>
                              {offer.status}
                            </span>
                            <span className="text-xs text-stone-500 flex items-center gap-1"><Clock className="w-3 h-3" /> ETA: {offer.eta_minutes} min</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-2xl text-leaf">₹{offer.price}</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAcceptOffer(offer.id)} 
                              disabled={offer.status !== "pending"}
                              className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-30"
                            >
                              <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                            <button 
                              onClick={() => handleRejectOffer(offer.id)} 
                              disabled={offer.status !== "pending"}
                              className="flex items-center gap-1 rounded-lg border-2 border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-30"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {offers.length === 0 && (
                      <div className="text-center py-8 text-stone-500">
                        <p>Waiting for providers to respond...</p>
                      </div>
                    )}
                  </div>
                  {offers.some(o => o.status === "accepted") && (
                    <button onClick={handleComplete} className="mt-4 w-full rounded-xl bg-soil px-4 py-3 font-semibold text-white">
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-soil to-soil/80 px-6 py-4">
                <h2 className="font-display text-lg text-white">{t("myRequests")}</h2>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {myRequests.length === 0 ? (
                  <p className="text-sm text-stone-500 text-center py-4">{t("noRequests")}</p>
                ) : (
                  myRequests.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => setCreatedRequest(req)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${createdRequest?.id === req.id ? "border-leaf bg-leaf/10" : "border-stone-200 hover:border-leaf/30"}`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-stone-800">#{req.id} - {req.category}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${req.status === "open" ? "bg-blue-100 text-blue-700" : req.status === "completed" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-leaf/10 to-leaf/5 rounded-2xl border border-leaf/20 p-6">
              <h3 className="font-display text-lg text-leaf mb-3">Need Help?</h3>
              <p className="text-sm text-stone-600 mb-4">Contact our support team for any assistance with your requests.</p>
              <button className="w-full rounded-xl bg-leaf px-4 py-2 font-semibold text-white text-sm">Contact Support</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
