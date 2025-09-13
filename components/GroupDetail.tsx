'use client';

import { useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { Group } from '@/lib/types';
import SubgroupGenerator from './SubgroupGenerator';

interface GroupDetailProps {
  group: Group;
  onUpdateGroup: (group: Group) => void;
  onBackToGroups: () => void;
}

export default function GroupDetail({ group, onUpdateGroup, onBackToGroups }: GroupDetailProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const updatedGroup = {
        ...group,
        members: [...group.members, newMemberName.trim()]
      };
      onUpdateGroup(updatedGroup);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedGroup = {
      ...group,
      members: group.members.filter((_, i) => i !== index)
    };
    onUpdateGroup(updatedGroup);
  };

  const handleRenameGroup = () => {
    if (editingGroupName.trim()) {
      const updatedGroup = {
        ...group,
        name: editingGroupName.trim()
      };
      onUpdateGroup(updatedGroup);
      setIsEditing(false);
      setEditingGroupName('');
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditingGroupName(group.name);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToGroups}
            className="text-sm text-muted-foreground"
          >
            ← Back to Groups
          </button>
          <button
            onClick={startEditing}
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
                onClick={handleRenameGroup}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg"
              >
                Save
              </button>
            </div>
          ) : (
            <h1 className="text-2xl font-bold">{group.name}</h1>
          )}
        </div>

        {/* Add Member */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              className="flex-1 p-3 border rounded-lg"
              placeholder="Add member"
            />
            <button
              onClick={handleAddMember}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-lg"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            Members ({group.members.length})
          </h2>
          <div className="space-y-2">
            {group.members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span>{member}</span>
                <button
                  onClick={() => handleRemoveMember(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Subgroup Generator */}
        <SubgroupGenerator members={group.members} />
      </div>
    </div>
  );
}
