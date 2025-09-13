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
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Generate Subgroups Controls */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">Subgroup size:</label>
          <select
            value={subgroupSize}
            onChange={(e) => setSubgroupSize(Number(e.target.value))}
            className="p-2 border rounded-lg"
          >
            {Array.from({ length: members.length - 1 }, (_, i) => i + 2).map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerateSubgroups}
          className="w-full p-3 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2"
        >
          <Shuffle size={16} />
          Generate Subgroups
        </button>
      </div>

      {/* Generated Subgroups Display */}
      {generatedSubgroups.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Generated Subgroups ({generatedSubgroups.length})
          </h2>
          <div className="space-y-3">
            {generatedSubgroups.map((subgroup, index) => (
              <div
                key={index}
                className="p-3 bg-muted rounded-lg"
              >
                <div className="font-medium text-sm text-muted-foreground mb-1">
                  Group {index + 1}
                </div>
                <div className="text-sm">
                  {subgroup.members.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
