import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Layers, Users, Zap, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface HomePageProps {
  projects: Project[];
}

const HomePage: React.FC<HomePageProps> = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 blur-[100px] opacity-20 pointer-events-none">
          <div className="w-[600px] h-[600px] bg-indigo-500 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-8 shadow-sm">
                <Star className="w-3.5 h-3.5 mr-2 fill-indigo-600" /> Rated 5 Stars by 500+ Clients
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                Premium Visual <br />
                <span className="text-indigo-600">Mastery.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                We craft elite graphics that define industry standards. From modern posters to global identities, we transform visions into results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/portfolio')}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center transform active:scale-95"
                >
                  View Work <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate('/order')}
                  className="px-10 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center transform active:scale-95"
                >
                  Place Order
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative px-2 sm:px-0">
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-4 lg:gap-6">
                  <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] shadow-2xl shadow-indigo-100/50 transform hover:-rotate-2 transition-transform duration-500 object-cover w-full h-[200px] sm:h-[300px]" alt="Design" />
                  <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] shadow-2xl shadow-indigo-100/50 transform hover:rotate-2 transition-transform duration-500 object-cover w-full h-[150px] sm:h-[220px]" alt="Design" />
                </div>
                <div className="space-y-4 lg:gap-6 pt-16">
                  <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] shadow-2xl shadow-indigo-100/50 transform hover:rotate-2 transition-transform duration-500 object-cover w-full h-[150px] sm:h-[220px]" alt="Design" />
                  <img src="https://images.unsplash.com/photo-1572044162444-ad60f128bde3?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] shadow-2xl shadow-indigo-100/50 transform hover:-rotate-2 transition-transform duration-500 object-cover w-full h-[200px] sm:h-[300px]" alt="Design" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-black mb-6 tracking-tight">The DesignHub Standard</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">Precision, speed, and strategic thinking in every project.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Layers, title: "Elite Quality", desc: "Pixel-perfect mastery in every stroke." },
              { icon: Zap, title: "Rapid Delivery", desc: "Turnaround within 48 business hours." },
              { icon: Users, title: "Direct Contact", desc: "WhatsApp support for all project phases." },
              { icon: CheckCircle, title: "Client Approval", desc: "Refined until your vision is flawless." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                  <item.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-[3rem] p-10 lg:p-20 text-center relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-purple-900/30 opacity-60"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">Ready to Elevate <br /><span className="text-indigo-500">Your Brand Presence?</span></h2>
              <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto font-medium">Join our roster of elite global brands. Start your project now.</p>
              <button 
                onClick={() => navigate('/order')}
                className="px-12 py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-xl hover:bg-indigo-50 transition-all flex items-center justify-center mx-auto shadow-xl active:scale-95 group-hover:scale-105"
              >
                Start Inquiry <ArrowUpRight className="ml-2 w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;