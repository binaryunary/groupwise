'use client';

import { Group } from '@/lib/types';

interface GroupListProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
}

export default function GroupList({ groups, onSelectGroup }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="subhead text-muted-foreground">No groups yet. Create your first group to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-4">
        <h2 className="title-2 text-foreground">Your Groups</h2>
      </div>
      <div className="list-group">
        {groups.map((group, index) => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group)}
            className="list-item w-full text-left animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between flex-1">
              <div className="flex-1">
                <div className="body font-medium text-foreground mb-1">{group.name}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="footnote">
                    {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="footnote">
                    {group.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary footnote">→</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
