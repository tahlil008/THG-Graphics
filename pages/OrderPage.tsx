
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Upload, MessageCircle, Mail, User, Info, AlertCircle, ArrowLeft } from 'lucide-react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Order, Category, SubCategory, CATEGORIES } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

interface OrderPageProps {
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  orders: Order[];
}

const supabase = (SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

const OrderPage: React.FC<OrderPageProps> = ({ setOrders, orders }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    phone: '',
    category: '' as Category | '',
    subcategory: '' as SubCategory | '',
    details: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      phone: formData.phone,
      projectType: `${formData.category} - ${formData.subcategory}`,
      details: formData.details,
      status: 'Pending',
      createdAt: Date.now(),
    };

    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .insert([{
          id: newOrder.id,
          client_name: newOrder.clientName,
          email: newOrder.email,
          whatsapp: newOrder.whatsapp,
          phone: newOrder.phone,
          project_type: newOrder.projectType,
          details: newOrder.details,
          status: newOrder.status,
          created_at: newOrder.createdAt
        }]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Sync error. Saving locally instead.");
      }
    }

    // Always fallback/update local state for immediate feedback
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('designhub_orders', JSON.stringify(updatedOrders));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-10 animate-in zoom-in duration-500">
          <div className="w-28 h-28 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-600 shadow-xl shadow-emerald-100 rotate-12">
            <CheckCircle className="w-16 h-16 -rotate-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Confirmed!</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Fantastic choice! One of our representatives will contact you on WhatsApp shortly.
            </p>
          </div>
          <div className="pt-10 space-y-4">
            <button onClick={() => setIsSubmitted(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl active:scale-95">Start Another Project</button>
            <button onClick={() => navigate('/')} className="w-full text-slate-400 font-bold hover:text-indigo-600 transition-colors">Return Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <button onClick={() => navigate('/')} className="flex items-center text-slate-400 hover:text-indigo-600 font-bold transition-all group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 mr-3 group-hover:scale-105"><ArrowLeft className="w-5 h-5" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Back</span>
          </button>
        </div>

        <div className="mb-16 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Launch Your <span className="text-indigo-600">Vision</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Ready for elite visual results? Provide your project details below.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-white flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mr-6"><ShoppingBag className="w-8 h-8 text-white" /></div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">Project Briefing</h3>
                <p className="text-indigo-100 text-sm font-medium opacity-80">Instant cloud confirmation</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 lg:p-16 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Client Identity</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="text" placeholder="Full Name" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mail Contact</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="email" placeholder="Email Address" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp Primary</label>
                <div className="relative">
                  <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="tel" placeholder="+880..." className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Link (Opt)</label>
                <input type="tel" placeholder="Alt Number" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-semibold" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Industry</label>
                <select required className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-semibold appearance-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category, subcategory: '' as SubCategory})}>
                  <option value="">Select Category</option>
                  {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Asset Type</label>
                <select required disabled={!formData.category} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-semibold appearance-none disabled:opacity-40" value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value as SubCategory})}>
                  <option value="">Select Subcategory</option>
                  {formData.category && CATEGORIES[formData.category as Category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center"><Info className="w-3 h-3 mr-2" /> Requirements</label>
              <textarea required rows={5} placeholder="Describe your project goals..." className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none transition-all font-semibold resize-none" value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl flex items-center justify-center disabled:opacity-60 text-xl active:scale-[0.98]">
              {isLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : 'Confirm Project Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
