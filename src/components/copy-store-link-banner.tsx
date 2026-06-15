"use client";

import { useState, useEffect } from "react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

export function CopyStoreLinkBanner({ username }: { username: string }) {
  const [storeUrl, setStoreUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Relying on window.location.origin avoids SSR hydration mismatches 
    // and reliably gives us the correct host (localhost vs production domain).
    setStoreUrl(`${window.location.origin}/${username}`);
  }, [username]);

  const handleCopy = async () => {
    if (!storeUrl) return;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="bg-emerald-300 p-6 md:p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] relative overflow-hidden group">
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className={`${bricolage.className} text-2xl font-black uppercase tracking-tight text-slate-900 mb-2`}>
            Share Your Store
          </h2>
          <p className="text-slate-800 font-medium max-w-md">
            Customers can&apos;t buy if they can&apos;t find you. Copy your unique link and blast it on your socials.
          </p>
        </div>
        <button 
          onClick={handleCopy}
          className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-slate-900 hover:bg-slate-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied to Clipboard
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Copy Store Link
            </>
          )}
        </button>
      </div>
      {/* Decorative background element */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
    </div>
  );
}
