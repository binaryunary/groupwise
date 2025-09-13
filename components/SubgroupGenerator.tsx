'use client';

import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Subgroup } from '@/lib/types';
import { generateCombinations } from '@/lib/utils';

interface SubgroupGeneratorProps {
  members: string[];
}

export default function SubgroupGenerator({ members }: SubgroupGeneratorProps) {
  const [subgroupSize, setSubgroupSize] = useState(2);
  const [generatedSubgroups, setGeneratedSubgroups] = useState<Subgroup[]>([]);

  const handleGenerateSubgroups = () => {
    if (members.length >= subgroupSize) {
      const combinations = generateCombinations(members, subgroupSize);
      setGeneratedSubgroups(combinations.map(combo => ({ members: combo })));
    }
  };

  if (members.length < 2) {
    return (
      <div className="card p-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <Shuffle size={24} className="text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Add at least 2 members to generate subgroups</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Generate Subgroups Controls */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Generate Subgroups</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subgroup size:</label>
            <select
              value={subgroupSize}
              onChange={(e) => setSubgroupSize(Number(e.target.value))}
              className="input w-full"
            >
              {Array.from({ length: members.length - 1 }, (_, i) => i + 2).map(size => (
                <option key={size} value={size}>
                  {size} {size === 2 ? 'people (pairs)' : size === 3 ? 'people (triplets)' : 'people'}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerateSubgroups}
            className="btn bg-accent text-accent-foreground w-full btn-lg"
          >
            <Shuffle size={20} />
            Generate All Combinations
          </button>
        </div>
      </div>

      {/* Generated Subgroups Display */}
      {generatedSubgroups.length > 0 && (
        <div className="space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Generated Subgroups
            </h2>
            <div className="bg-accent/10 px-3 py-1 rounded-full">
              <span className="text-accent font-medium text-sm">
                {generatedSubgroups.length} combinations
              </span>
            </div>
          </div>
          <div className="grid gap-3">
            {generatedSubgroups.map((subgroup, index) => {
              // Color palette for subgroups with good contrast
              const colors = [
                { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
                { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
                { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
                { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
                { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
                { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
                { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
                { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
              ];

              const colorIndex = index % colors.length;
              const color = colors[colorIndex];

              return (
                <div
                  key={index}
                  className={`card p-4 animate-fade-in border-2 ${color.border} ${color.bg}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${color.bg} border ${color.border} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className={`${color.text} font-bold text-sm`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${color.text}`}>
                        Subgroup {index + 1}
                      </div>
                      <div className="text-gray-600">
                        {subgroup.members.join(' • ')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
