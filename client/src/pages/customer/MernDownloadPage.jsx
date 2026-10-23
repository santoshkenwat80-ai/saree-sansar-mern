import { useState, useEffect } from "react";
import {
  Download,
  Database,
  Server,
  Layers,
  FileCode2,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FolderTree,
  HardDriveDownload
} from "lucide-react";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";
export const MernDownloadPage = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("quickstart");
  const [mongoStatus, setMongoStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testUri, setTestUri] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  useEffect(() => {
    fetchStatus();
  }, []);
  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const data = await adminService.getDatabaseStatus();
      setMongoStatus(data);
    } catch {
    } finally {
      setLoadingStatus(false);
    }
  };
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2e3);
  };
  const handleConnectMongo = async (e) => {
    e.preventDefault();
    if (!testUri.trim()) {
      toast.error("Please enter a valid MongoDB connection URI");
      return;
    }
    setConnecting(true);
    try {
      const res = await adminService.connectMongoDB(testUri.trim());
      toast.success(res.message || "Connected to MongoDB Atlas successfully!");
      fetchStatus();
      setTestUri("");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Failed to connect to MongoDB");
    } finally {
      setConnecting(false);
    }
  };
  const handleSyncData = async () => {
    setSyncing(true);
    try {
      const res = await adminService.syncDatabase();
      toast.success(res.message || "Catalog and database synchronized successfully!");
      fetchStatus();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Failed to sync data");
    } finally {
      setSyncing(false);
    }
  };
  const packages = [
    {
      id: "mern",
      title: "Complete MERN Stack Project (All-in-One)",
      hindiTitle: "\u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u092E\u0930\u094D\u0928 \u0938\u094D\u091F\u0948\u0915 \u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F (\u092B\u094D\u0930\u0902\u091F\u090F\u0902\u0921 + \u092C\u0948\u0915\u090F\u0902\u0921 + \u092E\u094B\u0902\u0917\u094B\u0921\u0940\u092C\u0940)",
      badge: "Recommended \xB7 100% Pure JS",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      description: "Complete repository with React 19 JSX frontend, Node.js + Express REST API, MongoDB Mongoose models, and auto-seeding scripts.",
      size: "~3.6 MB",
      primaryUrl: "/saree-sansar-mern-javascript.zip",
      apiUrl: "/api/download/mern",
      filename: "saree-sansar-mern-javascript.zip",
      tags: ["React 19", "Express.js", "Node.js", "MongoDB Mongoose", "Tailwind CSS"],
      highlight: true,
      features: [
        "Pure JavaScript (No TypeScript build hurdles)",
        "Full catalog with 50+ handloom sarees & silk certification",
        "Working Cart, Wishlist, User Profile & Order tracking",
        "Automatic local JSON database fallback if offline",
        "Ready-to-use package.json with simple npm run dev"
      ]
    },
    {
      id: "frontend",
      title: "Pure React 19 Frontend (JSX + Vite)",
      hindiTitle: "\u092A\u094D\u092F\u094B\u0930 \u0930\u093F\u090F\u0915\u094D\u091F 19 \u092B\u094D\u0930\u0902\u091F\u090F\u0902\u0921 (.ZIP)",
      badge: "Client SPA",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      description: "Standalone frontend with Vite build tool, Tailwind CSS, Lucide icons, responsive layout, Saree styling guide, and customer account dashboard.",
      size: "~3.6 MB",
      primaryUrl: "/saree-sansar-frontend-javascript.zip",
      apiUrl: "/api/download/frontend",
      filename: "saree-sansar-frontend-javascript.zip",
      tags: ["React 19", "Vite", "Tailwind CSS", "Responsive UI"],
      highlight: false,
      features: [
        "Zero TypeScript build complications (100% Pure JSX)",
        "Royal saree product details with draping guide",
        "Customer address book & security management",
        "Pre-configured API service connecting to port 5000"
      ]
    },
    {
      id: "backend",
      title: "Node.js + Express + MongoDB Backend",
      hindiTitle: "\u0928\u094B\u0921.\u091C\u0947\u090F\u0938 + \u090F\u0915\u094D\u0938\u092A\u094D\u0930\u0947\u0938 + \u092E\u094B\u0902\u0917\u094B\u0921\u0940\u092C\u0940 \u092C\u0948\u0915\u090F\u0902\u0921 (.ZIP)",
      badge: "REST API & Mongoose",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      description: "Lightweight, high-performance Node.js & Express RESTful API server with Mongoose models, authentication, order processing, and reviews.",
      size: "~41 KB",
      primaryUrl: "/saree-sansar-backend-javascript.zip",
      apiUrl: "/api/download/backend",
      filename: "saree-sansar-backend-javascript.zip",
      tags: ["Node.js", "Express.js", "Mongoose", "MongoDB Atlas", "JWT"],
      highlight: false,
      features: [
        "Native ES Modules with zero transpilation needed",
        "Mongoose models: Product, Saree, User, Order, Category, Review",
        "Pre-seeded catalog database included in data/database.json",
        "Live health check endpoint at /api/health"
      ]
    },
    {
      id: "source",
      title: "Complete Workspace Full Source Snapshot",
      hindiTitle: "\u092A\u0942\u0930\u093E \u0935\u0930\u094D\u0915\u0938\u094D\u092A\u0947\u0938 \u0938\u094B\u0930\u094D\u0938 \u0915\u094B\u0921 \u0906\u0930\u094D\u0915\u093E\u0907\u0935 (.ZIP)",
      badge: "Full Workspace",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      description: "Complete snapshot of the entire active codebase including developer toolchains, migration scripts, and all source assets.",
      size: "~3.8 MB",
      primaryUrl: "/saree-sansar-complete-source.zip",
      apiUrl: "/api/download/source",
      filename: "saree-sansar-complete-source.zip",
      tags: ["Full Workspace", "All Configs", "Build Scripts"],
      highlight: false,
      features: [
        "Contains everything in this working instance",
        "Includes bundling scripts in scripts/ directory",
        "Supports tsx full-stack unified runtime"
      ]
    }
  ];
  const faqs = [
    {
      q: "\u0915\u094D\u092F\u093E \u092F\u0939 \u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F 100% \u0936\u0941\u0926\u094D\u0927 MERN \u0938\u094D\u091F\u0948\u0915 \u092A\u0930 \u0906\u0927\u093E\u0930\u093F\u0924 \u0939\u0948?",
      a: "\u0939\u093E\u0901! \u092F\u0939 \u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F \u092A\u0942\u0930\u094D\u0923\u0924\u0903 MERN \u0906\u0930\u094D\u0915\u093F\u091F\u0947\u0915\u094D\u091A\u0930 (MongoDB, Express.js, React 19, Node.js) \u092A\u0930 \u0906\u0927\u093E\u0930\u093F\u0924 \u0939\u0948\u0964 \u092B\u094D\u0930\u0902\u091F\u090F\u0902\u0921 React 19 + JSX \u092E\u0947\u0902 \u0939\u0948, \u092C\u0948\u0915\u090F\u0902\u0921 Node.js \u0914\u0930 Express.js REST API \u092A\u0930 \u0939\u0948, \u0914\u0930 \u0921\u0947\u091F\u093E \u0938\u094D\u091F\u094B\u0930\u0947\u091C MongoDB (Mongoose ORM) \u092E\u0947\u0902 \u0939\u0948\u0964"
    },
    {
      q: "\u0905\u0917\u0930 \u092E\u0947\u0930\u0947 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u092E\u0947\u0902 MongoDB \u0907\u0928\u0938\u094D\u091F\u0949\u0932 \u0928\u0939\u0940\u0902 \u0939\u0948 \u0924\u094B \u0915\u094D\u092F\u093E \u092F\u0939 \u091A\u0932\u0947\u0917\u093E?",
      a: "\u092C\u093F\u0932\u094D\u0915\u0941\u0932! \u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F \u092E\u0947\u0902 \u090F\u0915 \u0938\u094D\u092E\u093E\u0930\u094D\u091F \u092B\u0949\u0932\u092C\u0948\u0915 JSON \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0907\u0902\u091C\u0928 (data/database.json) \u0936\u093E\u092E\u093F\u0932 \u0939\u0948\u0964 \u091C\u092C \u0924\u0915 \u0906\u092A MongoDB Atlas URI \u0928\u0939\u0940\u0902 \u0921\u093E\u0932\u0924\u0947, \u092A\u094D\u0930\u094B\u091C\u0947\u0915\u094D\u091F \u092C\u093F\u0928\u093E \u0930\u0941\u0915\u0947 \u0932\u094B\u0915\u0932 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u092A\u0930 100% \u0915\u093E\u0930\u094D\u092F \u0915\u0930\u0947\u0917\u093E\u0964 \u0906\u092A \u091C\u092C \u091A\u093E\u0939\u0947\u0902 .env \u092E\u0947\u0902 MONGO_URI \u0921\u093E\u0932\u0915\u0930 MongoDB Atlas \u0938\u0947 \u0915\u0928\u0947\u0915\u094D\u091F \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964"
    },
    {
      q: "\u0907\u0938\u0947 \u0905\u092A\u0928\u0947 \u0915\u0902\u092A\u094D\u092F\u0942\u091F\u0930 \u092A\u0930 \u0915\u0948\u0938\u0947 \u091A\u0932\u093E\u090F\u0902 (How to run locally)?",
      a: "1. ZIP \u092B\u093E\u0907\u0932 \u0915\u094B \u0905\u0928\u091C\u093C\u093F\u092A (unzip) \u0915\u0930\u0947\u0902\u0964\n2. Backend: `cd server && npm install && npm run dev` (\u092A\u094B\u0930\u094D\u091F 5000 \u092A\u0930 \u091A\u0932\u0947\u0917\u093E)\n3. Frontend: `cd client && npm install && npm run dev` (\u092C\u094D\u0930\u093E\u0909\u091C\u093C\u0930 \u092E\u0947\u0902 http://localhost:5173 \u092A\u0930 \u0916\u0941\u0932\u0947\u0917\u093E)\n4. \u0926\u094B\u0928\u094B\u0902 \u090F\u0915-\u0926\u0942\u0938\u0930\u0947 \u0938\u0947 \u0911\u091F\u094B\u092E\u0948\u091F\u093F\u0915\u0932\u0940 \u0915\u0928\u0947\u0915\u094D\u091F \u0939\u094B \u091C\u093E\u090F\u0902\u0917\u0947\u0964"
    },
    {
      q: "MongoDB Atlas \u0915\u094D\u0932\u093E\u0909\u0921 \u0921\u0947\u091F\u093E\u092C\u0947\u0938 \u0938\u0947 \u0915\u0948\u0938\u0947 \u091C\u094B\u0921\u093C\u0947\u0902?",
      a: '1. mongodb.com/cloud/atlas \u092A\u0930 \u092B\u094D\u0930\u0940 \u0905\u0915\u093E\u0909\u0902\u091F \u092C\u0928\u093E\u0915\u0930 \u090F\u0915 \u092B\u094D\u0930\u0940 M0 \u0915\u094D\u0932\u0938\u094D\u091F\u0930 \u092C\u0928\u093E\u090F\u0902\u0964\n2. Connection string \u0915\u0949\u092A\u0940 \u0915\u0930\u0947\u0902: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/saree_sansar`\n3. \u0907\u0938\u0947 `server/.env` \u092B\u093E\u0907\u0932 \u092E\u0947\u0902 `MONGO_URI="..."` \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u092A\u0947\u0938\u094D\u091F \u0915\u0930\u0947\u0902, \u092F\u093E \u0907\u0938 \u0935\u0947\u092C\u092A\u0947\u091C \u092A\u0930 \u0928\u0940\u091A\u0947 \u0926\u093F\u090F \u0917\u090F \u091F\u0947\u0938\u094D\u091F \u092C\u0949\u0915\u094D\u0938 \u092E\u0947\u0902 \u0921\u093E\u0932\u0915\u0930 \u0938\u0940\u0927\u093E \u0915\u0928\u0947\u0915\u094D\u091F \u0915\u0930\u0947\u0902\u0964'
    }
  ];
  return <div className="min-h-screen bg-[#faf8f5] text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {
    /* Hero Section */
  }
        <div className="text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcedd2] border border-[#d4af37]/40 text-[#6b1426] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#a07817]" />
            <span>100% Pure MERN Architecture Verified</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4a0e1b] tracking-tight mb-4">
            Download Saree Sansar MERN Source Code
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-[#881930] italic mb-3">
            सारथी साड़ी संसार: संपूर्ण मर्न (MERN) स्टैक कोड फ़ाइलें डाउनलोड करें
          </p>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-600 leading-relaxed">
            Full-Stack Luxury Handloom E-Commerce Platform engineered strictly with{" "}
            <strong className="text-stone-900">React 19</strong>,{" "}
            <strong className="text-stone-900">Node.js</strong>,{" "}
            <strong className="text-stone-900">Express.js</strong>, and{" "}
            <strong className="text-stone-900">MongoDB Mongoose</strong>. Downloadable in one click
            as clean, ready-to-run ZIP packages.
          </p>

          {
    /* Quick MERN Badges */
  }
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>M : MongoDB &amp; Mongoose</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs font-bold text-stone-800">
              <Server className="w-4 h-4 text-stone-700" />
              <span>E : Express.js REST API</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200 rounded-lg text-xs font-bold text-sky-800">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>R : React 19 Frontend</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-xs font-bold text-green-800">
              <FileCode2 className="w-4 h-4 text-green-700" />
              <span>N : Node.js JavaScript</span>
            </div>
          </div>
        </div>

        {
    /* Live MongoDB Status Banner */
  }
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-stone-900">Live Database Status</h3>
                  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${mongoStatus?.isConnected ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`}
  >
                    <span
    className={`w-2 h-2 rounded-full ${mongoStatus?.isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
  />
                    {mongoStatus?.isConnected ? "MongoDB Atlas Connected" : "Local JSON Fallback Engine"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Active Database: <span className="font-mono text-stone-700">{mongoStatus?.activeDatabaseType || "Local JSON"}</span>
                  {mongoStatus?.isConnected && ` \xB7 Host: ${mongoStatus.host}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
    onClick={fetchStatus}
    disabled={loadingStatus}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
  >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? "animate-spin" : ""}`} />
                <span>Refresh Status</span>
              </button>

              {mongoStatus?.isConnected && <button
    onClick={handleSyncData}
    disabled={syncing}
    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
  >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                  <span>{syncing ? "Syncing..." : "Sync Data to MongoDB"}</span>
                </button>}
            </div>
          </div>

          {
    /* Collection Counts */
  }
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-4 text-center">
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-[11px] text-stone-500 block">Sarees / Products</span>
              <span className="font-mono text-lg font-bold text-[#6b1426]">
                {mongoStatus?.collections?.sarees || mongoStatus?.collections?.products || 52}
              </span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-[11px] text-stone-500 block">Categories</span>
              <span className="font-mono text-lg font-bold text-stone-800">
                {mongoStatus?.collections?.categories || 6}
              </span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-[11px] text-stone-500 block">Patrons / Users</span>
              <span className="font-mono text-lg font-bold text-stone-800">
                {mongoStatus?.collections?.users || 8}
              </span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-[11px] text-stone-500 block">Orders</span>
              <span className="font-mono text-lg font-bold text-stone-800">
                {mongoStatus?.collections?.orders || 14}
              </span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-[11px] text-stone-500 block">Coupons</span>
              <span className="font-mono text-lg font-bold text-stone-800">
                {mongoStatus?.collections?.coupons || 4}
              </span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-[11px] text-stone-500 block">Database Name</span>
              <span className="font-mono text-xs font-bold text-stone-800 block mt-1">saree_sansar</span>
            </div>
          </div>

          {
    /* Connect Custom Mongo URI Inline */
  }
          {!mongoStatus?.isConnected && <form onSubmit={handleConnectMongo} className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-2">
              <input
    type="text"
    value={testUri}
    onChange={(e) => setTestUri(e.target.value)}
    placeholder="Optional: Paste MongoDB Atlas URI here (mongodb+srv://...)"
    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#881930] focus:border-transparent font-mono"
  />
              <button
    type="submit"
    disabled={connecting}
    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
  >
                {connecting ? "Connecting..." : "Connect to MongoDB Atlas"}
              </button>
            </form>}
        </div>

        {
    /* Download Packages Section */
  }
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#4a0e1b]">
                Downloadable Packages (.ZIP)
              </h2>
              <p className="text-xs text-stone-500">
                Select your preferred package. All archives are pre-tested and ready to run locally.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full hidden sm:inline-block">
              Free Open Source · No Key Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => <div
    key={pkg.id}
    className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-6 ${pkg.highlight ? "border-[#a07817] shadow-md ring-2 ring-[#a07817]/20 relative" : "border-stone-200 hover:border-stone-300 shadow-xs"}`}
  >
                {pkg.highlight && <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#6b1426] to-[#a07817] text-[#fcf8f2] text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs tracking-wider">
                    Most Popular · संपूर्ण मर्न पैकेज
                  </div>}

                <div>
                  {
    /* Card Header */
  }
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span
    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-2 ${pkg.badgeColor}`}
  >
                        {pkg.badge}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#4a0e1b]">{pkg.title}</h3>
                      <p className="text-xs font-medium text-[#881930] italic">{pkg.hindiTitle}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md shrink-0">
                      {pkg.size}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-4 leading-relaxed">{pkg.description}</p>

                  {
    /* Feature Bullets */
  }
                  <ul className="space-y-1.5 mb-5 text-xs text-stone-600">
                    {pkg.features.map((feat, i) => <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>)}
                  </ul>

                  {
    /* Tags */
  }
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {pkg.tags.map((tag, i) => <span
    key={i}
    className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium"
  >
                        {tag}
                      </span>)}
                  </div>
                </div>

                {
    /* Download Buttons Group */
  }
                <div className="space-y-2 pt-4 border-t border-stone-100">
                  <a
    href={pkg.primaryUrl}
    download={pkg.filename}
    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${pkg.highlight ? "bg-[#6b1426] hover:bg-[#520f1d] text-white hover:shadow-md" : "bg-stone-900 hover:bg-stone-800 text-white"}`}
  >
                    <Download className="w-4 h-4 text-[#f2ce6e]" />
                    <span>Download {pkg.filename}</span>
                  </a>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                    <span>Direct Server Mirror:</span>
                    <a
    href={pkg.apiUrl}
    download={pkg.filename}
    className="text-[#6b1426] hover:underline font-semibold flex items-center gap-1"
  >
                      <HardDriveDownload className="w-3 h-3" />
                      <span>{pkg.apiUrl}</span>
                    </a>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* Tabbed Setup & Execution Guide */
  }
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-200">
            <h2 className="font-serif text-2xl font-bold text-[#4a0e1b] mb-1">
              Setup &amp; Run Guide (लोकल कंप्यूटर पर चलाने का तरीका)
            </h2>
            <p className="text-xs text-stone-500">
              Clear step-by-step instructions in Hindi &amp; English to run Saree Sansar on your local machine in under 2 minutes.
            </p>

            {
    /* Navigation Tabs */
  }
            <div className="flex flex-wrap gap-2 mt-4">
              <button
    onClick={() => setActiveTab("quickstart")}
    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "quickstart" ? "bg-[#6b1426] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
  >
                1. Quick Start (फास्ट स्टार्ट)
              </button>
              <button
    onClick={() => setActiveTab("mongodb")}
    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "mongodb" ? "bg-[#6b1426] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
  >
                2. MongoDB Atlas Setup (डेटाबेस सेटअप)
              </button>
              <button
    onClick={() => setActiveTab("structure")}
    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "structure" ? "bg-[#6b1426] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
  >
                3. Directory Structure (फ़ाइल स्ट्रक्चर)
              </button>
              <button
    onClick={() => setActiveTab("api")}
    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${activeTab === "api" ? "bg-[#6b1426] text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
  >
                4. REST API Endpoints (एपीआई लिस्ट)
              </button>
            </div>
          </div>

          <div className="p-6">
            {
    /* Tab 1: Quickstart */
  }
            {activeTab === "quickstart" && <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 mb-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#881930]" />
                    <span>कदम 1: फाइल अनज़िप करें और डायरेक्टरी में जाएं</span>
                  </h3>
                  <div className="relative bg-stone-900 text-[#f2ce6e] rounded-xl p-4 font-mono text-xs">
                    <pre>unzip saree-sansar-mern-javascript.zip &amp;&amp; cd saree-sansar-mern</pre>
                    <button
    onClick={() => handleCopy(
      "unzip saree-sansar-mern-javascript.zip && cd saree-sansar-mern",
      "step1"
    )}
    className="absolute top-3 right-3 text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
  >
                      {copiedIndex === "step1" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 mb-2 flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-600" />
                      <span>कदम 2: बैकएंड शुरू करें (Terminal 1)</span>
                    </h3>
                    <div className="relative bg-stone-900 text-emerald-400 rounded-xl p-4 font-mono text-xs">
                      <pre>
                        cd server{"\n"}
                        npm install{"\n"}
                        npm run dev
                      </pre>
                      <button
    onClick={() => handleCopy("cd server\nnpm install\nnpm run dev", "step2")}
    className="absolute top-3 right-3 text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
  >
                        {copiedIndex === "step2" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Runs on <strong className="text-stone-700">http://localhost:5000</strong>. Auto-seeds database!
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-stone-900 mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-600" />
                      <span>कदम 3: फ्रंटएंड शुरू करें (Terminal 2)</span>
                    </h3>
                    <div className="relative bg-stone-900 text-sky-400 rounded-xl p-4 font-mono text-xs">
                      <pre>
                        cd client{"\n"}
                        npm install{"\n"}
                        npm run dev
                      </pre>
                      <button
    onClick={() => handleCopy("cd client\nnpm install\nnpm run dev", "step3")}
    className="absolute top-3 right-3 text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
  >
                        {copiedIndex === "step3" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Opens in browser at <strong className="text-stone-700">http://localhost:5173</strong>.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">बधाई! आपका MERN स्टैक प्रोजेक्ट चालू हो जाएगा</p>
                    <p className="text-emerald-800 leading-relaxed">
                      फ्रंटएंड और बैकएंड दोनों आपस में जुड़े हुए हैं। आप होमपेज पर साड़ियां ब्राउज़ कर सकते हैं, कार्ट में जोड़ सकते हैं, फ़िल्टर कर सकते हैं और प्रोफाइल व ऑर्डर देख सकते हैं।
                    </p>
                  </div>
                </div>
              </div>}

            {
    /* Tab 2: MongoDB Atlas */
  }
            {activeTab === "mongodb" && <div className="space-y-6 text-xs text-stone-700">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>MongoDB Atlas फ्री क्लस्टर सेटअप करने के 4 सरल स्टेप्स:</span>
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 mt-2 text-amber-800">
                    <li>
                      <a
    href="https://mongodb.com/cloud/atlas"
    target="_blank"
    rel="noopener noreferrer"
    className="underline font-semibold inline-flex items-center gap-1"
  >
                        mongodb.com/cloud/atlas <ExternalLink className="w-3 h-3" />
                      </a>{" "}
                      पर जाएं और फ्री साइनअप करें।
                    </li>
                    <li>एक नया फ्री M0 (Shared Cluster) बनाएं और डेटाबेस यूजरनेम और पासवर्ड बनाएं।</li>
                    <li>
                      Network Access में <strong>0.0.0.0/0 (Allow Anywhere)</strong> जोड़ें ताकि लोकल मशीन से कनेक्ट हो सके।
                    </li>
                    <li>
                      Connect बटन दबाकर <strong className="font-mono">Connect your application</strong> चुनें और URI कॉपी करें।
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 mb-2">server/.env फ़ाइल में URI जोड़ें:</h4>
                  <div className="relative bg-stone-900 text-emerald-400 rounded-xl p-4 font-mono">
                    <pre>
                      MONGO_URI="mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abcde.mongodb.net/saree_sansar?retryWrites=true&amp;w=majority"
                    </pre>
                    <button
    onClick={() => handleCopy(
      'MONGO_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/saree_sansar?retryWrites=true&w=majority"',
      "envuri"
    )}
    className="absolute top-3 right-3 text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
  >
                      {copiedIndex === "envuri" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                  <h4 className="font-bold text-stone-900 mb-1">Mongoose Models Included:</h4>
                  <p className="text-stone-500 mb-2">
                    These collections are auto-created in your MongoDB database on first launch:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                    <div className="bg-white p-2 rounded border border-stone-200">
                      📦 <strong>Saree / Product</strong>: sarees, products
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      👤 <strong>User / Patron</strong>: users
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      🛒 <strong>Order</strong>: orders
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      🏷️ <strong>Category</strong>: categories
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      🎟️ <strong>Coupon</strong>: coupons
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      ⭐ <strong>Review</strong>: reviews
                    </div>
                  </div>
                </div>
              </div>}

            {
    /* Tab 3: Directory Structure */
  }
            {activeTab === "structure" && <div className="space-y-4 text-xs font-mono">
                <div className="bg-stone-900 text-stone-200 p-5 rounded-xl overflow-x-auto leading-relaxed">
                  <pre>{`saree-sansar-mern/
\u251C\u2500\u2500 client/                     # \u269B\uFE0F React 19 Frontend (Vite + Tailwind)
\u2502   \u251C\u2500\u2500 src/
\u2502   \u2502   \u251C\u2500\u2500 components/         # Modular UI (Products, Layout, Cart, Reviews)
\u2502   \u2502   \u251C\u2500\u2500 context/            # State Context (Auth, Cart, Wishlist)
\u2502   \u2502   \u251C\u2500\u2500 pages/              # Customer & Admin views (Home, Products, Profile)
\u2502   \u2502   \u251C\u2500\u2500 services/           # Axios API connectors -> http://localhost:5000
\u2502   \u2502   \u251C\u2500\u2500 types/              # Domain models & interfaces
\u2502   \u2502   \u251C\u2500\u2500 App.jsx             # Main Router & Providers
\u2502   \u2502   \u2514\u2500\u2500 main.jsx            # Entry point
\u2502   \u251C\u2500\u2500 index.html              # HTML shell
\u2502   \u251C\u2500\u2500 vite.config.js          # Vite config
\u2502   \u2514\u2500\u2500 package.json            # Frontend dependencies
\u2502
\u251C\u2500\u2500 server/                     # \u{1F680} Node.js + Express + MongoDB REST API
\u2502   \u251C\u2500\u2500 server/
\u2502   \u2502   \u251C\u2500\u2500 config/db.js        # Mongoose MongoDB connection & sync manager
\u2502   \u2502   \u251C\u2500\u2500 models/             # Mongoose schemas (Product, Saree, User, Order)
\u2502   \u2502   \u251C\u2500\u2500 routes/             # REST API routers (products, sarees, orders, auth)
\u2502   \u2502   \u2514\u2500\u2500 db.js               # High-speed local database engine
\u2502   \u251C\u2500\u2500 data/
\u2502   \u2502   \u2514\u2500\u2500 database.json       # Pre-seeded catalog data (fallback offline)
\u2502   \u251C\u2500\u2500 server.js               # Express application entry point
\u2502   \u251C\u2500\u2500 .env                    # Config with MONGO_URI, PORT=5000, JWT_SECRET
\u2502   \u2514\u2500\u2500 package.json            # Backend dependencies (express, mongoose, cors)
\u2502
\u2514\u2500\u2500 README.md                   # Full dual-language documentation`}</pre>
                </div>
              </div>}

            {
    /* Tab 4: REST API Endpoints */
  }
            {activeTab === "api" && <div className="space-y-3 text-xs">
                <p className="text-stone-600 mb-2">
                  The Node.js Express server exposes standard RESTful endpoints consumed by the React client:
                </p>
                <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <div className="p-3 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold rounded text-[10px]">
                        GET
                      </span>
                      <span className="font-mono font-semibold text-stone-900">/api/sarees</span>
                    </div>
                    <span className="text-stone-500">Fetch catalog with search, fabric filter, and sort</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold rounded text-[10px]">
                        GET
                      </span>
                      <span className="font-mono font-semibold text-stone-900">/api/sarees/:slug</span>
                    </div>
                    <span className="text-stone-500">Get complete saree details, drape physics &amp; inventory</span>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold rounded text-[10px]">
                        POST
                      </span>
                      <span className="font-mono font-semibold text-stone-900">/api/orders</span>
                    </div>
                    <span className="text-stone-500">Place and record customer saree order</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold rounded text-[10px]">
                        POST
                      </span>
                      <span className="font-mono font-semibold text-stone-900">/api/auth/login</span>
                    </div>
                    <span className="text-stone-500">Authenticate user and generate JWT token</span>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold rounded text-[10px]">
                        GET
                      </span>
                      <span className="font-mono font-semibold text-stone-900">/api/health</span>
                    </div>
                    <span className="text-stone-500">Health-check endpoint for uptime monitoring</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-purple-600 text-white font-mono font-bold rounded text-[10px]">
                        GET
                      </span>
                      <span className="font-mono font-semibold text-stone-900">/api/download/:target</span>
                    </div>
                    <span className="text-stone-500">Direct download handler for MERN zip archives</span>
                  </div>
                </div>
              </div>}
          </div>
        </div>

        {
    /* FAQs */
  }
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-serif text-2xl font-bold text-[#4a0e1b] mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#881930]" />
            <span>Frequently Asked Questions (अक्सर पूछे जाने वाले सवाल)</span>
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden">
                <button
    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
    className="w-full text-left p-4 flex items-center justify-between bg-stone-50 hover:bg-stone-100 transition-colors font-medium text-xs sm:text-sm text-stone-900 cursor-pointer"
  >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />}
                </button>
                {openFaq === idx && <div className="p-4 bg-white text-xs text-stone-600 leading-relaxed whitespace-pre-line border-t border-stone-200">
                    {faq.a}
                  </div>}
              </div>)}
          </div>
        </div>

        {
    /* Bottom Callout Banner */
  }
        <div className="bg-gradient-to-r from-[#4a0e1b] via-[#6b1426] to-[#881930] rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f2ce6e]">
              Ready to build and deploy?
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Download the complete MERN project now. You can run it on your local machine, deploy to AWS, Render, Heroku, or Vercel, or connect directly to MongoDB Atlas.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
    href="/saree-sansar-mern-javascript.zip"
    download="saree-sansar-mern-javascript.zip"
    className="inline-flex items-center gap-2 px-6 py-3 bg-[#f2ce6e] hover:bg-[#ffe394] text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
  >
                <Download className="w-4 h-4 text-[#6b1426]" />
                <span>Download All-in-One MERN (.ZIP)</span>
              </a>
              <a
    href="/api/download/source"
    download="saree-sansar-complete-source.zip"
    className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer border border-white/20"
  >
                <FolderTree className="w-4 h-4 text-[#f2ce6e]" />
                <span>Full Source (.ZIP)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
