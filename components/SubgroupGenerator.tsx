'use client';

import { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Check, ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react';
import { Subgroup, SubgroupRound } from '@/lib/types';
import { generateRotationRounds, splitIntoGroups } from '@/lib/utils';

interface SubgroupGeneratorProps {
  members: string[];
  onSubgroupsGenerated?: () => void;
}

type GenerationMode = 'rotation' | 'split';

export default function SubgroupGenerator({ members, onSubgroupsGenerated }: SubgroupGeneratorProps) {
  const [generatedRounds, setGeneratedRounds] = useState<SubgroupRound[]>([]);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [collapsedRounds, setCollapsedRounds] = useState<Set<string>>(new Set());

  // Generation options (transient — not persisted).
  const [mode, setMode] = useState<GenerationMode>('rotation');
  const [groupSize, setGroupSize] = useState(2);
  const [numRounds, setNumRounds] = useState(1);
  // Mode/size the displayed results were generated with, for accurate labels.
  const [lastConfig, setLastConfig] = useState<{ mode: GenerationMode; groupSize: number } | null>(null);

  // Duplicate names count as a single participant, matching the generators.
  const memberCount = useMemo(() => new Set(members).size, [members]);
  const maxGroupSize = Math.max(2, memberCount);
  // For pairs the schedule can't exceed n-1 rounds without repeating; larger
  // groups may run longer, so allow a generous cap.
  const maxRounds = groupSize === 2 ? Math.max(1, memberCount - 1) : Math.max(1, memberCount * 2);
  // Rounds needed for everyone to meet everyone once (n-1 for pairs).
  const defaultRounds = (size: number) => Math.max(1, Math.ceil((memberCount - 1) / Math.max(1, size - 1)));

  // Keep the options valid as members are added/removed.
  useEffect(() => {
    setGroupSize(prev => Math.min(Math.max(2, prev), maxGroupSize));
  }, [maxGroupSize]);

  useEffect(() => {
    setNumRounds(defaultRounds(groupSize));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupSize, memberCount]);

  // Generate unique ID
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const changeGroupSize = (delta: number) => {
    setGroupSize(prev => Math.min(maxGroupSize, Math.max(2, prev + delta)));
  };

  const handleGenerateSubgroups = () => {
    if (memberCount < 2) return;

    const rounds =
      mode === 'split'
        ? [splitIntoGroups(members, groupSize)]
        : generateRotationRounds(members, groupSize, Math.min(numRounds, maxRounds));

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
    setLastConfig({ mode, groupSize });
    setCollapsedRounds(new Set());

    // Collapse controls after generating subgroups
    setIsControlsCollapsed(true);
    // Notify parent component that subgroups were generated
    onSubgroupsGenerated?.();
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

  if (memberCount < 2) {
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
          <div className="p-4 space-y-4 animate-fade-in">
            {/* Mode */}
            <div className="space-y-2">
              <label className="footnote text-muted-foreground">Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('rotation')}
                  className={`btn flex-1 ${mode === 'rotation' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Rotation
                </button>
                <button
                  onClick={() => setMode('split')}
                  className={`btn flex-1 ${mode === 'split' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Single split
                </button>
              </div>
              <p className="caption text-muted-foreground">
                {mode === 'rotation'
                  ? 'Several rounds; group-mates rotate so people mix over time.'
                  : 'One set of groups. Generate again to reshuffle.'}
              </p>
            </div>

            {/* Group size */}
            <div className="space-y-2">
              <label className="footnote text-muted-foreground">Group size</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => changeGroupSize(-1)}
                  disabled={groupSize <= 2}
                  className="btn btn-secondary"
                  aria-label="Decrease group size"
                >
                  <Minus size={16} />
                </button>
                <span className="body font-medium text-foreground w-8 text-center" aria-live="polite">
                  {groupSize}
                </span>
                <button
                  onClick={() => changeGroupSize(1)}
                  disabled={groupSize >= maxGroupSize}
                  className="btn btn-secondary"
                  aria-label="Increase group size"
                >
                  <Plus size={16} />
                </button>
                <span className="footnote text-muted-foreground ml-1">
                  {groupSize === 2 ? 'pairs' : `groups of ${groupSize}`}
                </span>
              </div>
            </div>

            {/* Rounds (rotation only) */}
            {mode === 'rotation' && (
              <div className="space-y-2">
                <label className="footnote text-muted-foreground">Rounds</label>
                <input
                  type="number"
                  min={1}
                  max={maxRounds}
                  value={numRounds}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setNumRounds(Number.isNaN(value) ? 1 : Math.min(maxRounds, Math.max(1, value)));
                  }}
                  className="input w-full"
                />
                <p className="caption text-muted-foreground">
                  Up to {maxRounds} round{maxRounds !== 1 ? 's' : ''} for {memberCount} members.
                </p>
              </div>
            )}

            <button
              onClick={handleGenerateSubgroups}
              className="btn btn-primary w-full"
            >
              <RotateCcw size={20} />
              {groupSize === 2 ? 'Generate Pairs' : 'Generate Groups'}
            </button>
          </div>
        )}

        {isControlsCollapsed && generatedRounds.length > 0 && (
          <div className="list-item animate-fade-in">
            <div className="flex-1">
              <p className="subhead text-muted-foreground">
                {lastConfig?.mode === 'split'
                  ? `Single split — ${generatedRounds[0].subgroups.length} group${generatedRounds[0].subgroups.length !== 1 ? 's' : ''}`
                  : `${generatedRounds.length} round${generatedRounds.length !== 1 ? 's' : ''} of ${lastConfig && lastConfig.groupSize === 2 ? 'pairs' : `groups of ${lastConfig?.groupSize}`}`}
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
                      {lastConfig?.mode === 'split'
                        ? 'Groups'
                        : `Round ${round.roundNumber}`
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
