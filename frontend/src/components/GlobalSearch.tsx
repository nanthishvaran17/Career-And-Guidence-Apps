import { useState, useEffect, useRef } from 'react';
import { Search, Briefcase, GraduationCap, Compass, Lightbulb, Building2, X, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string | number;
  title: string;
  subtitle: string;
  category: 'Career' | 'Job' | 'College' | 'School' | 'Internship' | 'Skill';
  href: string;
}

const categoryIcon = {
  Career:     { icon: Compass,       color: 'text-blue-600',   bg: 'bg-blue-50'   },
  Job:        { icon: Briefcase,     color: 'text-green-600',  bg: 'bg-green-50'  },
  College:    { icon: Building2,     color: 'text-purple-600', bg: 'bg-purple-50' },
  School:     { icon: School,        color: 'text-pink-600',   bg: 'bg-pink-50'   },
  Internship: { icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-50' },
  Skill:      { icon: Lightbulb,     color: 'text-yellow-600', bg: 'bg-yellow-50' },
};

const CAREERS = [
  'Software Engineer', 'Data Scientist', 'AI / ML Engineer', 'Web Developer',
  'Cybersecurity Analyst', 'Cloud Architect', 'Product Manager', 'UX Designer',
  'DevOps Engineer', 'Game Developer', 'Civil Engineer', 'Mechanical Engineer',
  'Doctor (MBBS)', 'CA (Chartered Accountant)', 'IAS Officer', 'IPS Officer',
  'Lawyer', 'Architect', 'Data Analyst', 'Business Analyst', 'Teacher / Professor',
  'Pharmacist', 'Nurse', 'Graphic Designer', 'Content Writer', 'Full Stack Developer',
  'Mobile App Developer', 'Embedded Systems Engineer', 'Network Engineer',
  'Robotics Engineer', 'Finance Analyst', 'HR Manager', 'Digital Marketer',
  'Video Editor', '3D Animator', 'Ethical Hacker', 'Blockchain Developer',
];

export function GlobalSearch() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const wrapperRef            = useRef<HTMLDivElement>(null);
  const navigate              = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setOpen(false); return; }
    const t = setTimeout(() => doSearch(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const doSearch = async (q: string) => {
    setLoading(true);
    const all: SearchResult[] = [];
    const enc = encodeURIComponent(q);

    try {
      const [jobsRes, collegesRes, schoolsRes, internRes, skillsRes] = await Promise.allSettled([
        fetch(`/api/jobs?q=${enc}&limit=5`).then(r => r.json()),
        fetch(`/api/colleges?search=${enc}`).then(r => r.json()),
        fetch(`/api/schools?search=${enc}`).then(r => r.json()),
        fetch(`/api/internships?search=${enc}`).then(r => r.json()),
        fetch(`/api/skills?search=${enc}`).then(r => r.json()),
      ]);

      if (jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value)) {
        jobsRes.value.slice(0, 3).forEach((j: any) => all.push({
          id: j.id, title: j.title,
          subtitle: `${j.company || ''} · ${j.location || 'India'}`,
          category: 'Job', href: '/jobs',
        }));
      }

      if (collegesRes.status === 'fulfilled') {
        const arr = Array.isArray(collegesRes.value) ? collegesRes.value : (collegesRes.value?.colleges || []);
        arr.slice(0, 3).forEach((c: any) => all.push({
          id: c.id, title: c.name || c.college_name,
          subtitle: c.location || c.state || 'College',
          category: 'College', href: '/education',
        }));
      }

      if (schoolsRes.status === 'fulfilled') {
        const arr = Array.isArray(schoolsRes.value) ? schoolsRes.value : (schoolsRes.value?.schools || []);
        arr.slice(0, 3).forEach((s: any) => all.push({
          id: s.id, title: s.name,
          subtitle: `${s.district || s.location || ''} · ${s.board || 'School'}`,
          category: 'School', href: '/education',
        }));
      }

      if (internRes.status === 'fulfilled' && Array.isArray(internRes.value)) {
        internRes.value.slice(0, 2).forEach((i: any) => all.push({
          id: i.id, title: i.title || i.role,
          subtitle: i.company || 'Internship',
          category: 'Internship', href: '/jobs',
        }));
      }

      if (skillsRes.status === 'fulfilled' && Array.isArray(skillsRes.value)) {
        skillsRes.value.slice(0, 2).forEach((s: any) => all.push({
          id: s.id, title: s.name || s.title,
          subtitle: s.category || 'Skill',
          category: 'Skill', href: '/jobs',
        }));
      }
    } catch (_) {}

    CAREERS.filter(c => c.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 4)
      .forEach(c => all.push({ id: c, title: c, subtitle: 'Career Path', category: 'Career', href: '/careers' }));

    setResults(all.slice(0, 12));
    setOpen(all.length > 0);
    setLoading(false);
  };

  const handleSelect = (r: SearchResult) => {
    setQuery(''); setOpen(false);
    navigate(r.href);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const q = query.toLowerCase();
    setOpen(false);

    // Smart keyword detection for better navigation (Added 'engg' and 'engineering')
    if (q.includes('school') || q.includes('board') || q.includes('10th') || q.includes('12th')) {
      navigate(`/education?tab=schools&search=${encodeURIComponent(query)}`);
    } else if (q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('btech') || q.includes('engg') || q.includes('engineering')) {
      navigate(`/education?tab=colleges&search=${encodeURIComponent(query)}`);
    } else if (q.includes('job') || q.includes('hiring') || q.includes('vacancy') || q.includes('apply')) {
      navigate(`/jobs?q=${encodeURIComponent(query)}`);
    } else if (q.includes('intern') || q.includes('skill') || q.includes('python') || q.includes('react')) {
      navigate(`/jobs?q=${encodeURIComponent(query)}`);
    } else if (results.length > 0) {
      handleSelect(results[0]);
    } else {
      navigate(`/jobs?q=${encodeURIComponent(query)}`);
    }
    setQuery('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <button 
          type="submit"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-20"
        >
          <Search className="w-6 h-6 text-gray-600 group-focus-within:text-blue-600 transition-colors" />
        </button>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search careers, colleges, schools, jobs, skills..."
          className="w-full pl-14 pr-12 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-base font-medium focus:outline-none focus:ring-4 focus:ring-blue-400/20 focus:bg-white focus:border-blue-400 transition-all shadow-lg hover:shadow-xl"
        />
        {query && (
          <button 
            type="button"
            onClick={() => { setQuery(''); setOpen(false); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 z-[100] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              Searching...
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-400 text-center">No results for "<b>{query}</b>"</div>
          )}
          {!loading && results.length > 0 && (
            <ul className="py-1 max-h-80 overflow-y-auto divide-y divide-gray-50">
              {results.map((r, i) => {
                const meta = categoryIcon[r.category];
                const Icon = meta.icon;
                return (
                  <li key={`${r.category}-${r.id}-${i}`}>
                    <button onClick={() => handleSelect(r)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors group">
                      <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700">{r.title}</p>
                        <p className="text-xs text-gray-400 truncate">{r.subtitle}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} shrink-0`}>
                        {r.category}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li className="px-4 py-2 bg-gray-50">
                <button onClick={() => { navigate('/education'); setOpen(false); setQuery(''); }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold w-full text-center">
                  View all results →
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
