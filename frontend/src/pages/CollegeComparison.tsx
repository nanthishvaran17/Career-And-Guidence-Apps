import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowRightLeft, Check, X, Building, MapPin, DollarSign, Award, BookOpen } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

export function CollegeComparison() {
    const [colleges, setColleges] = useState<any[]>([]);
    const [selected1, setSelected1] = useState<string>('');
    const [selected2, setSelected2] = useState<string>('');
    const [c1Data, setC1Data] = useState<any>(null);
    const [c2Data, setC2Data] = useState<any>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/colleges`)
            .then(res => res.json())
            .then(data => setColleges(data))
            .catch(() => toast.error("Failed to load colleges"));
    }, []);

    useEffect(() => {
        if (selected1) setC1Data(colleges.find(c => c.id.toString() === selected1));
    }, [selected1, colleges]);

    useEffect(() => {
        if (selected2) setC2Data(colleges.find(c => c.id.toString() === selected2));
    }, [selected2, colleges]);

    const renderComparisonRow = (label: string, icon: any, val1: any, val2: any, highlightHigher = false) => {
        const is1Better = highlightHigher && val1 && val2 ? (parseFloat(val1) > parseFloat(val2)) : false;
        const is2Better = highlightHigher && val1 && val2 ? (parseFloat(val2) > parseFloat(val1)) : false;

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

    const parseJson = (str: string) => {
        try { return JSON.parse(str); } catch { return null; }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3 text-indigo-900">
                        <ArrowRightLeft className="w-8 h-8 text-indigo-600" /> College Comparison Tool
                    </h1>
                    <p className="text-gray-600 mt-2">Compare fees, placements, and infrastructure side-by-side.</p>
                </div>

                {/* Selection Area */}
                <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
                    <div className="grid md:grid-cols-3 gap-6 items-center">

                        {/* College 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">College 1</label>
                            <Select value={selected1} onValueChange={setSelected1}>
                                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select College" /></SelectTrigger>
                                <SelectContent>
                                    {colleges.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center font-bold text-gray-400 border">
                                VS
                            </div>
                        </div>

                        {/* College 2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">College 2</label>
                            <Select value={selected2} onValueChange={setSelected2}>
                                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select College" /></SelectTrigger>
                                <SelectContent>
                                    {colleges.filter(c => c.id.toString() !== selected1).map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Comparison Table */}
                {c1Data && c2Data && (
                    <Card className="p-0 overflow-hidden shadow-xl animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 border-b">
                            <div className="text-gray-400 font-bold uppercase text-xs tracking-wider pt-2">Metric</div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg text-indigo-900 leading-tight">{c1Data.name}</h3>
                                <span className="text-xs text-gray-500">{c1Data.district}</span>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg text-indigo-900 leading-tight">{c2Data.name}</h3>
                                <span className="text-xs text-gray-500">{c2Data.district}</span>
                            </div>
                        </div>

                        <div className="p-6 bg-white space-y-2">
                            {renderComparisonRow("Established", <Building className="w-4 h-4" />, c1Data.year_established, c2Data.year_established)}
                            {renderComparisonRow("Type", <Building className="w-4 h-4" />, c1Data.type, c2Data.type)}
                            {renderComparisonRow("Fees (4 Yrs)", <DollarSign className="w-4 h-4" />, `₹${c1Data.fees?.toLocaleString()}`, `₹${c2Data.fees?.toLocaleString()}`, false)}
                            {/* Lower fees is usually better but subjective, so no auto-highlight or invert logic needed simply */}

                            {renderComparisonRow("Placement Rate", <Award className="w-4 h-4" />,
                                parseJson(c1Data.placement_stats)?.placement_rate,
                                parseJson(c2Data.placement_stats)?.placement_rate
                            )}
                            {renderComparisonRow("Avg Package", <DollarSign className="w-4 h-4" />,
                                parseJson(c1Data.placement_stats)?.avg_package,
                                parseJson(c2Data.placement_stats)?.avg_package
                            )}
                            {renderComparisonRow("Highest Package", <Award className="w-4 h-4" />,
                                parseJson(c1Data.placement_stats)?.highest_package,
                                parseJson(c2Data.placement_stats)?.highest_package
                            )}

                            {renderComparisonRow("NAAC Grade", <Award className="w-4 h-4" />, c1Data.accreditations || c1Data.naac_grade, c2Data.accreditations || c2Data.naac_grade)}

                            {/* Courses */}
                            <div className="grid grid-cols-3 gap-4 py-4 border-b items-start">
                                <div className="font-medium text-gray-500 flex items-center gap-2 text-sm"><BookOpen className="w-4 h-4" /> Courses</div>
                                <div className="text-center text-sm">
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {(parseJson(c1Data.courses_offered) || parseJson(c1Data.courses) || []).slice(0, 5).map((c: string) => (
                                            <span key={c} className="bg-gray-100 px-2 py-1 rounded text-xs">{c}</span>
                                        ))}
                                        {(parseJson(c1Data.courses_offered) || []).length > 5 && <span className="text-xs text-gray-400">+More</span>}
                                    </div>
                                </div>
                                <div className="text-center text-sm">
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {(parseJson(c2Data.courses_offered) || parseJson(c2Data.courses) || []).slice(0, 5).map((c: string) => (
                                            <span key={c} className="bg-gray-100 px-2 py-1 rounded text-xs">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Facilities */}
                            <div className="grid grid-cols-3 gap-4 py-4 border-b items-start">
                                <div className="font-medium text-gray-500 flex items-center gap-2 text-sm"><Building className="w-4 h-4" /> Facilities</div>
                                <div className="text-center text-sm text-gray-600">
                                    {(parseJson(c1Data.infrastructure) || []).join(", ")}
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    {(parseJson(c2Data.infrastructure) || []).join(", ")}
                                </div>
                            </div>

                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
