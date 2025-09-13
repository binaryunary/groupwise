'use client';

import { useState } from 'react';
import { Plus, Edit3, X, UserPlus } from 'lucide-react';
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
  const [areMembersCollapsed, setAreMembersCollapsed] = useState(false);

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
      <div className="max-w-md mx-auto">
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
              <h1 className="text-3xl font-bold text-foreground mb-2">{group.name}</h1>
              <p className="text-muted-foreground">Manage your team members</p>
            </div>
          )}
        </div>

        {/* Add Member */}
        {!areMembersCollapsed && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground">Add New Member</h3>
            <div className="relative flex items-stretch border border-border rounded-lg bg-background overflow-hidden min-h-[60px]">
              <div className="flex items-center gap-3 flex-1 px-4 py-3">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-medium"
                  placeholder="Enter member name..."
                />
              </div>
              <button
                onClick={handleAddMember}
                disabled={!newMemberName.trim()}
                className="w-[15%] bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center border-l border-border/50 rounded-r-lg"
              >
                <UserPlus size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ height: '40px' }}></div>

        {/* Members List */}
        {!areMembersCollapsed && (
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
                    className="relative flex items-stretch border border-border rounded-lg bg-background overflow-hidden min-h-[60px] animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 flex-1 px-4 py-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <span className="text-accent font-medium text-sm">
                          {member.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{member}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(index)}
                      className="w-[15%] bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center justify-center border-l border-border/50 rounded-r-lg"
                      title="Remove member"
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collapsed Members Summary */}
        {areMembersCollapsed && (
          <div className="card p-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Team: {group.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {group.members.length} members: {group.members.slice(0, 3).join(', ')}
                  {group.members.length > 3 && ` +${group.members.length - 3} more`}
                </p>
              </div>
              <button
                onClick={() => setAreMembersCollapsed(false)}
                className="btn bg-muted text-foreground px-4 py-2"
              >
                Edit Team
              </button>
            </div>
          </div>
        )}        {/* Spacer */}
        <div style={{ height: '40px' }}></div>

        {/* Subgroup Generator */}
        <SubgroupGenerator
          members={group.members}
          onSubgroupsGenerated={() => setAreMembersCollapsed(true)}
        />
      </div>
    </div>
  );
}
