
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  X,
  Bell,
  LogOut,
  RefreshCcw,
  CloudOff,
  Cloud,
  Edit,
  Trash2,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Project, Order, Category, SubCategory, CATEGORIES } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

interface AdminDashboardProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  handleLogout: () => void;
}

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL';
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, setProjects, orders, setOrders, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const prevOrdersCount = useRef(orders.length);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  const handleSync = async () => {
    setIsSyncing(true);
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(data.map((d: any) => ({
          id: d.id, clientName: d.client_name, email: d.email, whatsapp: d.whatsapp, 
          phone: d.phone, projectType: d.project_type, details: d.details,
          status: d.status, fileUrl: d.file_url, createdAt: d.created_at
        })));
      }
    }
    setTimeout(() => setIsSyncing(false), 1000);
  };

  useEffect(() => {
    // Alert logic for new orders from other devices
    if (orders.length > prevOrdersCount.current && prevOrdersCount.current !== 0) {
      const latest = orders[0];
      setNewOrderAlert(latest);
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch (e) {}
      setTimeout(() => setNewOrderAlert(null), 10000);
    }
    prevOrdersCount.current = orders.length;
  }, [orders]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9FAFB] relative">
      {newOrderAlert && (
        <div className="fixed top-6 right-6 z-[300] animate-in slide-in-from-right-10 fade-in duration-500">
          <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl border border-indigo-500/30 flex items-center gap-5 max-w-sm">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 animate-bounce">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">New Order Received!</p>
              <p className="font-bold text-sm truncate">{newOrderAlert.clientName}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{newOrderAlert.projectType}</p>
            </div>
            <button onClick={() => setNewOrderAlert(null)} className="p-2 hover:bg-white/10 rounded-full">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}

      <aside className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col pt-16 lg:pt-0 z-40 shadow-sm h-screen lg:sticky lg:top-0">
        <div className="p-10 border-b border-slate-50 mb-8 flex items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
             <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-slate-900 text-lg block tracking-tight">Admin Hub</span>
            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest block">Control Panel</span>
          </div>
        </div>
        
        <nav className="p-6 space-y-2 flex-grow">
          <Link to="/admin" className={`flex items-center p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname === '/admin' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
            <TrendingUp className="w-5 h-5 mr-4" /> Dashboard
          </Link>
          <Link to="/admin/projects" className={`flex items-center p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname.startsWith('/admin/projects') ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Briefcase className="w-5 h-5 mr-4" /> Portfolio
          </Link>
          <Link to="/admin/orders" className={`flex items-center justify-between p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname.startsWith('/admin/orders') ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-4" /> Orders
            </div>
            {pendingCount > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[9px]">{pendingCount}</span>}
          </Link>
          
          <div className="pt-6 border-t border-slate-50 mt-6 space-y-3">
            <div className={`flex items-center p-4 rounded-xl font-black text-[9px] uppercase tracking-widest ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
               {isSupabaseConfigured ? <Cloud className="w-4 h-4 mr-3" /> : <CloudOff className="w-4 h-4 mr-3" />}
               {isSupabaseConfigured ? 'Sync Active' : 'Offline Mode'}
            </div>
            <button onClick={handleSync} className="w-full flex items-center p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50">
              <RefreshCcw className={`w-5 h-5 mr-4 ${isSyncing ? 'animate-spin' : ''}`} /> Sync Cloud
            </button>
            <button onClick={handleLogout} className="w-full flex items-center p-5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-4" /> Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-grow p-6 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {!isSupabaseConfigured && (
            <div className="mb-10 p-8 bg-amber-50 border border-amber-200 rounded-[2.5rem] flex items-center gap-6">
              <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-black text-amber-900 text-lg uppercase tracking-tight">Warning: Device Sync is Disabled</h4>
                <p className="text-amber-700 font-medium">You will not see orders from other devices until you configure <b>config.ts</b> with Supabase keys.</p>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<DashboardView projects={projects} orders={orders} />} />
            <Route path="/projects" element={<ProjectsManager projects={projects} setProjects={setProjects} />} />
            <Route path="/orders" element={<OrdersManager orders={orders} setOrders={setOrders} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// Sub-components for Admin
const DashboardView = ({ projects, orders }: any) => (
  <div className="space-y-12">
    <header>
      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Overview</h2>
      <p className="text-slate-500 font-medium mt-2">Real-time studio health and client engagement.</p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <StatBox label="Portfolio" value={projects.length} color="indigo" />
      <StatBox label="Total Orders" value={orders.length} color="blue" />
      <StatBox label="Pending" value={orders.filter((o:any) => o.status === 'Pending').length} color="amber" />
    </div>
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
      <h3 className="text-2xl font-black mb-8 tracking-tight">Latest Client Inquiries</h3>
      <div className="space-y-4">
        {orders.slice(0, 5).map((o: any) => (
          <div key={o.id} className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center group">
            <div>
              <p className="font-black text-slate-900">{o.clientName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{o.projectType}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${o.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StatBox = ({ label, value, color }: any) => (
  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-lg">
    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">{label}</p>
    <p className={`text-6xl font-black text-slate-900 tracking-tighter`}>{value}</p>
  </div>
);

const ProjectsManager = ({ projects, setProjects }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', description: '', imageUrl: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newProject = { ...formData, id: Date.now().toString(), createdAt: Date.now() };
    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem('designhub_projects', JSON.stringify(updated));
    setShowForm(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black tracking-tighter">Portfolio Assets</h2>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all"><Plus className="w-5 h-5 mr-2 inline" /> Add Work</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p: any) => (
          <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100">
            <img src={p.imageUrl} className="w-full h-48 object-cover" />
            <div className="p-8 flex justify-between items-center">
              <h4 className="font-black text-lg">{p.name}</h4>
              <div className="flex gap-2">
                <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-lg relative">
             <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-slate-400"><X /></button>
             <h3 className="text-2xl font-black mb-6">New Showcase Asset</h3>
             <form onSubmit={handleSubmit} className="space-y-4">
               <input required placeholder="Project Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
               <input required placeholder="Image URL" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
               <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Save to Portfolio</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersManager = ({ orders, setOrders }: any) => {
  const [viewing, setViewing] = useState<any>(null);

  const updateStatus = async (id: string, status: string) => {
    if (supabase) {
      await supabase.from('orders').update({ status }).eq('id', id);
    }
    const updated = orders.map((o: any) => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('designhub_orders', JSON.stringify(updated));
    setViewing(null);
  };

  const deleteOrder = async (id: string) => {
    if (confirm('Delete?')) {
      if (supabase) await supabase.from('orders').delete().eq('id', id);
      const updated = orders.filter((o: any) => o.id !== id);
      setOrders(updated);
      localStorage.setItem('designhub_orders', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-black tracking-tighter">Live Orders</h2>
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-10 py-8">Client</th>
              <th className="px-10 py-8 text-center">Lifecycle</th>
              <th className="px-10 py-8 text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-8">
                  <div className="font-black text-slate-900 text-lg">{o.clientName}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{o.projectType}</div>
                </td>
                <td className="px-10 py-8 text-center">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${o.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{o.status}</span>
                </td>
                <td className="px-10 py-8 text-right">
                  <button onClick={() => setViewing(o)} className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Review</button>
                  <button onClick={() => deleteOrder(o.id)} className="ml-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewing && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white p-12 rounded-[4rem] w-full max-w-2xl relative shadow-2xl animate-in zoom-in duration-300">
             <button onClick={() => setViewing(null)} className="absolute top-10 right-10 text-slate-400 hover:text-red-500 transition-all"><X className="w-8 h-8" /></button>
             <h3 className="text-4xl font-black mb-4 tracking-tighter">{viewing.clientName}</h3>
             <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.4em] mb-10">{viewing.projectType}</p>
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border-l-8 border-indigo-600 mb-10 text-lg font-bold leading-relaxed">{viewing.details}</div>
             <div className="flex flex-col sm:flex-row gap-4 border-t pt-10">
                <button onClick={() => updateStatus(viewing.id, 'Completed')} className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Mark Complete</button>
                <button onClick={() => setViewing(null)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Close</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
