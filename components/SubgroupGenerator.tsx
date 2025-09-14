'use client';

import { useState } from 'react';
import { RotateCcw, Clock } from 'lucide-react';
import { Subgroup, SubgroupRound } from '@/lib/types';
import { generateRoundRobinSubgroups } from '@/lib/utils';

interface SubgroupGeneratorProps {
  members: string[];
  onSubgroupsGenerated?: () => void;
}

export default function SubgroupGenerator({ members, onSubgroupsGenerated }: SubgroupGeneratorProps) {
  const [generatedRounds, setGeneratedRounds] = useState<SubgroupRound[]>([]);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  const handleGenerateSubgroups = () => {
    if (members.length >= 2) {
      const rounds = generateRoundRobinSubgroups(members, 2);
      const roundsWithNumbers: SubgroupRound[] = rounds.map((round, index) => ({
        roundNumber: index + 1,
        subgroups: round.map(groupMembers => ({ members: groupMembers }))
      }));
      setGeneratedRounds(roundsWithNumbers);

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
          <RotateCcw size={24} className="text-muted-foreground" />
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
            <button
              onClick={handleGenerateSubgroups}
              className="btn btn-primary w-full"
            >
              <RotateCcw size={20} />
              Generate Pairs
            </button>
          </div>
        )}

        {isControlsCollapsed && generatedRounds.length > 0 && (
          <div className="list-item animate-fade-in">
            <div className="flex-1">
              <p className="subhead text-muted-foreground">
                Pairwise Round Robin: {generatedRounds.length} round{generatedRounds.length !== 1 ? 's' : ''} of pairs
              </p>
            </div>
            <button
              onClick={() => setIsControlsCollapsed(false)}
              className="btn btn-secondary ml-3"
            >
              <RotateCcw size={16} />
              Generate Again
            </button>
          </div>
        )}
      </div>

      {/* Generated Subgroups Display */}
      {generatedRounds.length > 0 && (
        <div className="space-y-6 animate-scale-in">
          {generatedRounds.map((round, roundIndex) => (
            <div key={roundIndex} className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <h2 className="title-2 text-foreground">
                  {generatedRounds.length > 1
                    ? `Round ${round.roundNumber}`
                    : 'Round Robin Schedule'
                  }
                </h2>
              </div>
              <div className="list-group">
                {round.subgroups.map((subgroup, subgroupIndex) => {
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

                  const colorIndex = subgroupIndex % colors.length;
                  const color = colors[colorIndex];

                  return (
                    <div
                      key={subgroupIndex}
                      className={`list-item ${color.bg} animate-fade-in`}
                      style={{ animationDelay: `${subgroupIndex * 100}ms` }}
                    >
                      <div className={`w-8 h-8 ${color.badge} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                        <span className="text-white font-bold footnote">
                          {subgroupIndex + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className={`body font-medium ${color.text}`}>
                          Group {subgroupIndex + 1}
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
          ))}
        </div>
      )}
    </div>
  );
}
