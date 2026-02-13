
import React, { useState } from 'react';
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
  Link as LinkIcon,
  MessageCircle,
  Mail,
  Bell,
  ArrowLeft,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { Project, Order, Category, SubCategory, CATEGORIES } from '../types';

interface AdminDashboardProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  handleLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, setProjects, orders, setOrders, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
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
          <Link 
            to="/admin" 
            className={`flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname === '/admin' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <TrendingUp className="w-5 h-5 mr-4" /> Analytics
          </Link>
          <Link 
            to="/admin/projects" 
            className={`flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname.startsWith('/admin/projects') ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Briefcase className="w-5 h-5 mr-4" /> Portfolio
          </Link>
          <Link 
            to="/admin/orders" 
            className={`flex items-center justify-between p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${location.pathname.startsWith('/admin/orders') ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-4" /> Orders
            </div>
            {pendingCount > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[9px]">{pendingCount}</span>}
          </Link>
          <div className="pt-6 border-t border-slate-50 mt-6 space-y-2">
            <button onClick={() => navigate('/')} className="w-full flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all">
              <ArrowLeft className="w-5 h-5 mr-4" /> Public View
            </button>
            <button onClick={handleLogout} className="w-full flex items-center p-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all">
              <LogOut className="w-5 h-5 mr-4" /> Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-grow p-6 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
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
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '' as Category | '',
    subcategory: '' as SubCategory | '',
    description: '',
    link: '',
    imageUrl: ''
  });

  const resetForm = () => {
    setFormData({ name: '', category: '', subcategory: '', description: '', link: '', imageUrl: '' });
    setShowAddForm(false);
    setEditingProject(null);
    setErrorMsg('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size is too large. Please select a file smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.category || !formData.subcategory) {
      setErrorMsg("Please select both category and subcategory.");
      return;
    }

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

    try {
      setProjects(prev => {
        const updated = editingProject 
          ? prev.map(p => p.id === editingProject.id ? newProject : p) 
          : [newProject, ...prev];
        
        localStorage.setItem('designhub_projects', JSON.stringify(updated));
        return updated;
      });
      resetForm();
    } catch (err) {
      console.error("Storage error:", err);
      setErrorMsg("Failed to save project. The image might be too large or storage is full.");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Permanently delete project?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('designhub_projects', JSON.stringify(updated));
    }
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setFormData({ 
      name: p.name, 
      category: p.category, 
      subcategory: p.subcategory, 
      description: p.description, 
      link: p.link || '', 
      imageUrl: p.imageUrl 
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Portfolio Master</h2>
          <p className="text-slate-500 mt-2 font-medium">Manage your agency's best work assets.</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center hover:bg-indigo-700 transition-all shadow-xl">
          <Plus className="w-5 h-5 mr-3" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl flex flex-col group transition-all hover:-translate-y-1">
            <div className="aspect-video relative overflow-hidden bg-slate-100">
              <img src={project.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={project.name} />
            </div>
            <div className="p-8 flex-grow">
              <h3 className="font-black text-xl mb-2 text-slate-900 leading-tight">{project.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{project.description}</p>
              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{project.category}</span>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(project)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-8 sm:p-12 relative shadow-2xl my-auto">
            <button onClick={resetForm} className="absolute top-8 right-8 p-3 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full transition-all"><X className="w-6 h-6" /></button>
            <h3 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">{editingProject ? 'Edit Project' : 'New Project'}</h3>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center text-sm font-bold border border-red-100">
                <AlertCircle className="w-4 h-4 mr-2" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-2 block">Project Name</label>
                  <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 px-2 block">Category</label>
                   <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-bold appearance-none cursor-pointer" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category, subcategory: '' as SubCategory})}>
                     <option value="">Select Category</option>
                     {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 px-2 block">Subcategory</label>
                   <select required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-bold appearance-none disabled:opacity-50" value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value as SubCategory})} disabled={!formData.category}>
                     <option value="">Select Sub-Type</option>
                     {formData.category && CATEGORIES[formData.category as Category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-2 block">External Link (Opt)</label>
                  <input type="url" placeholder="https://" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] outline-none font-bold" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-2 block">Description</label>
                <textarea required rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-2 block">Visual Asset</label>
                <div className="relative group">
                  <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`w-full py-8 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${formData.imageUrl ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
                    {formData.imageUrl ? <img src={formData.imageUrl} className="h-32 rounded-lg mb-2 shadow-lg" alt="Preview" /> : <Upload className="w-8 h-8 mb-2 text-slate-300" />}
                    <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest">{formData.imageUrl ? 'Change Image' : 'Click to Upload (Max 2MB)'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-[1.5rem] hover:bg-slate-200 transition-all uppercase text-[10px]">Cancel</button>
                <button type="submit" className="flex-[2] bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-indigo-600 transition-all shadow-lg uppercase text-[10px] active:scale-95">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatsView = ({ projects, orders }: { projects: Project[], orders: Order[] }) => {
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Dashboard</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Hello, Tahlil. Here is your agency overview.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Briefcase className="w-8 h-8" />} label="Master Work" value={projects.length.toString()} color="indigo" />
        <StatCard icon={<FileText className="w-8 h-8" />} label="Inquiries" value={orders.length.toString()} color="blue" />
        <StatCard icon={<Clock className="w-8 h-8" />} label="Pending" value={pendingOrders.toString()} color="amber" />
        <StatCard icon={<CheckCircle2 className="w-8 h-8" />} label="Completed" value={completedOrders.toString()} color="emerald" />
      </div>
      
      <div className="bg-white p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Recent Inquiries</h3>
          <Link to="/admin/orders" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-6 py-2 rounded-xl">View All</Link>
        </div>
        <div className="space-y-6">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all shadow-sm">
              <div className="flex items-center">
                 <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-xl text-indigo-600 mr-5">
                   {order.clientName[0]}
                 </div>
                 <div>
                   <p className="font-black text-slate-900 text-lg tracking-tighter">{order.clientName}</p>
                   <p className="text-[9px] text-slate-400 font-black uppercase mt-1">{order.projectType}</p>
                 </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                order.status === 'In Progress' ? 'bg-indigo-600 text-white' : 
                'bg-emerald-100 text-emerald-700'
              }`}>
                {order.status}
              </span>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
};

const ManageOrders = ({ orders, setOrders }: { orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>> }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('designhub_orders', JSON.stringify(updated));
    if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
  };

  const deleteOrder = (id: string) => {
    if (window.confirm('Terminate client inquiry?')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('designhub_orders', JSON.stringify(updated));
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Orders</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Coordinate client intake and maintenance cycles.</p>
      </header>
      
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 text-lg tracking-tighter">{order.clientName}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase mt-1">{order.email}</div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-base text-slate-900 font-black tracking-tight">{order.projectType.split(' - ')[0]}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`inline-block px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                      order.status === 'In Progress' ? 'bg-indigo-600 text-white' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="px-6 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-slate-950 hover:text-white transition-all">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-10 sm:p-16 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-10 right-10 p-4 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full transition-all"><X className="w-6 h-6" /></button>
            
            <div className="text-center mb-10">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">{selectedOrder.clientName}</h3>
              <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.4em]">{selectedOrder.projectType}</p>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Email</label>
                  <p className="font-black text-slate-900 break-all">{selectedOrder.email}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">WhatsApp</label>
                  <p className="font-black text-emerald-600">{selectedOrder.whatsapp}</p>
                </div>
              </div>

              <div className="p-10 bg-slate-50 rounded-[2.5rem] border-l-8 border-indigo-600 text-slate-700 text-xl font-bold whitespace-pre-wrap">
                {selectedOrder.details}
              </div>

              {selectedOrder.fileUrl && (
                <div className="p-8 bg-slate-950 rounded-3xl flex items-center justify-between shadow-2xl">
                  <div className="flex items-center">
                    <Upload className="text-white w-6 h-6 mr-4" />
                    <div>
                      <p className="text-lg font-black text-white uppercase tracking-widest">Asset</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Inbound File</p>
                    </div>
                  </div>
                  <a href={selectedOrder.fileUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-950 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95">View File</a>
                </div>
              )}

              <div className="pt-8 border-t border-slate-100 space-y-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  {['Pending', 'In Progress', 'Completed'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => updateStatus(selectedOrder.id, status as Order['status'])}
                      className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedOrder.status === status ? 'bg-slate-950 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => deleteOrder(selectedOrder.id)} className="flex-1 p-6 bg-red-50 text-red-600 rounded-3xl hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">Delete Inquiry</button>
                  <button onClick={() => setSelectedOrder(null)} className="flex-1 p-6 bg-slate-950 text-white rounded-3xl hover:bg-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl transform hover:-translate-y-1 transition-all group relative overflow-hidden">
    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 bg-${color}-50 shadow-sm transition-all group-hover:bg-${color}-600 group-hover:text-white relative z-10`}>
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
      <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
