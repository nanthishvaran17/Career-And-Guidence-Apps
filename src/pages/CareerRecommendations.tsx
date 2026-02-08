import { useState, useEffect } from 'react';
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
  Loader2
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
}

export function CareerRecommendations() {
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCareer, setExpandedCareer] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const profileData = localStorage.getItem('userProfile');
        if (!profileData) {
          setError('Please complete your profile first.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: profileData,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data);
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="mb-2">Career Recommendations</h2>
          <p className="text-gray-600">
            AI-powered career matches based on your profile, skills, and interests
          </p>
        </div>

        {/* Match Score Banner */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1">AI Analysis Complete</h4>
              <p className="text-sm text-gray-600">
                We've analyzed your profile against 50+ career paths to find your best matches.
              </p>
            </div>
            <Button variant="outline" className="border-blue-300">
              Update Profile
            </Button>
          </div>
        </Card>

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
          {!loading && !error && filteredCareers.map((career) => {
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {career.matchPercentage >= 80 && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Top Match</Badge>
                      )}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 mb-1">
                          <Star className="w-5 h-5 fill-green-600" />
                          <span className="text-xl font-bold">{career.matchPercentage}%</span>
                        </div>
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
      </div>
    </Layout>
  );
}
