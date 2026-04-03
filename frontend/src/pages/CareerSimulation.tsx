import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, AlertTriangle, Briefcase, IndianRupee } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const MOCK_DATA = {
  "software_engineering": {
    risk: "Low",
    timeline: [
      { year: "Entry (Year 0)", salary: 450000, skills: "HTML, JS, React Base" },
      { year: "Mid (Year 3)", salary: 1200000, skills: "System Design, Cloud" },
      { year: "Senior (Year 5)", salary: 2500000, skills: "Architecture, Leadership" },
      { year: "Lead (Year 8+)", salary: 4000000, skills: "Business Strategy, Tech Pacing" }
    ]
  },
  "data_science": {
    risk: "Medium",
    timeline: [
      { year: "Entry (Year 0)", salary: 600000, skills: "Python, SQL, Stats" },
      { year: "Mid (Year 3)", salary: 1500000, skills: "Machine Learning, Big Data" },
      { year: "Senior (Year 5)", salary: 3000000, skills: "Deep Learning, MLOps" },
      { year: "Lead (Year 8+)", salary: 5000000, skills: "AI Strategy, Team Building" }
    ]
  },
  "civil_engineering": {
    risk: "High",
    timeline: [
      { year: "Entry (Year 0)", salary: 300000, skills: "AutoCAD, Site Mgmt" },
      { year: "Mid (Year 3)", salary: 600000, skills: "Project Eval, Quality Control" },
      { year: "Senior (Year 5)", salary: 1000000, skills: "Structural Design" },
      { year: "Lead (Year 8+)", salary: 1800000, skills: "Project Directing" }
    ]
  }
};

export function CareerSimulation() {
  const [selectedPath, setSelectedPath] = useState<"software_engineering" | "data_science" | "civil_engineering">("software_engineering");

  const currentData = MOCK_DATA[selectedPath];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-500" /> Career Simulation Engine
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">Visualize career progress, salary growth trajectories, and risk levels over a typical 10-year span in the Indian market.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-panel p-6 col-span-1 border-purple-500/20 max-h-[300px]">
            <h3 className="font-bold text-sm text-gray-500 uppercase mb-4">Select Career Track</h3>
            <Select value={selectedPath} onValueChange={(val: any) => setSelectedPath(val)}>
              <SelectTrigger className="w-full h-12 bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Choose a career" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software_engineering">Software Engineering</SelectItem>
                <SelectItem value="data_science">Data Science / AI</SelectItem>
                <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-8">
              <h3 className="font-bold text-sm text-gray-500 uppercase mb-2">Industry Risk Level</h3>
              <div className={`p-4 rounded-xl border flex items-center gap-3 font-bold ${
                currentData.risk === 'Low' ? 'bg-green-50 text-green-700 border-green-200' :
                currentData.risk === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}>
                {currentData.risk === 'High' && <AlertTriangle className="w-5 h-5" />}
                {currentData.risk} Risk (Volatility)
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-6 col-span-3 min-h-[400px]">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-green-600" /> Salary Trajectory Projection (INR)</h2>
             <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.timeline} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${(value / 100000)}L`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <RechartsTooltip 
                    formatter={(value: number) => [`₹${(value / 100000).toFixed(1)} LPA`, 'Estimated Salary']}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="salary" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSalary)" />
                </AreaChart>
              </ResponsiveContainer>
             </div>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase className="w-6 h-6 text-indigo-500" /> Required Skill Progression</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {currentData.timeline.map((stage, idx) => (
            <Card key={idx} className="p-5 border-t-4 border-t-indigo-500 bg-white dark:bg-gray-800 shadow-md">
              <h3 className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400 mb-2">{stage.year}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 font-medium uppercase tracking-wide">Expected Growth Milestone</p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Critical Skills Learnt:</p>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-1">{stage.skills}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </Layout>
  );
}
