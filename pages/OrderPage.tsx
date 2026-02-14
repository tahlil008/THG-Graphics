
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, User, Mail, MessageCircle, Info, ArrowLeft } from 'lucide-react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Order, Category, SubCategory, CATEGORIES } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

const isSupabaseConfigured = SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL';
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

interface OrderPageProps {
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  orders: Order[];
}

const OrderPage: React.FC<OrderPageProps> = ({ setOrders, orders }) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', phone: '',
    category: '' as Category | '', subcategory: '' as SubCategory | '', details: ''
  });

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
      createdAt: Date.now()
    };

    // 1. Try Cloud Save
    if (supabase) {
      const { error } = await supabase.from('orders').insert([{
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
      
      if (error) console.error("Cloud Error:", error);
    }

    // 2. Always update local state for immediate feedback
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('designhub_orders', JSON.stringify(updated));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-600 shadow-xl shadow-emerald-50">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Inquiry Sent!</h1>
          <p className="text-slate-500 font-medium text-lg">We have received your request. Check your WhatsApp for a message from our team.</p>
          <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-2xl">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center text-slate-400 font-bold mb-10 hover:text-indigo-600 transition-all">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-indigo-600 p-10 text-white">
            <h2 className="text-3xl font-black tracking-tight">Order Design</h2>
            <p className="opacity-80 font-medium">Start your premium visual journey today.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <input required placeholder="Full Name" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Address" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required placeholder="WhatsApp Number" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
              <select required className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any, subcategory: ''})}>
                <option value="">Category</option>
                {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea required rows={4} placeholder="Project Details & Requirements..." className="w-full p-6 bg-slate-50 rounded-[2rem] outline-none font-bold resize-none" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
            <button disabled={isLoading} type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-xl text-lg flex items-center justify-center hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50">
              {isLoading ? 'Processing...' : 'Confirm Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
