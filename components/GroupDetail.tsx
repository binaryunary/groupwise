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
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <button
            onClick={onBackToGroups}
            className="btn bg-muted text-foreground px-4 py-2"
          >
            ← Back to Groups
          </button>
          <button
            onClick={startEditing}
            className="btn bg-muted text-foreground p-3"
          >
            <Edit3 size={18} />
          </button>
        </div>

        {/* Group Name */}
        <div className="mb-6 animate-scale-in">
          {isEditing ? (
            <div className="card p-6 space-y-4">
              <label className="text-sm font-medium text-foreground">Group Name</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={editingGroupName}
                  onChange={(e) => setEditingGroupName(e.target.value)}
                  className="input flex-1"
                  placeholder="Group name"
                  autoFocus
                />
                <button
                  onClick={handleRenameGroup}
                  disabled={!editingGroupName.trim()}
                  className="btn bg-primary text-primary-foreground px-6"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{group.name}</h1>
              <p className="text-muted-foreground">Manage your team members</p>
            </div>
          )}
        </div>

        {/* Add Member */}
        <div className="card p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">Add New Member</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              className="input flex-1"
              placeholder="Enter member name..."
            />
            <button
              onClick={handleAddMember}
              disabled={!newMemberName.trim()}
              className="btn bg-secondary text-secondary-foreground px-6"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Team Members
            </h2>
            <div className="bg-primary/10 px-3 py-1 rounded-full">
              <span className="text-primary font-medium text-sm">
                {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
              </span>
            </div>
          </div>

          {group.members.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Plus size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No members yet. Add your first team member above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {group.members.map((member, index) => (
                <div
                  key={index}
                  className="card p-4 flex items-center justify-between animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-accent font-medium text-sm">
                        {member.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">{member}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className="w-8 h-8 rounded-full bg-error/10 text-error hover:bg-error/20 transition-colors flex items-center justify-center"
                    title="Remove member"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subgroup Generator */}
        <SubgroupGenerator members={group.members} />
      </div>
    </div>
  );
}
