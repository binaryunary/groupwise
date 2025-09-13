'use client';

import { Users } from 'lucide-react';
import { Group } from '@/lib/types';

interface GroupListProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
}

export default function GroupList({ groups, onSelectGroup }: GroupListProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Your Groups</h2>
      <div className="space-y-3">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group)}
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
  );
}
