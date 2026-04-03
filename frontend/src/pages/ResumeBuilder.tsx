import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Download, FileText, Loader2, Sparkles, PenTool } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config';
import ReactMarkdown from 'react-markdown';

export function ResumeBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [markdownResume, setMarkdownResume] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Add print styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #printable-resume, #printable-resume * { visibility: visible; }
        #printable-resume { position: absolute; left: 0; top: 0; width: 100%; color: black !important; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const storedProfile = localStorage.getItem('userProfile');
      const profile = storedProfile ? JSON.parse(storedProfile) : { name: "Student Profile Needed" };
      
      const res = await fetch(`${API_BASE_URL}/api/resume/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMarkdownResume(data.markdown);
      toast.success("ATS-Optimized Resume Generated!");
    } catch (err: any) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 no-print">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600 mb-2">AI Resume Builder</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Generate an ATS-Optimized Markdown Resume instantly based on your profile.</p>
          </div>
          <div className="flex gap-3">
            {markdownResume && (
              <>
                <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="border-indigo-500 text-indigo-600">
                  <PenTool className="w-4 h-4 mr-2" /> {isEditing ? 'Preview Mode' : 'Edit Text'}
                </Button>
                <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                  <Download className="w-4 h-4 mr-2" /> Export to PDF
                </Button>
              </>
            )}
          </div>
        </div>

        {!markdownResume && !isGenerating && (
          <Card className="glass-panel p-12 text-center shadow-xl border-dashed border-2 border-indigo-200 dark:border-indigo-900">
            <FileText className="w-16 h-16 mx-auto text-indigo-400 mb-6 opacity-80" />
            <h2 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-100">Ready to build your professional profile?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">Our AI engine will analyze your academic background and target job roles to construct a structured, keyword-rich resume that passes ATS scanners.</p>
            <Button onClick={generateResume} size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-indigo-500/25 transition-all">
              <Sparkles className="w-6 h-6 mr-2" /> Auto-Generate Resume
            </Button>
          </Card>
        )}

        {isGenerating && (
          <Card className="glass-panel p-16 text-center shadow-xl border border-indigo-100 dark:border-indigo-900">
            <Loader2 className="w-16 h-16 mx-auto text-indigo-500 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-indigo-900 dark:text-gray-100 mb-2">Crafting your professional identity...</h3>
            <p className="text-gray-500">Injecting keywords and structuring your experience.</p>
          </Card>
        )}

        {markdownResume && !isGenerating && (
          <div className="grid md:grid-cols-1 gap-6">
            <Card className="shadow-2xl border-0 overflow-hidden bg-white">
              {isEditing ? (
                <div className="h-full no-print">
                  <div className="bg-gray-100 border-b px-4 py-2 text-xs font-bold text-gray-500 uppercase flex justify-between">
                    <span>Markdown Editor</span>
                    <span className="text-indigo-500">Supports standard markdown formatting</span>
                  </div>
                  <Textarea 
                    value={markdownResume} 
                    onChange={(e) => setMarkdownResume(e.target.value)}
                    className="min-h-[800px] w-full border-0 p-8 font-mono text-sm focus-visible:ring-0 text-black dark:text-white bg-white dark:bg-gray-900 rounded-none resize-y shadow-inner"
                  />
                </div>
              ) : (
                <div id="printable-resume" className="bg-white text-black p-10 md:p-16 print:p-0 min-h-[1056px] w-full mx-auto max-w-[850px] shadow-[0_0_40px_rgba(0,0,0,0.1)] print:shadow-none prose prose-indigo prose-sm sm:prose-base prose-headings:font-bold prose-headings:text-black prose-a:text-blue-600 marker:text-black">
                  <ReactMarkdown>{markdownResume}</ReactMarkdown>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
