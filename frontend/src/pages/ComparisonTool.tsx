import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowRightLeft, Check, X, Building, MapPin, DollarSign, Award, BookOpen, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

type Category = 'colleges' | 'schools' | 'jobs';

export function ComparisonTool() {
    const [category, setCategory] = useState<Category>('colleges');
    const [items, setItems] = useState<any[]>([]);
    const [selected1, setSelected1] = useState<string>('');
    const [selected2, setSelected2] = useState<string>('');
    const [data1, setData1] = useState<any>(null);
    const [data2, setData2] = useState<any>(null);

    useEffect(() => {
        setItems([]);
        setSelected1('');
        setSelected2('');
        setData1(null);
        setData2(null);
        fetchData(category);
    }, [category]);

    const fetchData = async (cat: Category) => {
        try {
            let url = `${API_BASE_URL}/api/${cat}`;
            // Adjust generic URL if needed (e.g. jobs might be different)
            if (cat === 'jobs') url = `${API_BASE_URL}/api/jobs`;

            const res = await fetch(url);
            const data = await res.json();

            if (cat === 'schools') {
                setItems(data.schools || []); // Handle { state:..., schools: [...] } wrapper
            } else {
                setItems(data);
            }
        } catch (e) {
            toast.error(`Failed to load ${cat}`);
        }
    };

    useEffect(() => {
        if (selected1) setData1(items.find(i => i.id.toString() === selected1));
    }, [selected1, items]);

    useEffect(() => {
        if (selected2) setData2(items.find(i => i.id.toString() === selected2));
    }, [selected2, items]);

    const parseJson = (str: any, fallback: any = null) => {
        if (typeof str === 'object') return str;
        try { return JSON.parse(str); } catch { return fallback; }
    };

    const renderRow = (label: string, icon: any, val1: any, val2: any, highlightHigher = false, isCurrency = false) => {
        let cleanV1 = val1;
        let cleanV2 = val2;

        // Simple number extraction for comparison
        const num1 = parseFloat(String(val1).replace(/[^0-9.]/g, '')) || 0;
        const num2 = parseFloat(String(val2).replace(/[^0-9.]/g, '')) || 0;

        let is1Better = false;
        let is2Better = false;

        if (highlightHigher && val1 && val2) {
            is1Better = num1 > num2;
            is2Better = num2 > num1;
        }

        return (
            <div className="grid grid-cols-3 gap-4 py-4 border-b last:border-0 items-center">
                <div className="font-medium text-gray-500 flex items-center gap-2 text-sm md:text-base">
                    {icon} {label}
                </div>
                <div className={`text-center font-semibold ${is1Better ? 'text-green-600' : 'text-gray-800'}`}>
                    {val1 || '-'}
                </div>
                <div className={`text-center font-semibold ${is2Better ? 'text-green-600' : 'text-gray-800'}`}>
                    {val2 || '-'}
                </div>
            </div>
        );
    };

    const renderVerdict = () => {
        if (!data1 || !data2) return null;

        // Very basic logic for "Benefit" - in a real app this would be complex
        let winner = null;
        let reason = "";

        if (category === 'colleges') {
            const p1 = parseFloat(parseJson(data1.placement_stats)?.placement_rate) || 0;
            const p2 = parseFloat(parseJson(data2.placement_stats)?.placement_rate) || 0;
            if (p1 > p2) { winner = data1.name; reason = "Better Placement Record"; }
            else if (p2 > p1) { winner = data2.name; reason = "Better Placement Record"; }
        } else if (category === 'schools') {
            const r1 = parseFloat(parseJson(data1.board_results)?.pass_percentage_12th) || 0;
            const r2 = parseFloat(parseJson(data2.board_results)?.pass_percentage_12th) || 0;
            if (r1 > r2) { winner = data1.name; reason = "Higher Board Results"; }
            else if (r2 > r1) { winner = data2.name; reason = "Higher Board Results"; }
        } else if (category === 'jobs') {
            // Parse salary range "10-12 LPA" -> 11
            const getSal = (s: string) => {
                const parts = s?.match(/(\d+)/g);
                if (!parts) return 0;
                return (parseInt(parts[0]) + (parseInt(parts[1]) || parseInt(parts[0]))) / 2;
            };
            const s1 = getSal(data1.salary_range);
            const s2 = getSal(data2.salary_range);
            if (s1 > s2) { winner = data1.title; reason = "Higher Salary Potential"; }
            else if (s2 > s1) { winner = data2.title; reason = "Higher Salary Potential"; }
        }

        if (!winner) return null;

        return (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center animate-in fade-in slide-in-from-bottom-4">
                <h4 className="text-green-800 font-bold mb-1 flex items-center justify-center gap-2">
                    <Award className="w-5 h-5" /> Recommendation
                </h4>
                <p className="text-green-700">
                    Based on key metrics, <span className="font-bold">{winner}</span> appears to be the better choice due to <span className="font-medium">{reason}</span>.
                </p>
            </div>
        );
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3 text-indigo-900">
                        <ArrowRightLeft className="w-8 h-8 text-indigo-600" /> Compare & Decide
                    </h1>
                    <p className="text-gray-600 mt-2">Compare Colleges, Schools, and Jobs side-by-side.</p>
                </div>

                {/* Category Switcher */}
                <div className="flex justify-center mb-8">
                    <Tabs value={category} onValueChange={(v) => setCategory(v as Category)} className="w-full max-w-md">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="colleges">Colleges</TabsTrigger>
                            <TabsTrigger value="schools">Schools</TabsTrigger>
                            <TabsTrigger value="jobs">Jobs</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Selection Area */}
                <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
                    <div className="grid md:grid-cols-3 gap-6 items-center">
                        {/* Item 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{category === 'jobs' ? 'Job Role 1' : 'Institution 1'}</label>
                            <Select value={selected1} onValueChange={setSelected1}>
                                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    {items.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name || c.title}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center font-bold text-gray-400 border">
                                VS
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{category === 'jobs' ? 'Job Role 2' : 'Institution 2'}</label>
                            <Select value={selected2} onValueChange={setSelected2}>
                                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    {items.filter(c => c.id.toString() !== selected1).map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name || c.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Comparison Table */}
                {data1 && data2 && (
                    <Card className="p-0 overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 border-b">
                            <div className="text-gray-400 font-bold uppercase text-xs tracking-wider pt-2">Metric</div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg text-indigo-900 leading-tight">{data1.name || data1.title}</h3>
                                <div className="text-xs text-gray-500">{data1.district || data1.location}</div>
                                {data1.website && <a href={data1.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">Visit Website</a>}
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg text-indigo-900 leading-tight">{data2.name || data2.title}</h3>
                                <div className="text-xs text-gray-500">{data2.district || data2.location}</div>
                                {data2.website && <a href={data2.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">Visit Website</a>}
                            </div>
                        </div>

                        <div className="p-6 bg-white space-y-2">

                            {/* Colleges Comparison */}
                            {category === 'colleges' && (
                                <>
                                    {renderRow("Established", <Building className="w-4 h-4" />, data1.year_established, data2.year_established)}
                                    {renderRow("Type", <Building className="w-4 h-4" />, data1.type, data2.type)}
                                    {renderRow("Fees (4 Yrs)", <DollarSign className="w-4 h-4" />, `₹${data1.fees}`, `₹${data2.fees}`, false)}
                                    {renderRow("Placement Rate", <Award className="w-4 h-4" />,
                                        parseJson(data1.placement_stats)?.placement_rate,
                                        parseJson(data2.placement_stats)?.placement_rate, true
                                    )}
                                    {renderRow("Avg Package", <DollarSign className="w-4 h-4" />,
                                        parseJson(data1.placement_stats)?.avg_package,
                                        parseJson(data2.placement_stats)?.avg_package, true
                                    )}
                                    {renderRow("Highest Package", <Award className="w-4 h-4" />,
                                        parseJson(data1.placement_stats)?.highest_package,
                                        parseJson(data2.placement_stats)?.highest_package, true
                                    )}
                                </>
                            )}

                            {/* Schools Comparison */}
                            {category === 'schools' && (
                                <>
                                    {renderRow("Board", <BookOpen className="w-4 h-4" />, data1.board, data2.board)}
                                    {renderRow("Type", <Building className="w-4 h-4" />, data1.type, data2.type)}
                                    {renderRow("Total Students", <Check className="w-4 h-4" />, data1.total_students, data2.total_students, true)}
                                    {renderRow("Teacher Ratio", <Check className="w-4 h-4" />, data1.student_teacher_ratio, data2.student_teacher_ratio)}
                                    {renderRow("12th Pass %", <Award className="w-4 h-4" />,
                                        parseJson(data1.board_results)?.pass_percentage_12th,
                                        parseJson(data2.board_results)?.pass_percentage_12th, true
                                    )}
                                    {renderRow("Tuition Fee", <DollarSign className="w-4 h-4" />,
                                        parseJson(data1.fee_structure)?.tuition,
                                        parseJson(data2.fee_structure)?.tuition
                                    )}
                                </>
                            )}

                            {/* Jobs Comparison */}
                            {category === 'jobs' && (
                                <>
                                    {renderRow("Salary Range", <DollarSign className="w-4 h-4" />, data1.salary_range, data2.salary_range, true)}
                                    {renderRow("Growth", <TrendingUp className="w-4 h-4" />, data1.job_growth, data2.job_growth)}
                                    {renderRow("Min Education", <GraduationCap className="w-4 h-4" />, data1.min_education, data2.min_education)}

                                    <div className="grid grid-cols-3 gap-4 py-4 border-b items-start">
                                        <div className="font-medium text-gray-500 flex items-center gap-2 text-sm"><Check className="w-4 h-4" /> Skills</div>
                                        <div className="text-center text-sm">{parseJson(data1.skills_required || [], []).join(", ")}</div>
                                        <div className="text-center text-sm">{parseJson(data2.skills_required || [], []).join(", ")}</div>
                                    </div>
                                </>
                            )}

                            {/* Common Infrastructure (Schools/Colleges) */}
                            {(category !== 'jobs') && (
                                <div className="grid grid-cols-3 gap-4 py-4 border-b items-start">
                                    <div className="font-medium text-gray-500 flex items-center gap-2 text-sm"><Building className="w-4 h-4" /> Facilities</div>
                                    <div className="text-center text-sm text-gray-600">
                                        {(parseJson(data1.infrastructure) || []).join(", ")}
                                    </div>
                                    <div className="text-center text-sm text-gray-600">
                                        {(parseJson(data2.infrastructure) || []).join(", ")}
                                    </div>
                                </div>
                            )}

                        </div>
                        {renderVerdict()}
                    </Card>
                )}
            </div>
        </Layout>
    );
}
