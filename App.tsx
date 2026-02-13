
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Palette, 
  ShoppingBag, 
  Settings, 
  Menu, 
  X, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  PhoneCall, 
  Mail,
  LogOut,
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';

import { Project, Order, CATEGORIES } from './types';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import OrderPage from './pages/OrderPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('designhub_projects');
    const savedOrders = localStorage.getItem('designhub_orders');
    const savedAuth = localStorage.getItem('designhub_admin_auth');

    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to parse projects", e);
      }
    } else {
      const initialProjects: Project[] = [
        { id: '1', name: 'Elite Music Festival', category: 'Poster', subcategory: 'Event Poster', description: 'Vibrant and modern poster design for international music festivals.', imageUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800', createdAt: Date.now() },
        { id: '2', name: 'Cloud SaaS Header', category: 'Banner', subcategory: 'Website Banner', description: 'Clean, high-converting hero banner for a modern enterprise platform.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', createdAt: Date.now() },
        { id: '3', name: 'Premium Identity', category: 'Visiting Card', subcategory: 'Company Card', description: 'Minimalist luxury business card design for a high-end firm.', imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800', createdAt: Date.now() },
      ];
      setProjects(initialProjects);
      localStorage.setItem('designhub_projects', JSON.stringify(initialProjects));
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
    if (savedAuth === 'true') setIsAdminLoggedIn(true);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Logout from Administrative Control?")) {
      setIsAdminLoggedIn(false);
      localStorage.removeItem('designhub_admin_auth');
      navigate('/');
    }
  };

  const showNavbar = !location.pathname.startsWith('/admin') || location.pathname === '/admin/login';

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white">
      {showNavbar && (
        <nav className="sticky top-0 z-[100] glass-effect border-b border-slate-200/50 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 md:h-20 items-center">
              <Link to="/" className="flex items-center group">
                <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
                  <Palette className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
                  DesignHub<span className="text-indigo-600">Pro</span>
                </span>
              </Link>

              <div className="hidden md:flex space-x-8 items-center">
                <Link to="/" className={`text-sm font-bold transition-all hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500'}`}>Home</Link>
                <Link to="/portfolio" className={`text-sm font-bold transition-all hover:text-indigo-600 ${location.pathname === '/portfolio' ? 'text-indigo-600' : 'text-slate-500'}`}>Portfolio</Link>
                <Link to="/order" className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-indigo-600 transition-all font-bold flex items-center shadow-xl shadow-slate-200 text-sm hover:-translate-y-0.5">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Order
                </Link>
                {isAdminLoggedIn ? (
                  <div className="flex items-center space-x-4 border-l border-slate-200 pl-8 ml-4">
                    <Link to="/admin" className="text-indigo-600 hover:text-indigo-700 flex items-center font-bold text-sm">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
                    </Link>
                    <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/admin/login" className="text-slate-300 hover:text-indigo-600 transition-all p-2 rounded-xl hover:bg-slate-50">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}
              </div>

              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2.5 bg-slate-50 border border-slate-100 rounded-xl transition-all active:scale-90">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-300 border-t border-slate-100 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
            <div className="p-6 flex flex-col space-y-4">
              <Link to="/" className="text-lg font-bold text-slate-800 flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50">Home <ChevronRight className="w-5 h-5 text-slate-300" /></Link>
              <Link to="/portfolio" className="text-lg font-bold text-slate-800 flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50">Portfolio <ChevronRight className="w-5 h-5 text-slate-300" /></Link>
              <Link to="/order" className="bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center shadow-xl shadow-indigo-100 text-lg"><ShoppingBag className="w-5 h-5 mr-3" /> Place Order</Link>
              {isAdminLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link to="/admin" className="text-indigo-600 font-bold flex items-center justify-center py-4 bg-indigo-50 rounded-2xl"><LayoutDashboard className="w-5 h-5 mr-2" /> Admin Panel</Link>
                  <button onClick={handleLogout} className="text-red-500 font-bold flex items-center justify-center py-4 bg-red-50 rounded-2xl w-full">
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/admin/login" className="text-slate-400 font-bold flex items-center justify-center py-4 border border-slate-100 rounded-2xl">Admin Access</Link>
              )}
            </div>
          </div>
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

      {showNavbar && (
        <footer className="bg-slate-950 text-slate-400 pt-16 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-6">
                <Palette className="text-indigo-600 w-8 h-8 mr-3" />
                <span className="text-2xl font-black text-white tracking-tighter">DesignHub</span>
              </div>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium text-sm">Professional design studio delivering elite visual results for modern brands.</p>
              <div className="flex space-x-4">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="p-3 bg-slate-900 rounded-xl hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"><Icon className="w-5 h-5" /></a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8">Creative Port</h3>
              <ul className="space-y-3 font-bold text-sm">
                {Object.keys(CATEGORIES).slice(0, 4).map(cat => <li key={cat}><Link to="/portfolio" className="hover:text-indigo-400 transition-colors">{cat}</Link></li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8">Studio Link</h3>
              <ul className="space-y-3 font-bold text-sm">
                <li><Link to="/order" className="hover:text-indigo-400 transition-colors">Project Start</Link></li>
                <li><Link to="/portfolio" className="hover:text-indigo-400 transition-colors">Case Studies</Link></li>
                <li><Link to="/admin/login" className="hover:text-indigo-400 transition-colors">Admin Gateway</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8">Inquiry</h3>
              <p className="text-xs mb-6 font-medium leading-relaxed">Direct support available on WhatsApp and Email for all premium projects.</p>
              <Link to="/order" className="bg-indigo-600 text-white font-black py-3.5 px-6 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40 block text-center">Contact Now</Link>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-700 gap-6">
            <p>© {new Date().getFullYear()} DESIGNHUB PRO.</p>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-slate-400">Security</a>
              <a href="#" className="hover:text-slate-400">Privacy</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
