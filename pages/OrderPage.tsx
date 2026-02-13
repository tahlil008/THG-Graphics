import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Upload, MessageCircle, Mail, User, Info, AlertCircle, ArrowLeft } from 'lucide-react';
import { Order, Category, SubCategory, CATEGORIES } from '../types';

interface OrderPageProps {
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  orders: Order[];
}

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
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
        fileUrl: file ? URL.createObjectURL(file) : undefined,
      };

      setOrders(prev => {
        const updated = [newOrder, ...prev];
        localStorage.setItem('designhub_orders', JSON.stringify(updated));
        return updated;
      });
      
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
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
            <button 
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
            >
              Start Another Project
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full text-slate-400 font-bold hover:text-indigo-600 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-400 hover:text-indigo-600 font-bold transition-all group"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 mr-3 group-hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back</span>
          </button>
        </div>

        <div className="mb-16 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Launch Your <span className="text-indigo-600">Vision</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Ready for elite visual results? Provide your project details below.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="flex items-center relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mr-6">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">Project Briefing</h3>
                <p className="text-indigo-100 text-sm font-medium opacity-80">Instant WhatsApp confirmation</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 lg:p-16 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Client Identity</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-semibold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mail Contact</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-semibold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp Primary</label>
                <div className="relative">
                  <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    required
                    type="tel"
                    placeholder="+880..."
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-semibold"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Link (Opt)</label>
                <input
                  type="tel"
                  placeholder="Alt Number"
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-semibold"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Industry</label>
                <select
                  required
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none transition-all font-semibold appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as Category, subcategory: '' as SubCategory})}
                >
                  <option value="">Select Category</option>
                  {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Asset Type</label>
                <select
                  required
                  disabled={!formData.category}
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none transition-all font-semibold appearance-none disabled:opacity-40"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({...formData, subcategory: e.target.value as SubCategory})}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category && CATEGORIES[formData.category as Category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center">
                <Info className="w-3 h-3 mr-2" /> Project Requirements & Description
              </label>
              <textarea
                required
                rows={5}
                placeholder="Briefly describe your goals, required text, color preferences..."
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none transition-all font-semibold resize-none"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Reference Assets (Optional)</label>
              <div className="relative group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`w-full py-12 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-100 bg-slate-50'}`}>
                  <Upload className={`w-10 h-10 mb-4 ${file ? 'text-indigo-600' : 'text-slate-300'}`} />
                  <p className="text-slate-900 font-bold">{file ? file.name : 'Upload Master PNG/JPG'}</p>
                  <p className="text-slate-400 text-xs mt-1 font-medium">Click or Drag Files Here</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl flex items-center justify-center disabled:opacity-60 text-xl active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Confirm Project Inquiry'}
              </button>
              <div className="mt-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5 mr-2" /> Guaranteed Response within 24 Hours
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;