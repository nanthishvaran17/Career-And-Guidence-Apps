import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { X } from 'lucide-react';

interface FilterState {
    search: string;
    district: string[];
    category: string[];
    ownership: string[]; // Govt, Private, Aided
    feesRange: [number, number];
}

interface FilterSidebarProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    onApply: () => void;
    onReset: () => void;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
    activeTab: string;
}

const DISTRICTS = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Tirunelveli", "Vellore", "Thanjavur", "Kanyakumari"];
const CATEGORIES = ["Engineering", "Medical", "Arts & Science", "Law", "Agriculture", "Management"]; // For Colleges
const SCHOOL_BOARDS = ["State Board", "CBSE", "ICSE", "IGCSE", "IB", "Matriculation"]; // For Schools
const OWNERSHIP = ["Government", "Private", "Aided", "Autonomous"];

export function FilterSidebar({ filters, setFilters, onApply, onReset, className, isOpen, onClose, activeTab }: FilterSidebarProps) {

    const handleCheckboxChange = (type: keyof FilterState, value: string) => {
        setFilters(prev => {
            const current = prev[type] as string[];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const isCollege = activeTab === 'colleges';
    const isSchool = activeTab === 'schools';

    return (
        <div className={`bg-white h-full overflow-y-auto p-4 border-r ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                {onClose && <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>}
            </div>

            <div className="space-y-6">
                {/* District Filter */}
                <div>
                    <h4 className="font-medium mb-3 text-sm">District</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {DISTRICTS.map(district => (
                            <div key={district} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`district-${district}`}
                                    checked={filters.district.includes(district)}
                                    onCheckedChange={() => handleCheckboxChange('district', district)}
                                />
                                <Label htmlFor={`district-${district}`} className="text-sm cursor-pointer">{district}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Category / Board Filter */}
                <div>
                    <h4 className="font-medium mb-3 text-sm">{isCollege ? "Category" : "Board"}</h4>
                    <div className="space-y-2">
                        {(isCollege ? CATEGORIES : SCHOOL_BOARDS).map(item => (
                            <div key={item} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cat-${item}`}
                                    checked={filters.category.includes(item)}
                                    onCheckedChange={() => handleCheckboxChange('category', item)}
                                />
                                <Label htmlFor={`cat-${item}`} className="text-sm cursor-pointer">{item}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Ownership Filter */}
                <div>
                    <h4 className="font-medium mb-3 text-sm">Management</h4>
                    <div className="space-y-2">
                        {OWNERSHIP.map(item => (
                            <div key={item} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`own-${item}`}
                                    checked={filters.ownership.includes(item)}
                                    onCheckedChange={() => handleCheckboxChange('ownership', item)}
                                />
                                <Label htmlFor={`own-${item}`} className="text-sm cursor-pointer">{item}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onReset}>Reset</Button>
                    <Button className="flex-1 gradient-primary text-white" onClick={onApply}>Apply Filter</Button>
                </div>
            </div>
        </div>
    );
}
