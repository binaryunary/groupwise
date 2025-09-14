'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Group } from '@/lib/types';

interface CreateGroupFormProps {
  onCreateGroup: (group: Group) => void;
}

export default function CreateGroupForm({ onCreateGroup }: CreateGroupFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        members: [],
        createdAt: new Date()
      };
      onCreateGroup(newGroup);
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewGroupName('');
  };

  if (isCreating) {
    return (
      <div className="card animate-scale-in">
        <div className="list-item border-b border-separator">
          <h3 className="title-3 text-foreground">Create New Group</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="footnote text-muted-foreground">Group Name</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
              className="input w-full"
              placeholder="Enter a group name..."
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}
              className="btn btn-primary flex-1"
            >
              <Plus size={20} />
              Create Group
            </button>
            <button
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="w-full card p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
        <Plus size={24} className="text-primary" />
      </div>
      <div className="text-center">
        <div className="body font-medium text-foreground">Create New Group</div>
        <div className="footnote text-muted-foreground">Start organizing your team</div>
      </div>
    </button>
  );
}
