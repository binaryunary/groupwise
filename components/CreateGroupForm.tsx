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
      <div className="space-y-3">
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
          className="w-full p-3 border rounded-lg"
          placeholder="Group name"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleCreateGroup}
            className="flex-1 p-3 bg-primary text-primary-foreground rounded-lg"
          >
            Create Group
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-3 border rounded-lg"
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
      className="w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors"
    >
      <Plus size={20} />
      Create New Group
    </button>
  );
}
