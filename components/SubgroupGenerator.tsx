'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Clock, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Subgroup, SubgroupRound } from '@/lib/types';
import { generateRoundRobinSubgroups } from '@/lib/utils';

interface SubgroupGeneratorProps {
  members: string[];
  onSubgroupsGenerated?: () => void;
}

export default function SubgroupGenerator({ members, onSubgroupsGenerated }: SubgroupGeneratorProps) {
  const [generatedRounds, setGeneratedRounds] = useState<SubgroupRound[]>([]);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [collapsedRounds, setCollapsedRounds] = useState<Set<string>>(new Set());

  // Generate unique ID
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const handleGenerateSubgroups = () => {
    if (members.length >= 2) {
      const rounds = generateRoundRobinSubgroups(members, 2);
      const roundsWithIds: SubgroupRound[] = rounds.map((round, index) => ({
        id: generateId(),
        roundNumber: index + 1,
        completed: false,
        subgroups: round.map(groupMembers => ({
          id: generateId(),
          members: groupMembers,
          completed: false
        }))
      }));
      setGeneratedRounds(roundsWithIds);
      setCollapsedRounds(new Set());

      // Collapse controls after generating subgroups
      setIsControlsCollapsed(true);
      // Notify parent component that subgroups were generated
      onSubgroupsGenerated?.();
    }
  };

  const toggleSubgroupCompletion = (roundId: string, subgroupId: string) => {
    setGeneratedRounds(rounds => rounds.map(round => {
      if (round.id === roundId) {
        const updatedSubgroups = round.subgroups.map(subgroup =>
          subgroup.id === subgroupId
            ? { ...subgroup, completed: !subgroup.completed }
            : subgroup
        );

        // Check if all subgroups in this round are completed
        const allCompleted = updatedSubgroups.every(subgroup => subgroup.completed);

        return {
          ...round,
          subgroups: updatedSubgroups,
          completed: allCompleted
        };
      }
      return round;
    }));
  };

  const toggleRoundCollapse = (roundId: string) => {
    setCollapsedRounds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roundId)) {
        newSet.delete(roundId);
      } else {
        newSet.add(roundId);
      }
      return newSet;
    });
  };

  // Auto-collapse completed rounds
  useEffect(() => {
    generatedRounds.forEach(round => {
      if (round.completed && !collapsedRounds.has(round.id)) {
        setCollapsedRounds(prev => new Set(prev).add(round.id));
      }
    });
  }, [generatedRounds]);

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
      {/* Generate Controls */}
      <div className="card">
        {!isControlsCollapsed && (
          <div className="p-4 animate-fade-in">
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
          {generatedRounds.map((round, roundIndex) => {
            const isRoundCollapsed = collapsedRounds.has(round.id);

            return (
              <div key={round.id} className="space-y-4">
                <div
                  className={`flex items-center justify-between px-4 cursor-pointer transition-opacity duration-200 ${
                    round.completed ? 'opacity-60' : ''
                  }`}
                  onClick={() => toggleRoundCollapse(round.id)}
                >
                  <div className="flex items-center space-x-3">
                    <h2 className={`title-2 ${round.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {generatedRounds.length > 1
                        ? `Round ${round.roundNumber}`
                        : 'Round Robin Schedule'
                      }
                    </h2>
                    {round.completed && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="caption text-muted-foreground">
                      {round.subgroups.filter(s => s.completed).length}/{round.subgroups.length} completed
                    </span>
                    {isRoundCollapsed ? (
                      <ChevronRight size={16} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown size={16} className="text-muted-foreground" />
                    )}
                  </div>
                </div>

                {!isRoundCollapsed && (
                  <div className="list-group animate-fade-in">
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
                          key={subgroup.id}
                          className={`list-item ${color.bg} animate-fade-in cursor-pointer transition-all duration-200 ${
                            subgroup.completed ? 'opacity-50' : ''
                          }`}
                          style={{ animationDelay: `${subgroupIndex * 100}ms` }}
                          onClick={() => toggleSubgroupCompletion(round.id, subgroup.id)}
                        >
                          <div className={`w-8 h-8 ${color.badge} rounded-full flex items-center justify-center mr-3 flex-shrink-0 relative`}>
                            {subgroup.completed ? (
                              <Check size={16} className="text-white" />
                            ) : (
                              <span className="text-white font-bold footnote">
                                {subgroupIndex + 1}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`body font-medium ${color.text} ${subgroup.completed ? 'line-through' : ''}`}>
                              Group {subgroupIndex + 1}
                            </div>
                            <div className={`subhead text-muted-foreground ${subgroup.completed ? 'line-through' : ''}`}>
                              {subgroup.members.join(' • ')}
                            </div>
                          </div>
                          {subgroup.completed && (
                            <div className="ml-3 text-green-600">
                              <Check size={20} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
