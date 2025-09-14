'use client';

import { useState } from 'react';
import { Plus, Edit3, X, UserPlus, Trash2 } from 'lucide-react';
import { Group } from '@/lib/types';
import SubgroupGenerator from './SubgroupGenerator';

interface GroupDetailProps {
  group: Group;
  onUpdateGroup: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
  onBackToGroups: () => void;
}

export default function GroupDetail({ group, onUpdateGroup, onDeleteGroup, onBackToGroups }: GroupDetailProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [areMembersCollapsed, setAreMembersCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDeleteGroup = () => {
    onDeleteGroup(group.id);
    onBackToGroups();
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Native Navigation Bar */}
      <div className="nav-bar">
        <button
          onClick={onBackToGroups}
          className="btn btn-secondary"
        >
          ← Groups
        </button>
        <div className="flex gap-2">
          <button
            onClick={startEditing}
            className="btn btn-secondary"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={confirmDelete}
            className="btn btn-destructive"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Group Name Section */}
        <div className="py-6">
          {isEditing ? (
            <div className="card p-6 space-y-4">
              <label className="footnote text-muted-foreground">Group Name</label>
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
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <h1 className="title-large text-foreground mb-2">{group.name}</h1>
              <p className="subhead text-muted-foreground">Manage your team members</p>
            </div>
          )}
        </div>

        {/* Add Member */}
        {!areMembersCollapsed && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="title-3 text-foreground">Add New Member</h3>
            <div className="card">
              <div className="list-item">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground body"
                  placeholder="Enter member name..."
                />
                <button
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                  className="btn btn-primary ml-3"
                  style={{ minHeight: '36px', padding: '8px 12px' }}
                >
                  <UserPlus size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ height: '40px' }}></div>

        {/* Members List */}
        {!areMembersCollapsed && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between px-4">
              <h2 className="title-2 text-foreground">Team Members</h2>
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <span className="footnote text-primary font-medium">
                  {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                </span>
              </div>
            </div>

            {group.members.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Plus size={24} className="text-muted-foreground" />
                </div>
                <p className="subhead text-muted-foreground">No members yet. Add your first team member above!</p>
              </div>
            ) : (
              <div className="list-group">
                {group.members.map((member, index) => (
                  <div key={index} className="list-item">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <span className="footnote text-primary font-medium">
                        {member.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="body text-foreground flex-1">{member}</span>
                    <button
                      onClick={() => handleRemoveMember(index)}
                      className="btn btn-destructive ml-3"
                      style={{ minHeight: '36px', padding: '8px 12px' }}
                      title="Remove member"
                    >
                      <X size={16} />
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
                <h3 className="title-3 text-foreground">Team: {group.name}</h3>
                <p className="subhead text-muted-foreground">
                  {group.members.length} members: {group.members.slice(0, 3).join(', ')}
                  {group.members.length > 3 && ` +${group.members.length - 3} more`}
                </p>
              </div>
              <button
                onClick={() => setAreMembersCollapsed(false)}
                className="btn btn-secondary"
              >
                Edit Team
              </button>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ height: '40px' }}></div>

        {/* Subgroup Generator */}
        <SubgroupGenerator
          members={group.members}
          onSubgroupsGenerated={() => setAreMembersCollapsed(true)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-sm w-full animate-scale-in">
            <div className="list-item border-b border-separator">
              <h3 className="title-3 text-foreground">Delete Group</h3>
            </div>
            <div className="p-4 space-y-4">
              <p className="body text-foreground">
                Are you sure you want to delete "{group.name}"? This action cannot be undone.
              </p>
              {group.members.length > 0 && (
                <p className="footnote text-muted-foreground">
                  This group contains {group.members.length} member{group.members.length !== 1 ? 's' : ''}.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="btn btn-destructive flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
