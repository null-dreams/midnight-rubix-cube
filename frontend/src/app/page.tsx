"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    setShortCode("");
    setQrCode("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(data.shortUrl || `rubix.cube/${data.shortCode}`);
      setShortCode(data.shortCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetQR = async () => {
    if (!shortCode) return;
    try {
      const response = await fetch(`/api/${shortCode}/qr`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get QR code");
      setQrCode(data.qrCode);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const showToast = () => {
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 3000);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shortUrl);
      showToast();
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = shortUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast();
      } catch (err) {
        alert("Failed to copy to clipboard." + err);
      }
      textArea.remove();
    }
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 bg-[#f9f9fb] dark:bg-slate-950 flex justify-between items-center w-full px-8 py-6 max-w-none">
        <div className="text-2xl font-bold tracking-tighter text-[#b02700] dark:text-[#dc3300] font-headline">
          Rubix Cube
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="font-headline uppercase tracking-wider text-sm font-bold text-[#b02700] border-b-2 border-[#b02700] pb-1" href="#">Shorten</a>
          <a className="font-headline uppercase tracking-wider text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#b02700] transition-colors duration-0" href="#">Analytics</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-600 hover:text-[#b02700]">account_circle</button>
          <button className="bg-primary-gradient text-on-primary px-6 py-2 font-label text-xs uppercase tracking-widest font-bold transition-all duration-75 active:opacity-80 active:scale-100">
            Get Started
          </button>
        </div>
      </header>

      <main className="min-h-screen pb-20 cube-grid-bg pt-48 flex justify-center w-full">
        <div className="w-full max-w-6xl px-8">
          {/* Hero Section / URL Shortener Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-outline-variant/20 bg-surface-container-lowest">
            {/* Input Bay (7 Columns) */}
            <div className="lg:col-span-7 p-12 lg:border-r border-outline-variant/20 flex flex-col justify-center">
              <div className="mb-12">
                <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4 block">01 / Input Module</span>
                <h2 className="font-headline text-3xl font-bold tracking-tight">ENCODE NEW ENDPOINT</h2>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error">
                  <span className="font-body text-sm font-medium">{error}</span>
                </div>
              )}

              <form className="space-y-12" onSubmit={handleSubmit}>
                <div className="relative">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Destination Source URL</label>
                  <input 
                    className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-outline focus:border-b-2 focus:border-primary focus:ring-0 px-0 py-4 text-lg font-body placeholder:text-surface-container-highest transition-all outline-none" 
                    placeholder="https://very-long-architectural-data-string.com/resource/v1" 
                    type="url" 
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-8">
                  <button 
                    className="bg-primary-gradient text-on-primary px-12 py-5 font-label text-sm uppercase tracking-[0.2em] font-bold group overflow-hidden relative disabled:opacity-50" 
                    type="submit"
                    disabled={loading || !url ? true : undefined}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? 'PROCESSING...' : 'SHORTEN'} <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Preview/Success Area (5 Columns) */}
            <div className={`lg:col-span-5 bg-surface-container-low p-12 flex flex-col justify-between transition-opacity duration-500 ${shortUrl ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div>
                <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-4 block">02 / Output Result</span>
                <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">COMPRESSED ASSET</h2>
                
                <div className="space-y-6">
                  {/* Shortened Link Box */}
                  <div className="bg-surface-container-lowest p-6 border border-outline-variant/20 flex items-center justify-between group">
                    <div className="overflow-hidden">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Generated Link</span>
                      <span className="text-xl font-headline font-bold text-primary truncate block">
                        {shortUrl || 'rubix.cube/xJ92kL'}
                      </span>
                    </div>
                    <button onClick={copyToClipboard} className="p-4 hover:bg-surface-container-highest transition-colors group">
                      <span className="material-symbols-outlined text-primary">content_copy</span>
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={handleGetQR} disabled={!shortCode} className="flex-1 border border-primary text-primary px-4 py-4 font-label text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-on-primary transition-all flex justify-center gap-2 items-center disabled:opacity-50">
                      <span className="material-symbols-outlined text-sm">qr_code</span> GET QR
                    </button>
                    <button type="button" className="flex-1 border border-primary text-primary px-4 py-4 font-label text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-on-primary transition-all flex justify-center gap-2 items-center disabled:opacity-50">
                      <span className="material-symbols-outlined text-sm">share</span> SHARE
                    </button>
                  </div>

                  {qrCode && (
                    <div className="mt-6 flex flex-col items-center animate-fade-in gap-4">
                      <div className="bg-white p-4 border border-outline-variant/20 shadow-sm">
                        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                      </div>
                      <a
                        href={qrCode}
                        download={`qr-code-${shortCode}.png`}
                        className="border border-primary text-primary px-6 py-3 font-label text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-on-primary transition-all flex justify-center gap-2 items-center inline-flex"
                      >
                        <span className="material-symbols-outlined text-sm">download</span> DOWNLOAD PNG
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Ambient Occlusion Logic Info */}
              <div className="mt-12 pt-12 border-t border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <div className="grid grid-cols-3 gap-0.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-primary"></div>
                    <div className="w-1.5 h-1.5 bg-secondary-container"></div>
                    <div className="w-1.5 h-1.5 bg-primary"></div>
                    <div className="w-1.5 h-1.5 bg-secondary-container"></div>
                    <div className="w-1.5 h-1.5 bg-primary"></div>
                    <div className="w-1.5 h-1.5 bg-secondary-container"></div>
                    <div className="w-1.5 h-1.5 bg-primary"></div>
                    <div className="w-1.5 h-1.5 bg-secondary-container"></div>
                    <div className="w-1.5 h-1.5 bg-primary"></div>
                  </div>
                  <p className="font-body text-[10px] leading-relaxed text-on-surface-variant uppercase tracking-wider">
                    SYSTEM STATUS: OPTIMAL<br/>
                    COMPRESSION RATIO: 84%<br/>
                    ENCRYPTION: ACTIVE (AES-256)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 shadow-xl flex items-center gap-3 transition-all duration-500 z-[100] ${showCopyMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
        <span className="font-body text-sm font-medium tracking-wide">Link copied to clipboard!</span>
      </div>

      {/* Footer */}
      <footer className="bg-[#f9f9fb] dark:bg-slate-950 flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 border-t border-[#e8bdb3]/20">
        <div className="mb-8 md:mb-0">
          <span className="font-body text-xs tracking-widest uppercase text-slate-500 dark:text-slate-500">© 2026 Rubix Cube</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="font-body text-xs tracking-widest uppercase text-slate-500 dark:text-slate-500 hover:text-[#b02700] underline decoration-2 underline-offset-4 transition-all duration-75" href="#">Terms</a>
          <a className="font-body text-xs tracking-widest uppercase text-slate-500 dark:text-slate-500 hover:text-[#b02700] underline decoration-2 underline-offset-4 transition-all duration-75" href="#">Privacy</a>
          <a className="font-body text-xs tracking-widest uppercase text-slate-500 dark:text-slate-500 hover:text-[#b02700] underline decoration-2 underline-offset-4 transition-all duration-75" href="#">API</a>
          <a className="font-body text-xs tracking-widest uppercase text-slate-500 dark:text-slate-500 hover:text-[#b02700] underline decoration-2 underline-offset-4 transition-all duration-75" href="#">GitHub</a>
        </div>
      </footer>
    </>
  );
}
