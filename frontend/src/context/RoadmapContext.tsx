import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CareerPath {
  title: string;
  matchScore: number;
  salaryRange: string;
  growthScope: string;
  competitionLevel: string;
  description: string;
}

export interface ImmediateAction {
  month: string;
  tasks: string[];
}

export interface SkillToLearn {
  skill: string;
  priority: string;
  resources: string[];
}

export interface ExamAndCert {
  name: string;
  relevance: string;
  nextDate: string;
  prepTime: string;
}

export interface RoadmapData {
  profileSummary: string;
  careerPaths: CareerPath[];
  immediateActions: ImmediateAction[];
  skillsToLearn: SkillToLearn[];
  examsAndCerts: ExamAndCert[];
  motivationalNote: string;
}

interface RoadmapContextType {
  roadmap: RoadmapData | null;
  setRoadmap: (data: RoadmapData | null) => void;
  clearRoadmap: () => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [roadmap, setRoadmapState] = useState<RoadmapData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('trustpath_roadmap');
    if (saved) {
      try {
        setRoadmapState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved roadmap");
      }
    }
  }, []);

  const setRoadmap = (data: RoadmapData | null) => {
    setRoadmapState(data);
    if (data) {
      localStorage.setItem('trustpath_roadmap', JSON.stringify(data));
    } else {
      localStorage.removeItem('trustpath_roadmap');
    }
  };

  const clearRoadmap = () => {
    setRoadmapState(null);
    localStorage.removeItem('trustpath_roadmap');
    localStorage.removeItem('trustpath_roadmap_tasks');
  };

  return (
    <RoadmapContext.Provider value={{ roadmap, setRoadmap, clearRoadmap }}>
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
}
