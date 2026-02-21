import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, GraduationCap, Briefcase, Bot, TrendingUp, Award, Star, Building2, Laptop } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { stats } from '../data/mockData';

export function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Compass,
      title: 'Career Recommendations',
      description: 'AI-powered career matching based on your skills, interests, and aptitude'
    },
    {
      icon: GraduationCap,
      title: 'Education Guidance',
      description: 'Find the best colleges and courses across J&K and India'
    },
    {
      icon: Award,
      title: 'Scholarships',
      description: 'Discover scholarships and financial aid opportunities'
    },
    {
      icon: Briefcase,
      title: 'Jobs & Internships',
      description: 'Access government and private sector job opportunities'
    },
    {
      icon: Bot,
      title: 'AI Chatbot',
      description: '24/7 personalized guidance for your career queries'
    },
    {
      icon: TrendingUp,
      title: 'Skill Development',
      description: 'Free skill programs and certifications to boost your career'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Karthik A.",
      location: "Chennai, Tamil Nadu",
      avatar: "KA",
      message: "This platform helped me discover my passion for software engineering. The aptitude test was a game changer. Got into NIT Trichy!"
    },
    {
      id: 2,
      name: "Anitha S.",
      location: "Coimbatore, Tamil Nadu",
      avatar: "AS",
      message: "Found the perfect scholarship that covered 100% of my college fees. I highly recommend this for every 12th grade student."
    },
    {
      id: 3,
      name: "Sundar N.",
      location: "Madurai, Tamil Nadu",
      avatar: "SN",
      message: "The AI chatbot guided me through career options I never knew existed. It felt like talking to a real counselor."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-gradient font-bold">CareerHub</span>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="gradient-primary text-white">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">Trusted by 50,000+ Students</span>
            </div>

            <h1 className="max-w-4xl mx-auto text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              One-Stop Personalized Career & Education <br />
              <span className="text-blue-600">Advisor</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Discover your ideal career path, find the best colleges, access scholarships,
              and explore job opportunities — all in one platform designed for students across India
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gradient-primary text-white w-full sm:w-auto h-12 text-lg">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-12 text-lg">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.studentsGuided}</div>
              <div className="text-gray-600">Students Guided</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.careersAvailable}</div>
              <div className="text-gray-600">Career Paths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.jobsListed}</div>
              <div className="text-gray-600">Job Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.scholarships}</div>
              <div className="text-gray-600">Scholarships</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Your Future</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources to help you make informed decisions about your career and education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600">
              Real success stories from students who found their path
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.message}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 gradient-primary opacity-95"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-10">
          <h2 className="text-3xl text-white font-bold mb-4">Ready to Shape Your Future?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have found their dream careers with CareerHub
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8 text-lg">
            <Link to="/signup">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>© 2025 CareerHub. Empowering students across India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
