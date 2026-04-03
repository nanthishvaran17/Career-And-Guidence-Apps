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
            <Card key={expert.id} className="group overflow-hidden border-0 shadow-xl rounded-[32px] bg-white hover:-translate-y-2 transition-all duration-500">
              
              {/* VIDEO THUMBNAIL OVERLAY */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={expert.thumbnail} 
                  alt={expert.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <a 
                    href={expert.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-125 transition-transform group/btn shadow-2xl"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1 opacity-80 group-hover/btn:opacity-100" />
                  </a>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-indigo-600/90 backdrop-blur-md text-white border-0 px-3 py-1 text-xs font-bold gap-1.5 rounded-full">
                    <Video className="w-3.5 h-3.5" /> Podcast
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                   <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                   <span className="text-xs font-bold text-gray-900">{expert.rating}</span>
                </div>
              </div>

              {/* EXPERT DETAILS */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                      {expert.name}
                      <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
                    </h3>
                    <p className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> {expert.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-bold border-0 text-[10px] uppercase px-2 py-0.5 rounded-md">
                        {expert.department}
                      </Badge>
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[10px] font-black">{expert.avgSalary}</span>
                      </div>
                   </div>

                   <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Best For</p>
                          <p className="text-sm font-bold text-gray-800 leading-tight">
                            {expert.bestFor}
                          </p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button 
                    asChild
                    variant="outline"
                    className="h-11 rounded-2xl border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold transition-all text-[11px] gap-1.5"
                  >
                    <a href={expert.salaryVideoUrl || expert.videoUrl} target="_blank" rel="noopener noreferrer">
                      Salary Guide
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button 
                    asChild
                    className="h-11 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold transition-all shadow-lg text-[11px] gap-1.5"
                  >
                    <a href={expert.videoUrl} target="_blank" rel="noopener noreferrer">
                      Watch Podcast
                      <Play className="w-3 h-3 fill-current" />
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
