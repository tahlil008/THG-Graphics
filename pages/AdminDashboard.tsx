
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  X,
  Upload,
  Bell,
  ArrowLeft,
  AlertCircle,
  LogOut,
  Sparkles,
  RefreshCcw,
  Database,
  CloudOff,
  Cloud
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

const supabase = (SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && SUPABASE_URL !== '') 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, setProjects, orders, setOrders, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline'>('offline');
  const prevOrdersCount = useRef(orders.length);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  useEffect(() => {
    if (supabase) {
      setDbStatus('connected');
    } else {
      setDbStatus('offline');
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const formatted: Order[] = data.map((d: any) => ({
          id: d.id,
          clientName: d.client_name,
          email: d.email,
          whatsapp: d.whatsapp,
          phone: d.phone,
          projectType: d.project_type,
          details: d.details,
          status: d.status,
          fileUrl: d.file_url,
          createdAt: d.created_at
        }));
        setOrders(formatted);
      }
    } else {
      const savedOrders = localStorage.getItem('designhub_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    }
    setTimeout(() => setIsSyncing(false), 800);
  };

  useEffect(() => {
    if (orders.length > prevOrdersCount.current) {
      const latestOrder = orders[0]; 
      if (latestOrder && prevOrdersCount.current !== 0) {
        setNewOrderAlert(latestOrder);
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (e) {}
        setTimeout(() => setNewOrderAlert(null), 8000);
      }
    }
    prevOrdersCount.current = orders.length;
  }, [orders]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] relative">
      {/* Real-time Pop-up Notification */}
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
            <button onClick={() => setNewOrderAlert(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      )}

      <aside className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col pt-16 lg:pt-0 z-40 shadow-sm lg:sticky lg:top-0 h-auto lg:h-screen transition-all duration-300">
        <div className="hidden lg:flex p-10 items-center border-b border-slate-50 mt-12 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center mr-5 shadow-2xl">
             <LayoutDashboard className="text-white w-7 h-7" />
          </div>
          <div>
            <span className="font-black text-slate-900 text-xl block tracking-tighter">Control Hub</span>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5 block">Admin Panel</span>
          </div>
        </div>
        
        <nav className="p-6 space-y-3 flex-grow">
          <Link to="/admin" className={`flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname === '/admin' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
            <TrendingUp className="w-5 h-5 mr-4" /> Analytics
          </Link>
          <Link to="/admin/projects" className={`flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname.startsWith('/admin/projects') ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Briefcase className="w-5 h-5 mr-4" /> Portfolio
          </Link>
          <Link to="/admin/orders" className={`flex items-center justify-between p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname.startsWith('/admin/orders') ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-4" /> Orders
            </div>
            {pendingCount > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[9px] animate-pulse">{pendingCount}</span>}
          </Link>
          
          <div className="pt-6 border-t border-slate-50 mt-6 space-y-2">
            <div className={`flex items-center p-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest border border-slate-100 mb-4 ${dbStatus === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
               {dbStatus === 'connected' ? <Cloud className="w-4 h-4 mr-3" /> : <CloudOff className="w-4 h-4 mr-3" />}
               {dbStatus === 'connected' ? 'Cloud Online' : 'Local Mode'}
            </div>
            <button onClick={handleSync} className={`w-full flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${isSyncing ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}>
              <RefreshCcw className={`w-5 h-5 mr-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
              {isSyncing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all">
              <LogOut className="w-5 h-5 mr-4" /> Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-grow p-6 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {dbStatus === 'offline' && location.pathname === '/admin' && (
            <div className="mb-10 p-8 bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] flex items-start gap-6">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-amber-900 text-lg">ডাটাবেস কানেক্ট করা হয়নি!</h4>
                <p className="text-amber-700 font-medium mt-1">
                  আপনার অ্যাপটি বর্তমানে "লোকাল মোড" এ চলছে। অন্য ডিভাইস থেকে অর্ডার পেতে হলে আপনাকে <b>config.ts</b> ফাইলে আপনার Supabase ডিটেইলস দিতে হবে। 
                  ডিটেইলস না দিলে অন্য ডিভাইসের অর্ডার এখানে আসবে না।
                </p>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<StatsView projects={projects} orders={orders} />} />
            <Route path="/projects" element={<ManageProjects projects={projects} setProjects={setProjects} />} />
            <Route path="/orders" element={<ManageOrders orders={orders} setOrders={setOrders} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const ManageProjects = ({ projects, setProjects }: { projects: Project[], setProjects: React.Dispatch<React.SetStateAction<Project[]>> }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '' as Category | '', subcategory: '' as SubCategory | '', description: '', link: '', imageUrl: '' });

  const resetForm = () => {
    setFormData({ name: '', category: '', subcategory: '', description: '', link: '', imageUrl: '' });
    setShowAddForm(false);
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: editingProject ? editingProject.id : Math.random().toString(36).substr(2, 9),
      name: formData.name,
      category: formData.category as Category,
      subcategory: formData.subcategory as SubCategory,
      description: formData.description,
      link: formData.link,
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${Math.random()}/800/600`,
      createdAt: editingProject ? editingProject.createdAt : Date.now()
    };
    setProjects(prev => {
      const updated = editingProject ? prev.map(p => p.id === editingProject.id ? newProject : p) : [newProject, ...prev];
      localStorage.setItem('designhub_projects', JSON.stringify(updated));
      return updated;
    });
    resetForm();
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Portfolio Master</h2>
        <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center hover:bg-indigo-700 shadow-xl"><Plus className="w-5 h-5 mr-3" /> Add Project</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl">
             <img src={project.imageUrl} className="w-full h-48 object-cover" alt={project.name} />
             <div className="p-8">
                <h3 className="font-black text-xl mb-2">{project.name}</h3>
                <div className="flex gap-4 mt-6 pt-6 border-t border-slate-50">
                   <button onClick={() => { setEditingProject(project); setFormData({...project}); setShowAddForm(true); }} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Edit className="w-4 h-4" /></button>
                   <button onClick={() => { if(window.confirm('Delete?')){ setProjects(projects.filter(p => p.id !== project.id)); }}} className="p-3 bg-red-50 text-red-600 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        ))}
      </div>
      {showAddForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-12 relative shadow-2xl">
            <button onClick={resetForm} className="absolute top-8 right-8 text-slate-400"><X /></button>
            <h3 className="text-3xl font-black mb-8">{editingProject ? 'Edit' : 'Add'} Project</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
               <input required placeholder="Name" className="w-full px-6 py-4 bg-slate-50 rounded-[1.25rem] outline-none font-bold" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
               <select required className="w-full px-6 py-4 bg-slate-50 rounded-[1.25rem] outline-none font-bold" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value as any})}>
                 <option value="">Category</option>
                 {Object.keys(CATEGORIES).map(c=><option key={c} value={c}>{c}</option>)}
               </select>
               <textarea required placeholder="Description" className="w-full px-6 py-4 bg-slate-50 rounded-[1.5rem] outline-none font-bold h-32" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} />
               <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] uppercase text-xs tracking-widest">Save Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatsView = ({ projects, orders }: { projects: Project[], orders: Order[] }) => {
  const pending = orders.filter(o => o.status === 'Pending').length;
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Dashboard</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Monitoring studio performance and live inquiries.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <StatCard icon={<Briefcase className="w-8 h-8" />} label="Total Portfolio" value={projects.length.toString()} color="indigo" />
        <StatCard icon={<FileText className="w-8 h-8" />} label="All Orders" value={orders.length.toString()} color="blue" />
        <StatCard icon={<Clock className="w-8 h-8" />} label="Pending" value={pending.toString()} color="amber" />
      </div>
      <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
        <h3 className="text-2xl font-black mb-8">Recent Orders</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="p-6 rounded-3xl bg-slate-50 flex justify-between items-center">
              <div>
                <p className="font-black text-slate-900">{order.clientName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.projectType}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{order.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ManageOrders = ({ orders, setOrders }: { orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>> }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateStatus = async (id: string, status: Order['status']) => {
    if (supabase) {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) alert("Error updating cloud");
    }
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('designhub_orders', JSON.stringify(updated));
    if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
  };

  const deleteOrder = async (id: string) => {
    if (window.confirm('Delete?')) {
      if (supabase) await supabase.from('orders').delete().eq('id', id);
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('designhub_orders', JSON.stringify(updated));
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Manage Orders</h2>
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
              <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/50">
                <td className="px-10 py-8">
                  <div className="font-black text-slate-900 text-lg">{order.clientName}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{order.projectType}</div>
                </td>
                <td className="px-10 py-8 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{order.status}</span>
                </td>
                <td className="px-10 py-8 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-10 relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-10 right-10 p-4 text-slate-400"><X /></button>
            <h3 className="text-4xl font-black mb-8">{selectedOrder.clientName}</h3>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-3xl font-bold text-lg">{selectedOrder.details}</div>
              <div className="flex gap-4">
                 <button onClick={()=>updateStatus(selectedOrder.id, 'Completed')} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs">Mark Completed</button>
                 <button onClick={()=>deleteOrder(selectedOrder.id)} className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-xs">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl group">
    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 bg-${color}-50 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white transition-all`}>
      {icon}
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
    <p className="text-5xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

export default AdminDashboard;
