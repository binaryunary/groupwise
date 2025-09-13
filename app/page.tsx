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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">GroupWise</h1>
          <p className="text-muted-foreground">
            Generate subgroups from your teams
          </p>
        </div>

        {/* Create Group Form */}
        <div className="mb-6">
          <CreateGroupForm onCreateGroup={handleCreateGroup} />
        </div>

        {/* Groups List */}
        <GroupList groups={groups} onSelectGroup={handleSelectGroup} />
      </div>
    </div>
  );
}
