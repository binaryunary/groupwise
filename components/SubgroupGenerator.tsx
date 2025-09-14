'use client';

import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Subgroup } from '@/lib/types';
import { generateCombinations } from '@/lib/utils';

interface SubgroupGeneratorProps {
  members: string[];
  onSubgroupsGenerated?: () => void;
}

export default function SubgroupGenerator({ members, onSubgroupsGenerated }: SubgroupGeneratorProps) {
  const [subgroupSize, setSubgroupSize] = useState(2);
  const [generatedSubgroups, setGeneratedSubgroups] = useState<Subgroup[]>([]);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  const handleGenerateSubgroups = () => {
    if (members.length >= subgroupSize) {
      const combinations = generateCombinations(members, subgroupSize);
      setGeneratedSubgroups(combinations.map(combo => ({ members: combo })));
      // Collapse controls after generating subgroups
      setIsControlsCollapsed(true);
      // Notify parent component that subgroups were generated
      onSubgroupsGenerated?.();
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
      <div className="card">
        <div className="list-item border-b border-separator">
          <h3 className="title-3 text-foreground">Generate Subgroups</h3>
        </div>

        {!isControlsCollapsed && (
          <div className="p-4 space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="footnote text-muted-foreground">Subgroup size:</label>
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
              className="btn btn-primary w-full"
            >
              <Shuffle size={20} />
              Generate All Combinations
            </button>
          </div>
        )}

        {isControlsCollapsed && generatedSubgroups.length > 0 && (
          <div className="list-item animate-fade-in">
            <div className="flex-1">
              <p className="subhead text-muted-foreground">
                Currently showing {subgroupSize}-person subgroups
              </p>
            </div>
            <button
              onClick={() => setIsControlsCollapsed(false)}
              className="btn btn-secondary ml-3"
            >
              <Shuffle size={16} />
              Change Settings
            </button>
          </div>
        )}
      </div>

      {/* Generated Subgroups Display */}
      {generatedSubgroups.length > 0 && (
        <div className="space-y-4 animate-scale-in">
          <div className="flex items-center justify-between px-4">
            <h2 className="title-2 text-foreground">
              Generated Subgroups
            </h2>
            <div className="bg-accent/10 px-3 py-1 rounded-full">
              <span className="footnote text-accent font-medium">
                {generatedSubgroups.length} combinations
              </span>
            </div>
          </div>
          <div className="list-group">
            {generatedSubgroups.map((subgroup, index) => {
              // Color palette for subgroups with good contrast
              const colors = [
                { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500' },
                { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-500' },
                { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' },
                { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500' },
                { bg: 'bg-pink-100', text: 'text-pink-700', badge: 'bg-pink-500' },
                { bg: 'bg-teal-100', text: 'text-teal-700', badge: 'bg-teal-500' },
                { bg: 'bg-indigo-100', text: 'text-indigo-700', badge: 'bg-indigo-500' },
                { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500' },
              ];

              const colorIndex = index % colors.length;
              const color = colors[colorIndex];

              return (
                <div
                  key={index}
                  className={`list-item ${color.bg} animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-8 h-8 ${color.badge} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                    <span className="text-white font-bold footnote">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className={`body font-medium ${color.text}`}>
                      Subgroup {index + 1}
                    </div>
                    <div className="subhead text-muted-foreground">
                      {subgroup.members.join(' • ')}
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
