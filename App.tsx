
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Palette, 
  ShoppingBag, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { Project, Order, CATEGORIES } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import OrderPage from './pages/OrderPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

// Safe Supabase Initialization
const isSupabaseConfigured = SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL';
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadData = useCallback(async () => {
    // 1. Load Projects
    const savedProjects = localStorage.getItem('designhub_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const initial: Project[] = [
        { id: '1', name: 'Elite Music Festival', category: 'Poster', subcategory: 'Event Poster', description: 'Vibrant and modern poster design.', imageUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800', createdAt: Date.now() },
      ];
      setProjects(initial);
      localStorage.setItem('designhub_projects', JSON.stringify(initial));
    }

    // 2. Load Orders from Cloud
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(data.map((d: any) => ({
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
        })));
      }
    } else {
      const saved = localStorage.getItem('designhub_orders');
      if (saved) setOrders(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    loadData();
    setIsMenuOpen(false);
    window.scrollTo(0, 0);

    // Setup Real-time Subscription
    if (supabase) {
      const channel = supabase.channel('order_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          loadData();
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [location.pathname, loadData]);

  useEffect(() => {
    const auth = localStorage.getItem('designhub_admin_auth');
    if (auth === 'true') setIsAdminLoggedIn(true);
  }, []);

  const handleLogout = () => {
    if (confirm("Logout from Administrative Control?")) {
      setIsAdminLoggedIn(false);
      localStorage.removeItem('designhub_admin_auth');
      navigate('/');
    }
  };

  const isAtAdmin = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white">
      {!isAtAdmin && (
        <nav className="sticky top-0 z-[100] glass-effect border-b border-slate-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 md:h-20 items-center">
              <Link to="/" className="flex items-center group">
                <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg group-hover:rotate-12 transition-all">
                  <Palette className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
                  DesignHub<span className="text-indigo-600">Pro</span>
                </span>
              </Link>

              <div className="hidden md:flex space-x-8 items-center">
                <Link to="/" className={`text-sm font-bold ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500'}`}>Home</Link>
                <Link to="/portfolio" className={`text-sm font-bold ${location.pathname === '/portfolio' ? 'text-indigo-600' : 'text-slate-500'}`}>Portfolio</Link>
                <Link to="/order" className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-indigo-600 transition-all font-bold flex items-center shadow-xl text-sm">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Order
                </Link>
                {isAdminLoggedIn && (
                  <Link to="/admin" className="text-indigo-600 font-bold text-sm flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
                  </Link>
                )}
              </div>

              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 bg-slate-50 rounded-xl">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden p-6 bg-white border-t border-slate-100 flex flex-col space-y-4">
              <Link to="/" className="p-4 font-bold text-slate-800">Home</Link>
              <Link to="/portfolio" className="p-4 font-bold text-slate-800">Portfolio</Link>
              <Link to="/order" className="bg-indigo-600 text-white p-5 rounded-2xl font-black text-center">Place Order</Link>
            </div>
          )}
        </nav>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage projects={projects} />} />
          <Route path="/portfolio" element={<PortfolioPage projects={projects} />} />
          <Route path="/order" element={<OrderPage setOrders={setOrders} orders={orders} />} />
          <Route path="/admin/login" element={<AdminLoginPage setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
          <Route path="/admin/*" element={isAdminLoggedIn ? <AdminDashboard projects={projects} setProjects={setProjects} orders={orders} setOrders={setOrders} handleLogout={handleLogout} /> : <AdminLoginPage setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
        </Routes>
      </main>

      {!isAtAdmin && (
        <footer className="bg-slate-950 text-slate-400 py-12 text-center text-xs font-bold uppercase tracking-widest border-t border-slate-900">
          <p>© {new Date().getFullYear()} DESIGNHUB PRO. ALL RIGHTS RESERVED.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
