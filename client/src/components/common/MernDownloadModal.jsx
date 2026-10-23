import { Link } from "react-router-dom";
import {
  Download,
  X,
  FileCode2,
  Database,
  Server,
  Layers,
  Terminal,
  CheckCircle,
  Sparkles
} from "lucide-react";
export const MernDownloadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <div
    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    onClick={onClose}
  >
      <div
    className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 my-8 text-stone-900"
    onClick={(e) => e.stopPropagation()}
  >
        {
    /* Close Button */
  }
        <button
    onClick={onClose}
    className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
    aria-label="Close modal"
  >
          <X className="w-5 h-5" />
        </button>

        {
    /* Modal Header */
  }
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#6b1426] text-[#f2ce6e] flex items-center justify-center font-bold text-lg shadow-sm">
            MERN
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#6b1426]">
              Download MERN Stack Project
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              React 19 + Node.js + Express.js + MongoDB Mongoose (Pure JavaScript &amp; Production-Ready)
            </p>
          </div>
        </div>

        {
    /* Hindi & English Intro */
  }
        <div className="bg-[#fcf8f2] border border-[#e8d8be] rounded-xl p-4 my-4 text-xs text-stone-700 leading-relaxed">
          <p className="font-medium text-[#7a1b30] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-[#a07817]" />
            <span>MERN स्टैक सोर्स कोड डाउनलोड (React, Node.js, Express, MongoDB)</span>
          </p>
          <p>
            इस पूरे ई-कॉमर्स साड़ी प्लेटफॉर्म को 100% शुद्ध MERN आर्किटेक्चर में तैयार किया गया है। आप नीचे दिए गए बटन पर क्लिक करके पूरा कोड ZIP फाइल में तुरंत डाउनलोड कर सकते हैं।
          </p>
        </div>

        {
    /* Architecture Pill Badges */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">MongoDB</p>
              <p className="text-[10px] text-emerald-700">Mongoose Models</p>
            </div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 flex items-center gap-2">
            <Server className="w-5 h-5 text-stone-700 shrink-0" />
            <div>
              <p className="font-bold text-stone-900">Express.js</p>
              <p className="text-[10px] text-stone-600">RESTful APIs</p>
            </div>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-2.5 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <p className="font-bold text-sky-950">React 19</p>
              <p className="text-[10px] text-sky-700">Vite + Tailwind</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-green-700 shrink-0" />
            <div>
              <p className="font-bold text-green-950">Node.js</p>
              <p className="text-[10px] text-green-700">Pure JavaScript</p>
            </div>
          </div>
        </div>

        {
    /* Download Action Cards */
  }
        <div className="space-y-3 mb-6">
          {
    /* Complete Combined MERN Package */
  }
          <a
    href="/saree-sansar-mern-javascript.zip"
    download="saree-sansar-mern-javascript.zip"
    className="flex items-center justify-between p-4 bg-gradient-to-r from-[#6b1426] to-[#881930] text-white rounded-xl shadow-md hover:from-[#520f1d] hover:to-[#6b1426] transition-all group cursor-pointer"
  >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-[#f2ce6e] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold flex items-center gap-1.5">
                  <span>Download Complete MERN Stack Project (.ZIP)</span>
                  <span className="text-[10px] bg-[#f2ce6e] text-stone-950 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    All-in-One
                  </span>
                </p>
                <p className="text-xs text-rose-100">
                  Combined frontend + backend with package.json, MongoDB scripts &amp; setup guides (~3.7 MB)
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                Download
              </span>
            </div>
          </a>

          {
    /* Split Packages Grid */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
    href="/saree-sansar-frontend-javascript.zip"
    download="saree-sansar-frontend-javascript.zip"
    className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-between group transition-colors cursor-pointer"
  >
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-sky-600 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900">React Frontend (.ZIP)</p>
                  <p className="text-[10px] text-stone-500">Pure JSX, Tailwind, Router</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-stone-400 group-hover:text-stone-800 shrink-0" />
            </a>

            <a
    href="/saree-sansar-backend-javascript.zip"
    download="saree-sansar-backend-javascript.zip"
    className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-between group transition-colors cursor-pointer"
  >
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900">Node + Express + Mongo (.ZIP)</p>
                  <p className="text-[10px] text-stone-500">Mongoose Models &amp; REST API</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-stone-400 group-hover:text-stone-800 shrink-0" />
            </a>
          </div>
        </div>

        {
    /* Quick Setup Instructions */
  }
        <div className="bg-stone-900 text-stone-200 rounded-xl p-4 text-xs font-mono">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800 text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5 font-sans font-semibold text-stone-300">
              <Terminal className="w-3.5 h-3.5 text-[#f2ce6e]" />
              Local Execution Steps (लोकल कंप्यूटर पर चलाने का तरीका)
            </span>
            <span className="text-[10px]">Bash / Terminal</span>
          </div>
          <p className="text-stone-400 text-[11px] mb-1 font-sans">1. Unpack &amp; install:</p>
          <div className="bg-black/50 p-2 rounded text-[#f2ce6e] mb-2 overflow-x-auto text-[11px]">
            unzip saree-sansar-mern-javascript.zip &amp;&amp; cd saree-sansar-mern
          </div>
          <p className="text-stone-400 text-[11px] mb-1 font-sans">2. Start Backend &amp; Frontend:</p>
          <div className="bg-black/50 p-2 rounded text-emerald-400 overflow-x-auto text-[11px]">
            # Terminal 1 (Backend): cd backend &amp;&amp; npm install &amp;&amp; npm run dev<br />
            # Terminal 2 (Frontend): cd frontend &amp;&amp; npm install &amp;&amp; npm run dev
          </div>
          <p className="text-[10px] text-stone-400 mt-2 font-sans flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            MongoDB runs on localhost:27017 or uses the pre-seeded JSON database automatically if MongoDB server is offline.
          </p>
        </div>

        {
    /* Modal Footer */
  }
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
          <Link
    to="/download"
    onClick={onClose}
    className="text-xs text-[#881930] hover:text-[#520f1d] font-bold flex items-center gap-1.5"
  >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Open Dedicated Download Page &amp; MongoDB Atlas Manager →</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
    onClick={onClose}
    className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
  >
              Close (बंद करें)
            </button>
          </div>
        </div>
      </div>
    </div>;
};
