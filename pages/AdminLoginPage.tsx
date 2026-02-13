import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

interface AdminLoginPageProps {
  setIsAdminLoggedIn: (value: boolean) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ setIsAdminLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Tahlil007' && password === 'Tahlil007##') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('designhub_admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Access Denied. Check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-12 left-12 z-20">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-slate-400 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-all group"
        >
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mr-4 group-hover:bg-indigo-600 transition-all shadow-xl">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Exit
        </button>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-600/30">
            <ShieldCheck className="text-white w-12 h-12" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Secure Gateway</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Administrative Clearance Only</p>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-10">
            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-2xl flex items-center text-xs font-black uppercase tracking-widest border border-red-100">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" /> {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 block">Management ID</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input
                  required
                  type="text"
                  placeholder="Username"
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[1.75rem] outline-none font-bold text-slate-900"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 block">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full pl-16 pr-16 py-6 bg-slate-50 border border-slate-100 rounded-[1.75rem] outline-none font-bold text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-all p-2">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-7 rounded-[1.75rem] hover:bg-indigo-600 transition-all shadow-2xl text-xs uppercase tracking-[0.3em] active:scale-95"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-slate-50 flex flex-col items-center gap-6">
             <div className="flex items-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-3 shadow-lg"></div> System Online
             </div>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">Encrypted Session</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;