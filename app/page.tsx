'use client';

import { useState } from 'react';
import { Group } from '@/lib/types';
import { useLocalStorageGroups } from '@/lib/useLocalStorageGroups';
import GroupList from '@/components/GroupList';
import CreateGroupForm from '@/components/CreateGroupForm';
import GroupDetail from '@/components/GroupDetail';

export default function Home() {
  const { groups, addGroup, updateGroup } = useLocalStorageGroups();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleCreateGroup = (group: Group) => {
    addGroup(group);
    setSelectedGroup(group);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    updateGroup(updatedGroup);
    setSelectedGroup(updatedGroup);
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
  };

  if (selectedGroup) {
    return (
      <GroupDetail
        group={selectedGroup}
        onUpdateGroup={handleUpdateGroup}
        onBackToGroups={handleBackToGroups}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 text-foreground">GroupWise</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Generate beautiful subgroups from your teams
          </p>
        </div>

        {/* Create Group Form */}
        <div className="animate-scale-in">
          <CreateGroupForm onCreateGroup={handleCreateGroup} />
        </div>

        {/* Groups List */}
        <div className="animate-fade-in">
          <GroupList groups={groups} onSelectGroup={handleSelectGroup} />
        </div>
      </div>
    </div>
  );
}
