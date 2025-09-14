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
    <div className="min-h-screen bg-background-secondary">
      {/* Native Navigation Bar */}
      <div className="nav-bar">
        <h1 className="title-1 text-foreground">GroupWise</h1>
      </div>

      <div className="px-4 pb-6">
        {/* Header */}
        <div className="text-center py-6 animate-fade-in">
          <p className="subhead text-muted-foreground">
            Generate beautiful subgroups from your teams
          </p>
        </div>

        {/* Create Group Form */}
        <div className="animate-scale-in">
          <CreateGroupForm onCreateGroup={handleCreateGroup} />
        </div>

        {/* Spacer */}
        <div style={{ height: '24px' }}></div>

        {/* Groups List */}
        <div className="animate-fade-in">
          <GroupList groups={groups} onSelectGroup={handleSelectGroup} />
        </div>
      </div>
    </div>
  );
}
