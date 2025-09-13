'use client';

import { Users } from 'lucide-react';
import { Group } from '@/lib/types';

interface GroupListProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
}

export default function GroupList({ groups, onSelectGroup }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <Users size={24} className="text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No groups yet. Create your first group to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">Your Groups</h2>
      <div className="space-y-3">
        {groups.map((group, index) => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group)}
            className="w-full card card-interactive p-5 text-left animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-lg text-foreground mb-1">{group.name}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span className="text-sm">
                      {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-sm">
                    {group.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">→</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
