import { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  ArrowRight,
  Cloud,
  Layers,
  ExternalLink
} from "lucide-react";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";
export const DatabaseConnector = () => {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [mongoUri, setMongoUri] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const loadStatus = async () => {
    try {
      const status = await adminService.getDatabaseStatus();
      setDbStatus(status);
    } catch (e) {
      console.warn("Could not load database status:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadStatus();
  }, []);
  const handleConnect = async (e) => {
    e.preventDefault();
    if (!mongoUri.trim()) {
      toast.error("Please enter your MongoDB Atlas connection string");
      return;
    }
    setConnecting(true);
    try {
      const res = await adminService.connectMongoDB(mongoUri.trim());
      toast.success(res.message || "MongoDB Atlas connected successfully!");
      setMongoUri("");
      loadStatus();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Connection failed";
      toast.error(msg);
    } finally {
      setConnecting(false);
    }
  };
  const handleSyncData = async () => {
    setSyncing(true);
    try {
      const res = await adminService.syncDatabase();
      toast.success(res.message || "Data synchronized to MongoDB Atlas!");
      loadStatus();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Failed to sync";
      toast.error(msg);
    } finally {
      setSyncing(false);
    }
  };
  const handleDisconnect = async () => {
    if (window.confirm("Are you sure you want to disconnect from MongoDB Atlas and use the local JSON database?")) {
      try {
        await adminService.disconnectMongoDB();
        toast.success("Disconnected from MongoDB Atlas");
        loadStatus();
      } catch (err) {
        toast.error("Failed to disconnect");
      }
    }
  };
  if (loading) {
    return <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-1/4 mb-3" />
        <div className="h-8 bg-stone-100 rounded w-full" />
      </div>;
  }
  const isConnected = Boolean(dbStatus?.isConnected);
  return <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      {
    /* Top Banner / Status Strip */
  }
      <div
    className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${isConnected ? "bg-emerald-50/70 border-emerald-100 text-emerald-950" : "bg-amber-50/70 border-amber-100 text-amber-950"}`}
  >
        <div className="flex items-center gap-3">
          <div
    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${isConnected ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}
  >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base">
                MongoDB Atlas Cloud Connection
              </span>
              <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isConnected ? "bg-emerald-200/80 text-emerald-900" : "bg-amber-200/80 text-amber-900"}`}
  >
                <span
    className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-600 animate-pulse" : "bg-amber-600"}`}
  />
                {isConnected ? "ONLINE & CONNECTED" : "LOCAL ENGINE ACTIVE"}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Target Database: <strong className="font-mono text-[#6b1426]">saree_sansar</strong>
              {isConnected && dbStatus?.host && <span className="ml-2 font-mono text-emerald-800 text-[11px]">
                  ({dbStatus.host})
                </span>}
            </p>
          </div>
        </div>

        {
    /* Action Buttons */
  }
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isConnected && <>
              <button
    type="button"
    onClick={handleSyncData}
    disabled={syncing}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
  >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Syncing..." : "Sync Catalog to Atlas"}</span>
              </button>
              <button
    type="button"
    onClick={handleDisconnect}
    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
  >
                Disconnect
              </button>
            </>}

          <button
    type="button"
    onClick={loadStatus}
    title="Refresh database ping"
    className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
  >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {
    /* Main Body */
  }
      <div className="p-6 space-y-6">
        {
    /* Collections Statistics Grid */
  }
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#881930]" />
              <span>Database Collections Real-Time Record Counts:</span>
            </h4>
            <span className="text-[11px] text-stone-500">
              Active Storage: <strong>{dbStatus?.activeDatabaseType}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Products
              </span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-0.5 font-mono">
                {dbStatus?.collections?.products || 0}
              </p>
              <span className="text-[10px] text-stone-400">sarees listed</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Orders
              </span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-0.5 font-mono">
                {dbStatus?.collections?.orders || 0}
              </p>
              <span className="text-[10px] text-stone-400">purchases placed</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Users
              </span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-0.5 font-mono">
                {dbStatus?.collections?.users || 0}
              </p>
              <span className="text-[10px] text-stone-400">registered patrons</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Categories
              </span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-0.5 font-mono">
                {dbStatus?.collections?.categories || 0}
              </p>
              <span className="text-[10px] text-stone-400">weaving guilds</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Coupons
              </span>
              <p className="font-serif text-xl font-bold text-stone-900 mt-0.5 font-mono">
                {dbStatus?.collections?.coupons || 0}
              </p>
              <span className="text-[10px] text-stone-400">active discount codes</span>
            </div>
          </div>
        </div>

        {
    /* Connection Form: Direct Connect from UI */
  }
        <div className="bg-[#FCF9F5] p-5 rounded-xl border border-[#d4af37]/30 space-y-4">
          <div>
            <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#881930]" />
              <span>
                {isConnected ? "Update / Switch MongoDB Atlas Connection URI" : "Connect Direct to MongoDB Atlas Cloud Database"}
              </span>
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              अपना MongoDB Atlas Connection String यहाँ पेस्ट करें और सीधे डैशबोर्ड से कनेक्ट करें। किसी टर्मिनल या कोड एडिटिंग की ज़रूरत नहीं है।
            </p>
          </div>

          <form onSubmit={handleConnect} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
    type="text"
    placeholder="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/saree_sansar?retryWrites=true&w=majority"
    value={mongoUri}
    onChange={(e) => setMongoUri(e.target.value)}
    className="flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
              <button
    type="submit"
    disabled={connecting}
    className="px-5 py-2.5 bg-[#881930] hover:bg-[#6b1426] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
  >
                {connecting ? <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting...</span>
                  </> : <>
                    <span>Test &amp; Connect MongoDB</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>}
              </button>
            </div>

            {dbStatus?.maskedUri && <p className="text-[11px] text-stone-500 font-mono">
                Current Configured URI: <span className="text-stone-700">{dbStatus.maskedUri}</span>
              </p>}
          </form>

          {
    /* Collapsible Step-by-Step Guide */
  }
          <div className="pt-2 border-t border-stone-200">
            <button
    type="button"
    onClick={() => setShowHelp(!showHelp)}
    className="text-xs font-semibold text-[#881930] hover:underline flex items-center gap-1 cursor-pointer"
  >
              <span>{showHelp ? "\u25B2 MongoDB URL \u0915\u0948\u0938\u0947 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902 (\u0917\u093E\u0907\u0921 \u091B\u093F\u092A\u093E\u090F\u0902)" : "\u25BC MongoDB Atlas URL \u0915\u0939\u093E\u0901 \u0938\u0947 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902? (3-\u0938\u094D\u091F\u0947\u092A \u0917\u093E\u0907\u0921)"}</span>
            </button>

            {showHelp && <div className="mt-3 bg-white p-4 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
                <p>
                  <strong>1.</strong> <a href="https://mongodb.com/cloud/atlas" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline inline-flex items-center gap-1">mongodb.com/cloud/atlas <ExternalLink className="w-3 h-3" /></a> पर फ्री क्लस्टर बनाएं।
                </p>
                <p>
                  <strong>2.</strong> <strong>Network Access</strong> में जाकर <strong>IP Whitelist</strong> में <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">0.0.0.0/0</code> (Allow Access Anywhere) जोड़ें।
                </p>
                <p>
                  <strong>3.</strong> <strong>Database ➔ Connect ➔ Drivers</strong> चुनें और कनेक्शन स्ट्रिंग कॉपी करें। <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">&lt;password&gt;</code> की जगह अपना पासवर्ड डालें और ऊपर पेस्ट करके <strong>"Test &amp; Connect MongoDB"</strong> दबाएं!
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default DatabaseConnector;
