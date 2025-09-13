'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Edit3, Shuffle } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
}

interface Subgroup {
  members: string[];
}

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [subgroupSize, setSubgroupSize] = useState(2);
  const [generatedSubgroups, setGeneratedSubgroups] = useState<Subgroup[]>([]);

  // Load groups from localStorage on component mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('groupwise-groups');
    if (savedGroups) {
      const parsedGroups = JSON.parse(savedGroups).map((group: any) => ({
        ...group,
        createdAt: new Date(group.createdAt)
      }));
      setGroups(parsedGroups);
    }
  }, []);

  // Save groups to localStorage whenever groups change
  useEffect(() => {
    localStorage.setItem('groupwise-groups', JSON.stringify(groups));
  }, [groups]);

  const createGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        members: [],
        createdAt: new Date()
      };
      setGroups(prev => [...prev, newGroup]);
      setNewGroupName('');
      setIsCreating(false);
      setSelectedGroup(newGroup);
    }
  };

  const addMember = () => {
    if (newMemberName.trim() && selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        members: [...selectedGroup.members, newMemberName.trim()]
      };
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g));
      setSelectedGroup(updatedGroup);
      setNewMemberName('');
    }
  };

  const removeMember = (index: number) => {
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        members: selectedGroup.members.filter((_, i) => i !== index)
      };
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g));
      setSelectedGroup(updatedGroup);
    }
  };

  const renameGroup = () => {
    if (editingGroupName.trim() && selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        name: editingGroupName.trim()
      };
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updatedGroup : g));
      setSelectedGroup(updatedGroup);
      setIsEditing(false);
      setEditingGroupName('');
    }
  };

  const generateCombinations = (arr: string[], size: number): string[][] => {
    if (size > arr.length) return [];
    if (size === 1) return arr.map(item => [item]);
    if (size === arr.length) return [arr];

    const result: string[][] = [];

    function backtrack(start: number, current: string[]) {
      if (current.length === size) {
        result.push([...current]);
        return;
      }

      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    }

    backtrack(0, []);
    return result;
  };

  const generateSubgroups = () => {
    if (selectedGroup && selectedGroup.members.length >= subgroupSize) {
      const combinations = generateCombinations(selectedGroup.members, subgroupSize);
      setGeneratedSubgroups(combinations.map(combo => ({ members: combo })));
    }
  };

  if (selectedGroup) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-sm text-muted-foreground"
            >
              ← Back to Groups
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingGroupName(selectedGroup.name);
              }}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Edit3 size={16} />
            </button>
          </div>

          {/* Group Name */}
          <div className="mb-6">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingGroupName}
                  onChange={(e) => setEditingGroupName(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                  placeholder="Group name"
                />
                <button
                  onClick={renameGroup}
                  className="px-4 py-3 bg-primary text-primary-foreground rounded-lg"
                >
                  Save
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>
            )}
          </div>

          {/* Add Member */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMember()}
                className="flex-1 p-3 border rounded-lg"
                placeholder="Add member"
              />
              <button
                onClick={addMember}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Members ({selectedGroup.members.length})
            </h2>
            <div className="space-y-2">
              {selectedGroup.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span>{member}</span>
                  <button
                    onClick={() => removeMember(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Subgroups */}
          {selectedGroup.members.length >= 2 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm font-medium">Subgroup size:</label>
                <select
                  value={subgroupSize}
                  onChange={(e) => setSubgroupSize(Number(e.target.value))}
                  className="p-2 border rounded-lg"
                >
                  {Array.from({ length: selectedGroup.members.length - 1 }, (_, i) => i + 2).map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={generateSubgroups}
                className="w-full p-3 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2"
              >
                <Shuffle size={16} />
                Generate Subgroups
              </button>
            </div>
          )}

          {/* Generated Subgroups */}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">GroupWise</h1>
          <p className="text-muted-foreground">
            Generate subgroups from your teams
          </p>
        </div>

        {/* Create Group */}
        <div className="mb-6">
          {isCreating ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                className="w-full p-3 border rounded-lg"
                placeholder="Group name"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={createGroup}
                  className="flex-1 p-3 bg-primary text-primary-foreground rounded-lg"
                >
                  Create Group
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewGroupName('');
                  }}
                  className="px-4 py-3 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors"
            >
              <Plus size={20} />
              Create New Group
            </button>
          )}
        </div>

        {/* Groups List */}
        {groups.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Your Groups</h2>
            <div className="space-y-3">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className="w-full p-4 bg-muted rounded-lg text-left hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users size={14} />
                        {group.members.length} members
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {group.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
