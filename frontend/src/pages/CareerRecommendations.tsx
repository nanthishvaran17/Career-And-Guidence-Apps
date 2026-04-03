import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Star,
  TrendingUp,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Filter,
  Loader2,
  UserCog,
  GraduationCap,
  ShieldAlert,
  Lightbulb,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface Career {
  id: number;
  title: string;
  category: string;
  description: string;
  salary_range: string;
  job_growth: string;
  required_skills: string[];
  roadmap: string[];
  top_companies: string[];
  matchPercentage: number;
  matchReasons: string[];
  min_education?: string;
  required_stream?: string[];
}

// ── Derives risk level & advice from career data ─────────────────────────────────
function getRiskInfo(career: Career): {
  level: 'Low' | 'Medium' | 'High';
  color: string;
  bg: string;
  border: string;
  automationRisk: string;
  futureDemand: string;
  ifDeclines: string;
  practice: string[];
} {
  const g = career.job_growth?.toLowerCase() || '';
  const cat = career.category?.toLowerCase() || '';
  const title = career.title?.toLowerCase() || '';

  // Derive risk level
  let level: 'Low' | 'Medium' | 'High' = 'Medium';
  if (cat === 'government' || cat === 'defense' || cat === 'teaching' || cat === 'healthcare') {
    level = 'Low';
  } else if (g.includes('very high') || g.includes('excellent') || g.includes('25%') || g.includes('30%')) {
    level = 'Low';
  } else if (g.includes('moderate') || g.includes('average') || g.includes('5%') || g.includes('6%') || g.includes('7%')) {
    level = 'Medium';
  } else if (g.includes('declining') || g.includes('slow') || g.includes('low') || g.includes('2%') || g.includes('1%')) {
    level = 'High';
  } else if (cat === 'stem') {
    level = 'Low';
  } else if (cat === 'media' || cat === 'design') {
    level = 'Medium';
  }

  // Automation risk by category
  const automationRisk: Record<string, string> = {
    government:   'Very Low — Government jobs are protected by policy. AI cannot replace public administration roles.',
    defense:      'Very Low — Defense roles require human judgment, security clearance, and physical presence.',
    teaching:     'Low — Teaching involves human connection and mentoring. AI assists but cannot fully replace educators.',
    healthcare:   'Low — Medical roles need human touch, ethics, and hands-on care. Risk is low.',
    stem:         'Medium — Routine coding tasks may be automated, but design, architecture, and problem-solving remain human.',
    business:     'Medium — Data entry and reporting may be automated, but strategy and leadership are safe.',
    legal:        'Medium — Document review may use AI, but courtroom representation and advice remain human.',
    design:       'Medium — AI can generate assets, but creative direction, branding, and UX judgment stay human.',
    media:        'High — Content generation AI is growing fast. Unique voice, journalism, and live media are still valued.',
  };
  const automationText = automationRisk[cat] || 'Medium — Like most fields, routine tasks may be automated. Focus on skills that AI cannot replicate.';

  // Future demand
  const futureDemandMap: Record<string, string> = {
    government:   '📈 Stable demand. India’s public sector is growing with Digital India, Smart Cities, and welfare expansion.',
    defense:      '📈 Strong demand. India’s defense budget is increasing; DRDO, ISRO, and armed forces regularly recruit.',
    teaching:     '📈 Growing demand. With NEP 2020 and rising enrollment, quality educators are always needed.',
    healthcare:   '🚀 Very high demand. India needs 1M+ more doctors and nurses by 2030 (WHO report).',
    stem:         '🚀 Very high demand. India’s IT sector is projected to reach $500B by 2030. AI/ML roles are booming.',
    business:     '📈 Steady demand. Management and finance roles grow with economic expansion.',
    legal:        '📈 Growing demand. Legal tech, corporate law, and startup ecosystem needs are rising.',
    design:       '📈 Good demand. UX/UI, product design, and branding are high-value skills in the startup era.',
    media:        '⚠️ Changing demand. Digital media is growing, but print/TV roles are declining. Adapt to digital.',
  };
  const futureDemand = futureDemandMap[cat] || '📈 Moderate demand with growth expected as the Indian economy expands.';

  // If career declines
  const ifDeclinesMap: Record<string, string> = {
    government:   'Upskill in policy analysis, data governance, or switch to PSU/consultancy roles.',
    defense:      'Transition to private security, defense tech companies (BEL, HAL), or DRDO research.',
    teaching:     'Move into EdTech platforms (BYJU’S, Unacademy), curriculum design, or academic publishing.',
    healthcare:   'Specialize in telemedicine, medical AI, health-tech startups, or medical research.',
    stem:         'Pivot to AI/ML, cybersecurity, or cloud roles. Keep upskilling — tech reinvents itself every 3–5 years.',
    business:     'Specialize in fintech, consulting, or data analytics to stay relevant.',
    legal:        'Move into legal technology, compliance, or IP law for emerging tech sectors.',
    design:       'Add AI-assisted design skills (Figma AI, Midjourney), move into product management or UX research.',
    media:        'Build a personal brand, move into content strategy, digital marketing, or video production.',
  };
  const ifDeclines = ifDeclinesMap[cat] || 'Build cross-functional skills, get certified in adjacent fields, and stay updated with industry trends.';

  // Practice suggestions
  const practiceMap: Record<string, string[]> = {
    government:   ['Solve 20 GK/current affairs MCQs daily', 'Practice answer writing for Mains (1 essay/day)', 'Read The Hindu + PIB daily', 'Join a test series on Testbook or Unacademy'],
    defense:      ['Build physical fitness: run 5km daily', 'Practice GK and reasoning MCQs', 'Join NCC or UPSC CDS coaching', 'Study military history and strategy'],
    teaching:     ['Practice explaining topics to peers or family', 'Create short YouTube explainer videos', 'Complete B.Ed or CTET coaching', 'Join Diksha/SWAYAM for teaching methods'],
    healthcare:   ['Solve clinical case studies daily', 'Practice anatomy diagrams', 'Follow medical journals (NEJM, Lancet India)', 'Volunteer at a local clinic or hospital'],
    stem:         ['Code 1 problem daily on LeetCode or HackerRank', 'Build a GitHub portfolio with real projects', 'Complete 1 Coursera/NPTEL course per month', 'Contribute to open-source on GitHub'],
    business:     ['Read 1 business case study per week (HBR)', 'Practice Excel / Power BI data analysis', 'Follow market news on Moneycontrol / ET', 'Join debate or MUN clubs for communication'],
    legal:        ['Read 1 Supreme Court judgment per week', 'Practice moot court arguments', 'Follow Bar & Bench and Live Law news', 'Draft sample legal notices or contracts'],
    design:       ['Create 1 design project per week in Figma or Canva', 'Study UX case studies on Dribbble / Behance', 'Take Ideo.org or Google UX Certificate', 'Get feedback from designers on Reddit r/design'],
    media:        ['Write or film 1 piece of content per week', 'Study viral content on YouTube/Instagram', 'Learn video editing (DaVinci Resolve — free)', 'Build a portfolio website with your work'],
  };
  const practice = practiceMap[cat] || ['Dedicate 1 hour daily to skill building', 'Build a portfolio of 3–5 projects', 'Find a mentor in this field', 'Join LinkedIn groups and attend webinars'];

  const colors = {
    Low:    { color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
    Medium: { color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
    High:   { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200'   },
  };

  return { level, ...colors[level], automationRisk: automationText, futureDemand, ifDeclines, practice };
}
// ─────────────────────────────────────────────────────────────────────────────


export function CareerRecommendations() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCareer, setExpandedCareer] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const profileData = localStorage.getItem('userProfile');
        // Always send a body — even if profile is missing, we send empty to get all careers
        const body = profileData || JSON.stringify({ educationLevel: '', stream: '', interests: [] });

        const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        
        // Ensure roadmap, top_companies, and required_skills are arrays 
        // Handles cases where the backend returns stringified JSON
        const processedData = data.map((c: any) => ({
          ...c,
          roadmap: typeof c.roadmap === 'string' ? JSON.parse(c.roadmap) : (c.roadmap || []),
          top_companies: typeof c.top_companies === 'string' ? JSON.parse(c.top_companies) : (c.top_companies || []),
          required_skills: typeof c.required_skills === 'string' ? JSON.parse(c.required_skills) : (c.required_skills || [])
        }));

        setRecommendations(processedData);

      } catch (err) {
        console.error(err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const filters = [
    { label: 'All Careers', value: 'all' },
    { label: 'STEM', value: 'STEM' },
    { label: 'Government', value: 'Government' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Business', value: 'Business' },
    { label: 'Design', value: 'Design' },
    { label: 'Media', value: 'Media' },
    { label: 'Legal', value: 'Legal' },
    { label: 'Defense', value: 'Defense' },
    { label: 'Teaching', value: 'Teaching' },
  ];

  const filteredCareers = filter === 'all'
    ? recommendations
    : recommendations.filter(c => c.category === filter);

  const visibleCareers = filteredCareers.slice(0, visibleCount);

  return (
    <Layout>
      <div className="space-y-6">
        {/* ── CAREER RECOMMENDATIONS HEADER BOX ── */}
        <div className="relative overflow-hidden p-6 shadow-lg text-white"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
            borderRadius: '32px'
          }}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="relative">
            {/* Top row: Title + Update button */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-extrabold mb-1">Career Recommendations</h2>
                <p className="text-white/80 text-sm">AI-powered matches based on your profile, skills, and interests</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/25 font-semibold flex-shrink-0"
                onClick={() => navigate('/profile-setup')}
              >
                <UserCog className="w-4 h-4 mr-1.5" />
                Update Profile
              </Button>
            </div>
            {/* Bottom row: AI badge */}
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <p className="font-bold text-base leading-tight">AI Analysis Complete ✨</p>
                <p className="text-white/80 text-xs mt-0.5">
                  Matched against <span className="font-bold text-white">1000+ career paths</span> across STEM, Government, Healthcare, Business, Design, Media, Legal &amp; Teaching.
                </p>
              </div>
            </div>
          </div>
        </div>




        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className={filter === f.value ? 'gradient-primary text-white' : ''}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {error && (
          <Card className="p-12 text-center text-red-500">
            <p>{error}</p>
            <Button variant="link" onClick={() => window.location.href = '/profile-setup'}>
              Go to Profile Setup
            </Button>
          </Card>
        )}

        {/* Career Cards */}
        <div className="space-y-4">
          {!loading && !error && visibleCareers.map((career) => {
            const isExpanded = expandedCareer === career.id;

            return (
              <Card key={career.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3>{career.title}</h3>
                        <Badge variant="secondary">{career.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {career.salary_range}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Growth: {career.job_growth}
                        </div>
                        {career.min_education && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            Min: {career.min_education}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: match % + risk badge */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1 text-green-600">
                        <Star className="w-5 h-5 fill-green-600" />
                        <span className="text-xl font-bold">{career.matchPercentage}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {career.matchPercentage >= 80 && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">Top Match</Badge>
                        )}
                        {(() => { const r = getRiskInfo(career); return (
                          <Badge className={`text-xs font-semibold ${r.bg} ${r.color} border ${r.border}`}>
                            {r.level === 'Low' ? '🟢' : r.level === 'Medium' ? '🟡' : '🔴'} {r.level} Risk
                          </Badge>
                        ); })()}
                      </div>
                    </div>

                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {career.required_skills && career.required_skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {career.matchReasons && career.matchReasons.length > 0 && (
                    <div className="mb-4 bg-green-50 p-3 rounded-md">
                      <p className="text-xs font-semibold text-green-800 mb-1">Why this fits you:</p>
                      <ul className="list-disc list-inside text-xs text-green-700">
                        {career.matchReasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t">
                      <p className="text-sm text-gray-700">{career.description}</p>

                      {/* Roadmap */}
                      {career.roadmap && (
                        <div>
                          <h5 className="mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Career Roadmap
                          </h5>
                          <div className="space-y-2">
                            {career.roadmap.map((step, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white flex items-center justify-center flex-shrink-0">
                                    {index + 1}
                                  </div>
                                  {index < career.roadmap.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 pt-1 pb-3">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Companies */}
                      {career.top_companies && (
                        <div>
                          <h5 className="mb-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Top Hiring Companies
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {career.top_companies.map((company, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-50">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── RISK ANALYSIS PANEL ── */}
                      {(() => {
                        const risk = getRiskInfo(career);
                        return (
                          <div className={`rounded-xl border p-4 ${risk.bg} ${risk.border}`}>
                            <h5 className={`mb-3 flex items-center gap-2 ${risk.color}`}>
                              <ShieldAlert className="w-4 h-4" />
                              Career Risk Analysis
                              <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${risk.bg} ${risk.color} border ${risk.border}`}>
                                {risk.level === 'Low' ? '🟢 Low Risk' : risk.level === 'Medium' ? '🟡 Medium Risk' : '🔴 High Risk'}
                              </span>
                            </h5>
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="font-semibold text-gray-800 flex items-center gap-1 mb-0.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Automation Risk
                                </p>
                                <p className={`${risk.color} text-xs leading-relaxed`}>{risk.automationRisk}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 flex items-center gap-1 mb-0.5">
                                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Future Demand in India
                                </p>
                                <p className="text-gray-700 text-xs leading-relaxed">{risk.futureDemand}</p>
                              </div>
                              <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                                <p className="font-semibold text-gray-800 flex items-center gap-1 mb-1">
                                  <Lightbulb className="w-3.5 h-3.5 text-yellow-500" /> If this field declines, what to do?
                                </p>
                                <p className="text-gray-700 text-xs leading-relaxed">{risk.ifDeclines}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* ── PRACTICE SUGGESTIONS PANEL ── */}
                      {(() => {
                        const risk = getRiskInfo(career);
                        return (
                          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                            <h5 className="mb-3 flex items-center gap-2 text-purple-800">
                              <CheckCircle2 className="w-4 h-4" />
                              How to Practice & Build Skills
                            </h5>
                            <ul className="space-y-2">
                              {risk.practice.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-purple-900">
                                  <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}

                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setExpandedCareer(isExpanded ? null : career.id)}
                    >
                      {isExpanded ? (
                        <>
                          Show Less <ChevronUp className="ml-2 w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View Details <ChevronDown className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                    <Button className="gradient-primary text-white">
                      Explore Path
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {!loading && !error && filteredCareers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No careers found for the selected filter.</p>
          </Card>
        )}

        {/* Load More Button */}
        {!loading && !error && visibleCount < filteredCareers.length && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setVisibleCount(prev => prev + 30)}
              className="gradient-primary text-white px-8"
            >
              Load More ({filteredCareers.length - visibleCount} remaining)
            </Button>
          </div>
        )}

        {/* Career Count Badge */}
        {!loading && !error && filteredCareers.length > 0 && (
          <p className="text-center text-sm text-gray-400 pt-2">
            Showing {Math.min(visibleCount, filteredCareers.length)} of {filteredCareers.length} careers
          </p>
        )}
      </div>
    </Layout>
  );
}
