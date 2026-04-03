import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Play, 
  Users, 
  Search, 
  Star, 
  Video, 
  ExternalLink,
  Award,
  BookOpen,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { EXPERTS, Expert } from '../data/expertsData';

export function Experts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDept, setActiveDept] = useState('All');

  const departments = ['All', 'Computer Science (AI/ML)', 'Engineering', 'Medicine', 'Human Resources', 'Information Technology', 'Software Engineering', 'Civil Services', 'Management (MBA)', 'Arts', 'Business'];

  const filteredExperts = EXPERTS.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expert.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.bestFor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = activeDept === 'All' || expert.department.includes(activeDept);
    return matchesSearch && matchesDept;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PREMIUM MINIMALIST HEADER */}
        <div className="relative overflow-hidden rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/60 p-12 text-center space-y-4 shadow-2xl shadow-indigo-100/50">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_50%)] pointer-events-none" />
          <div className="relative z-10">
            <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              World Class Guidance
            </Badge>
            <h1 className="text-5xl font-black bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 bg-clip-text text-transparent tracking-tighter sm:text-6xl">
              Professional Experts <span className="text-indigo-600">&</span> Podcasts
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Learn from the top 1% of industry leaders through curated professional podcasts and deep-dive roadmaps.
            </p>
          </div>
        </div>

        {/* CONTROLS: SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input
              type="text"
              placeholder="Search experts, roles, or specialties..."
              className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {departments.slice(0, 6).map(dept => (
              <Button
                key={dept}
                variant={activeDept === dept ? 'default' : 'outline'}
                onClick={() => setActiveDept(dept)}
                className={`rounded-full px-5 py-1.5 h-auto text-sm font-bold transition-all shadow-sm ${
                  activeDept === dept ? 'bg-indigo-600 text-white shadow-indigo-200' : 'hover:bg-indigo-50 hover:border-indigo-200'
                }`}
              >
                {dept}
              </Button>
            ))}
          </div>
        </div>

        {/* EXPERTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperts.map((expert: Expert) => (
            <Card key={expert.id} className="group overflow-hidden border-0 shadow-xl rounded-[32px] bg-white hover:-translate-y-2 transition-all duration-500 relative">
              
              {/* TOP HEADER ACCENT */}
              <div className="h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />

              <div className="px-6 pb-6 -mt-12 space-y-4">
                {/* PORTRAIT OVERLAY */}
                <div className="flex justify-between items-end">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                        <img 
                          src={expert.thumbnail} 
                          alt={expert.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                         <div className="bg-emerald-500 rounded-full p-1 text-white">
                           <ShieldCheck className="w-3.5 h-3.5" />
                         </div>
                      </div>
                   </div>
                   <div className="bg-amber-50 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm border border-amber-100 mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-700">{expert.rating}</span>
                   </div>
                </div>

                {/* EXPERT DETAILS */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {expert.name}
                  </h3>
                  <p className="text-indigo-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-indigo-50/50 w-fit px-2 py-0.5 rounded-md">
                    <Award className="w-3.5 h-3.5" /> {expert.role}
                  </p>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-bold border-0 text-[10px] uppercase px-2 py-0.5 rounded-md">
                        {expert.department}
                      </Badge>
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase">{expert.avgSalary}</span>
                      </div>
                   </div>

                   <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Expert Specialty</p>
                          <p className="text-sm font-bold text-gray-800 leading-tight">
                            {expert.bestFor}
                          </p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="mt-4">
                  <Button 
                    asChild
                    className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black transition-all shadow-xl hover:shadow-red-200 text-sm gap-2 border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
                  >
                    <a href={expert.videoUrl} target="_blank" rel="noopener noreferrer">
                      Watch Career Podcast
                      <Play className="w-5 h-5 fill-current" />
                    </a>
                  </Button>
                </div>
              </div>

            </Card>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No experts found matching your filters</h3>
            <Button variant="link" onClick={() => { setSearchTerm(''); setActiveDept('All'); }} className="text-indigo-600 font-bold mt-2">
              Clear all filters
            </Button>
          </div>
        )}

      </div>
    </Layout>
  );
}
