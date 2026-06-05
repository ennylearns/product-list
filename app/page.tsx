import Link from 'next/link';
import { Bricolage_Grotesque } from 'next/font/google';
import { auth } from '@/src/lib/auth';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap' });

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-emerald-400 selection:text-slate-900 overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-6 py-6 md:px-12 flex items-center justify-between z-50 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-400 rounded-none transform rotate-45 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"></div>
          <span className={`${bricolage.className} text-xl font-bold tracking-widest uppercase`}>
            PRODUCT LIST
          </span>
        </div>
        <div className="flex items-center gap-6">
          {session ? (
            <Link href="/dashboard" className="text-sm font-semibold tracking-wider hover:text-emerald-400 transition-colors uppercase">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold tracking-wider hover:text-emerald-400 transition-colors uppercase">
              Login
            </Link>
          )}
          <Link 
            href="/signup" 
            className="hidden sm:inline-flex px-6 py-2.5 bg-white text-slate-900 text-sm font-bold uppercase tracking-widest border-2 border-white hover:bg-transparent hover:text-white transition-all shadow-[4px_4px_0px_0px_#10b981] hover:shadow-[2px_2px_0px_0px_#10b981] hover:translate-y-[2px] hover:translate-x-[2px]"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-emerald-500 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto w-full text-center">
          <div className="inline-block mb-6 px-4 py-1.5 border border-emerald-400/30 bg-emerald-400/10 rounded-full backdrop-blur-md">
            <span className="text-emerald-400 font-semibold tracking-wider text-sm uppercase">
              The fastest way to sell online
            </span>
          </div>
          
          <h1 className={`${bricolage.className} text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter uppercase mb-8`}>
            Sell Anything <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-500">
              In Seconds.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Create a stunning storefront, manage your inventory, and receive orders directly to your WhatsApp. No code required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/signup"
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-5 bg-emerald-400 text-slate-900 font-bold uppercase tracking-widest overflow-hidden border-2 border-emerald-400 shadow-[6px_6px_0px_0px_#ffffff] hover:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              <span className="relative z-10 flex items-center gap-3">
                Create Your Store
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-slate-900 py-24 md:py-32 px-6 border-t-2 border-slate-800 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border-2 border-slate-800 hover:border-emerald-400 transition-colors bg-[#0f172a]">
              <div className="w-14 h-14 bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`${bricolage.className} text-2xl font-bold uppercase mb-4`}>Instant Setup</h3>
              <p className="text-slate-400 leading-relaxed">
                Skip the complicated website builders. Just enter your details and get a beautiful, functional storefront immediately.
              </p>
            </div>
            
            <div className="p-8 border-2 border-slate-800 hover:border-emerald-400 transition-colors bg-[#0f172a]">
              <div className="w-14 h-14 bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className={`${bricolage.className} text-2xl font-bold uppercase mb-4`}>Inventory Control</h3>
              <p className="text-slate-400 leading-relaxed">
                Manage your products from a brutalist, fast, and simple dashboard. One-click stock toggles and clean metrics.
              </p>
            </div>
            
            <div className="p-8 border-2 border-slate-800 hover:border-emerald-400 transition-colors bg-[#0f172a]">
              <div className="w-14 h-14 bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className={`${bricolage.className} text-2xl font-bold uppercase mb-4`}>WhatsApp Orders</h3>
              <p className="text-slate-400 leading-relaxed">
                Convert visitors effortlessly. Orders are automatically formatted and sent directly to your WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm tracking-widest uppercase border-t-2 border-slate-800 relative z-10">
        <p>© {new Date().getFullYear()} PRODUCT LIST. Built for merchants.</p>
      </footer>
    </div>
  );
}
