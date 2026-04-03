import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShieldCheck, Briefcase, Award, BrainCircuit, GraduationCap, Building2, TrendingUp, Calendar, ChevronRight, AlertTriangle, ShieldAlert, LineChart, FileText, ArrowRight } from 'lucide-react';
import { Progress } from '../components/ui/progress';

export function AdvisoryDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('advisory_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        navigate('/college-expectations');
      }
    } else {
      navigate('/college-expectations');
    }
  }, [navigate]);

  if (!data) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">College & Career Advisory</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Your personalized AI analysis based on profile & expectations.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/resume-builder')} variant="outline" className="border-indigo-500 text-indigo-600">
              <FileText className="w-4 h-4 mr-2" /> AI Resume Builder
            </Button>
            <Button onClick={() => navigate('/career-simulation')} className="bg-purple-600 hover:bg-purple-700 text-white">
              <LineChart className="w-4 h-4 mr-2" /> Career Simulator
            </Button>
          </div>
        </div>

        {/* PROFILE ANALYSIS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="glass-panel p-6 shadow-lg border-l-4 border-l-indigo-500">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-indigo-600"><BrainCircuit /> Profile Summary</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.analysis?.summary}</p>
            <div className="mt-4 flex gap-4">
              <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <h3 className="font-bold text-green-700 dark:text-green-400 mb-2 text-sm uppercase">Strengths</h3>
                <ul className="list-disc pl-4 text-sm text-green-600 dark:text-green-300 space-y-1">
                  {data.analysis?.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-2 text-sm uppercase">Areas to Improve</h3>
                <ul className="list-disc pl-4 text-sm text-orange-600 dark:text-orange-300 space-y-1">
                  {data.analysis?.weakAreas?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </Card>

          {/* CAREERS with Salary & Probability */}
          <Card className="glass-panel-dark p-6 shadow-lg">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-purple-500"><Briefcase /> Recommended Careers</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {data.recommendedCareers?.map((career: any, i: number) => (
                <div key={i} className="bg-white/5 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 leading-tight">{career.role}</h3>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Success Probability</span>
                      <span className={career.successProbability > 75 ? 'text-green-500' : 'text-yellow-500'}>{career.successProbability}%</span>
                    </div>
                    <Progress value={career.successProbability} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{career.matchReason}</p>
                  
                  {career.salaryPrediction && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs border border-gray-100 dark:border-gray-800">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b pb-1 mb-2 shrink-0">Salary Timeline</h4>
                      <div className="flex justify-between text-center gap-2">
                        <div>
                          <p className="text-gray-500 mb-0.5">Entry</p>
                          <p className="font-semibold text-emerald-600">{career.salaryPrediction.entryLevel}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 mt-3 text-gray-300" />
                        <div>
                          <p className="text-gray-500 mb-0.5">3 Yrs</p>
                          <p className="font-semibold text-emerald-600">{career.salaryPrediction.after3Years}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 mt-3 text-gray-300" />
                        <div>
                          <p className="text-gray-500 mb-0.5">5 Yrs</p>
                          <p className="font-semibold text-emerald-600">{career.salaryPrediction.after5Years}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RECOMMENDED COLLEGES WITH TRUST SCORE & SCAM DETECTION */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600"><Building2 className="w-7 h-7" /> Target Colleges Matched to Expectations</h2>
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {data.recommendedColleges?.map((college: any, i: number) => (
            <Card key={i} className={`glass-panel hover:-translate-y-2 transition-transform duration-300 shadow-xl overflow-hidden flex flex-col relative text-gray-800 dark:text-gray-100 ${college.scamWarning?.isRisky ? 'border-2 border-red-500' : ''}`}>
              {college.scamWarning?.isRisky && (
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 text-center flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> SCAM WARNING DETECTED
                </div>
              )}
              
              <div className={`absolute ${college.scamWarning?.isRisky ? 'top-8' : 'top-0'} right-0 bg-blue-600 text-white font-black text-xl px-4 py-3 rounded-bl-3xl shadow-lg flex flex-col items-center justify-center leading-none z-10`}>
                <ShieldCheck className="w-4 h-4 mb-1 text-blue-200" />
                {college.trustScore}
                <span className="text-[10px] uppercase tracking-widest text-blue-200 mt-1">Trust Score</span>
              </div>
              <div className="p-6 pt-8">
                <h3 className="font-bold text-2xl pr-16 mb-1">{college.name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">{college.location} • Rank: {college.ranking}</p>
                
                {college.scamWarning?.isRisky && (
                  <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-lg mb-4 text-sm border-l-4 border-red-500 text-red-800 dark:text-red-300">
                    <p className="font-bold mb-1 border-b border-red-200 dark:border-red-800 pb-1">Warning Reason:</p>
                    <p className="mb-2 italic">{college.scamWarning.warningReason}</p>
                    <p className="font-bold text-xs uppercase">Safer Alternative:</p>
                    <p className="font-semibold text-green-700 dark:text-green-400">{college.scamWarning.saferAlternative}</p>
                  </div>
                )}

                <div className="space-y-2 text-sm mb-6">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">Courses:</span> {college.courses?.join(', ')}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Placement:</span> <span className="text-green-600 font-bold">{college.placementPercentage}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <Briefcase className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span><span className="font-medium">Recruiters:</span> {college.topHiringCompanies?.join(', ')}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* SKILL GAP ANALYZER */}
        {data.skillGapAnalysis && (
          <Card className="mb-10 p-6 shadow-md border-t-4 border-yellow-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/20 rounded-full blur-3xl -z-10 -mr-16 -mt-16"></div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-600"><AlertTriangle className="w-6 h-6" /> Skill Gap Analyzer</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{data.skillGapAnalysis.recommendedLearningPath}</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm uppercase mb-3">Current Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skillGapAnalysis.currentSkills?.map((s: string, i: number) => <span key={i} className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs font-semibold">{s}</span>)}
                </div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <h3 className="font-bold text-indigo-500 dark:text-indigo-400 text-sm uppercase mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skillGapAnalysis.requiredSkills?.map((s: string, i: number) => <span key={i} className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100 px-2 py-1 rounded text-xs font-semibold">{s}</span>)}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                <h3 className="font-bold text-red-500 dark:text-red-400 text-sm uppercase mb-3">Critical Gaps to Bridge</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skillGapAnalysis.criticalSkillGaps?.map((s: string, i: number) => <span key={i} className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100 px-2 py-1 rounded text-xs font-semibold">{s}</span>)}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* SKILLS, CERTIFICATIONS & INTERNSHIPS Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Skills */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white border-b pb-2">Skills to Learn</h3>
            <div className="flex flex-wrap gap-2">
              {data.skillRecommendations?.map((skill: string, i: number) => (
                <span key={i} className="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium">{skill}</span>
              ))}
            </div>
          </Card>

          {/* Certifications */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white border-b pb-2">Top Certifications</h3>
            <ul className="space-y-3">
              {data.certifications?.map((c: any, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-blue-500">{c.platform}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Internships */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white border-b pb-2">Internship Targets</h3>
            <ul className="space-y-3">
              {data.internshipRecommendations?.map((int: any, i: number) => (
                <li key={i} className="text-sm">
                  <span className="font-bold text-gray-800 dark:text-gray-200 block">{int.title}</span>
                  <span className="text-gray-500 block text-xs mt-0.5">{int.description}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* ROADMAP TIMELINE */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-600"><Calendar className="w-6 h-6" /> 4-Year Execution Roadmap</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-20">
          {data.careerRoadmap?.map((year: any, i: number) => (
            <Card key={i} className="p-5 border-t-4 border-t-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20">
              <h3 className="font-black text-xl text-indigo-600 dark:text-indigo-400 mb-1">{year.year}</h3>
              <p className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-4">{year.focus}</p>
              <ul className="space-y-2">
                {year.tasks?.map((task: string, ti: number) => (
                  <li key={ti} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-1">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" /> <span>{task}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="text-center pb-10">
          <Button onClick={() => navigate('/college-expectations')} size="lg" className="px-10 text-lg">Re-Analyze</Button>
        </div>
      </div>
    </Layout>
  );
}
