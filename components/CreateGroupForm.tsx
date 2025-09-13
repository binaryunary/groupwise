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
      <div className="card p-6 space-y-4 animate-scale-in">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Group Name</label>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
            className="input"
            placeholder="Enter a group name..."
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim()}
            className="btn bg-primary text-primary-foreground flex-1 btn-lg"
          >
            <Plus size={20} />
            Create Group
          </button>
          <button
            onClick={handleCancel}
            className="btn bg-muted text-foreground px-6"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="w-full p-6 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-background-secondary transition-all duration-200 group"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Plus size={24} className="text-primary" />
      </div>
      <div className="text-center">
        <div className="font-semibold text-foreground text-lg">Create New Group</div>
        <div className="text-muted-foreground text-sm">Start organizing your team</div>
      </div>
    </button>
  );
}
