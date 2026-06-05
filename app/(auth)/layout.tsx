export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-800 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Soft background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/50 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-full" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
