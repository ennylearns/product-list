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
    <div className="bg-emerald-50 p-6 md:p-8 rounded-2xl border border-emerald-100 relative overflow-hidden">
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className={`${bricolage.className} text-2xl font-bold tracking-tight text-emerald-950 mb-2`}>
            Share your store
          </h2>
          <p className="text-emerald-800/80 font-medium max-w-md">
            Customers can&apos;t buy if they can&apos;t find you. Copy your unique link and blast it on your socials.
          </p>
        </div>
        <button 
          onClick={handleCopy}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied to clipboard
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Copy store link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
