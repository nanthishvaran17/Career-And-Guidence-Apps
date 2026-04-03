import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useRoadmap } from '../context/RoadmapContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { User, Share2, RotateCcw, Award, Briefcase, Calendar, Clock, BookOpen, Star, Target } from 'lucide-react';
import { toast } from 'sonner';

export function Roadmap() {
  const { roadmap, clearRoadmap } = useRoadmap();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!roadmap) {
      navigate('/profile-setup');
      return;
    }
    const savedTasks = localStorage.getItem('trustpath_roadmap_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [roadmap, navigate]);

  if (!roadmap) return null;

  const toggleTask = (taskId: string) => {
    const newTasks = { ...tasks, [taskId]: !tasks[taskId] };
    setTasks(newTasks);
    localStorage.setItem('trustpath_roadmap_tasks', JSON.stringify(newTasks));
  };

  const handleStartOver = () => {
    clearRoadmap();
    navigate('/profile-setup');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const userName = localStorage.getItem('userName') || 'Student';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
        
        {/* HEADER Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-boldshadow-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">Your Career Roadmap</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{userName}'s personalized TrustPath</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/profile-setup')} className="border-blue-500 text-blue-600">
              <RotateCcw className="w-4 h-4 mr-2" /> Regenerate
            </Button>
          </div>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 mb-12 shadow-xl border-t-4 border-blue-500">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
            <User className="w-5 h-5" /> Profile Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {roadmap.profileSummary}
          </p>
        </Card>

        {/* SECTION 1 - Career Paths */}
        <section className="mb-14 animate-in fade-in slide-in-from-bottom-5">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-500" /> Career Matches
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {roadmap.careerPaths.map((path, idx) => (
              <Card key={idx} className={`p-6 flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 ${idx === 0 ? 'ring-2 ring-purple-500 shadow-xl shadow-purple-500/20' : 'shadow-md border border-gray-200 dark:border-gray-800'}`}>
                {idx === 0 && <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Top Match</div>}
                <div className="flex justify-between items-start mb-4 mt-2">
                  <h3 className="font-bold text-xl leading-tight">{path.title}</h3>
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-4 border-gray-100 dark:border-gray-800 shadow-inner relative">
                    <span className={`text-sm font-bold z-10 ${path.matchScore >= 80 ? 'text-green-500' : path.matchScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{path.matchScore}%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md">₹ {path.salaryRange}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md flex items-center"><Target className="w-3 h-3 mr-1"/> {path.growthScope}</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md">Competition: {path.competitionLevel}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                  {path.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 2 - Action Timeline */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" /> Action Timeline
          </h2>
          <div className="flex overflow-x-auto pb-4 gap-6 snap-x">
            {roadmap.immediateActions.map((action, idx) => (
              <Card key={idx} className="min-w-[300px] max-w-[320px] snap-center p-5 shrink-0 hover:-translate-y-1 transition-transform border-l-4 border-l-blue-500 bg-white dark:bg-gray-800 shadow-md">
                <h3 className="font-bold text-lg mb-4 text-blue-600 dark:text-blue-400">{action.month}</h3>
                <div className="space-y-3">
                  {action.tasks.map((task, tIdx) => {
                    const taskId = `task-${idx}-${tIdx}`;
                    return (
                      <div key={tIdx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <Checkbox id={taskId} checked={!!tasks[taskId]} onCheckedChange={() => toggleTask(taskId)} className="mt-1" />
                        <label htmlFor={taskId} className={`text-sm cursor-pointer select-none leading-tight ${tasks[taskId] ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {task}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-10 mb-14">
          {/* SECTION 3 - Skills to Build */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" /> Skills to Build
            </h2>
            <div className="grid gap-4">
              {roadmap.skillsToLearn.map((st, idx) => (
                <Card key={idx} className="p-4 border hover:border-yellow-500/50 shadow-sm transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{st.skill}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      st.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' : 
                      st.priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {st.priority} Priority
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-1"/> Resources:
                  </div>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 ml-5">
                    {st.resources.map((res, rIdx) => (
                      <li key={rIdx} className="list-disc"><a href={`https://www.google.com/search?q=${encodeURIComponent(res)}`} target="_blank" rel="noreferrer" className="hover:underline">{res}</a></li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* SECTION 4 - Exams & Certs */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-emerald-500" /> Exams & Certifications
            </h2>
            <div className="grid gap-4">
              {roadmap.examsAndCerts.map((exam, idx) => (
                <Card key={idx} className="p-4 border-l-4 border-l-emerald-500 overflow-hidden shadow-sm hover:shadow-md">
                  <h3 className="font-bold text-lg mb-2">{exam.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{exam.relevance}</p>
                  <div className="flex gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-600"/> {exam.nextDate}
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md">
                      <Clock className="w-4 h-4 mr-2 text-blue-600"/> {exam.prepTime}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="mb-14">
          <blockquote className="p-6 md:p-8 text-center text-lg md:text-xl font-medium italic text-gray-800 dark:text-gray-200 border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 rounded-r-2xl">
            "{roadmap.motivationalNote}"
          </blockquote>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-10">
          <Button onClick={handleStartOver} variant="outline" className="w-full sm:w-auto px-8">
             Start Over
          </Button>
          <Button onClick={handleShare} className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            <Share2 className="w-4 h-4 mr-2" /> Share Roadmap
          </Button>
        </div>
      </div>
    </Layout>
  );
}
