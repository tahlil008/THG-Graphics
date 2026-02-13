import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Category, SubCategory, CATEGORIES } from '../types';
import { Search, ExternalLink, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface PortfolioPageProps {
  projects: Project[];
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ projects }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (selectedProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);

  const subCategories = useMemo(() => {
    if (selectedCategory === 'All') return [];
    return CATEGORIES[selectedCategory];
  }, [selectedCategory]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSubCategory = selectedSubCategory === 'All' || p.subcategory === selectedSubCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSubCategory && matchSearch;
    });
  }, [projects, selectedCategory, selectedSubCategory, searchQuery]);

  return (
    <div className="bg-[#FDFDFF] min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
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

        <header className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-5 tracking-tighter">Elite <span className="text-indigo-600">Showcase</span></h1>
          <p className="text-slate-500 max-w-2xl font-medium text-lg">Our high-impact creative portfolio across all visual sectors.</p>
        </header>

        <div className="mb-10 flex flex-col lg:flex-row gap-6 lg:items-center justify-between sticky top-[5.5rem] z-40 py-5 glass-effect rounded-[2rem] px-6 border border-slate-100 shadow-sm">
          <div className="flex overflow-x-auto hide-scrollbar gap-3">
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedSubCategory('All'); }}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              All Assets
            </button>
            {Object.keys(CATEGORIES).map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat as Category); setSelectedSubCategory('All'); }}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-slate-100 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none font-bold text-sm text-slate-800"
            />
          </div>
        </div>

        {selectedCategory !== 'All' && subCategories.length > 0 && (
          <div className="mb-10 flex overflow-x-auto hide-scrollbar gap-2 pb-4 animate-in fade-in slide-in-from-left-4">
            <button
              onClick={() => setSelectedSubCategory('All')}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedSubCategory === 'All' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
              All {selectedCategory}
            </button>
            {subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedSubCategory === sub ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all group cursor-pointer flex flex-col"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-[5/4] overflow-hidden relative">
                  <img 
                    src={project.imageUrl} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={project.name}
                  />
                  <div className="absolute inset-0 bg-indigo-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <ExternalLink className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white rounded-xl text-[9px] font-black text-indigo-600 uppercase tracking-widest shadow-lg">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tighter leading-tight">{project.name}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <ImageIcon className="w-16 h-16 mx-auto mb-6 text-slate-200" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Projects Found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col lg:flex-row animate-in zoom-in duration-500">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-8 right-8 z-[210] p-4 bg-white/95 backdrop-blur-md rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full lg:w-[65%] h-[40vh] lg:h-auto bg-slate-50 overflow-y-auto">
              <img src={selectedProject.imageUrl} className="w-full h-auto min-h-full object-contain" alt={selectedProject.name} />
            </div>
            <div className="w-full lg:w-[35%] p-10 sm:p-16 flex flex-col justify-between bg-white overflow-y-auto">
              <div>
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">{selectedProject.category} / {selectedProject.subcategory}</span>
                <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter leading-none">{selectedProject.name}</h2>
                <div className="w-16 h-1.5 bg-indigo-600 mb-10 rounded-full"></div>
                <p className="text-slate-500 mb-12 leading-relaxed font-bold text-lg italic">"{selectedProject.description}"</p>
                
                {selectedProject.link && (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center w-full justify-center px-10 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
                  >
                    Explore Case Study <ExternalLink className="ml-3 w-5 h-5" />
                  </a>
                )}
              </div>
              <div className="pt-10 mt-10 border-t border-slate-100">
                <button 
                  onClick={() => { navigate('/order'); setSelectedProject(null); }}
                  className="w-full bg-indigo-50 text-indigo-600 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                >
                  Commission Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;