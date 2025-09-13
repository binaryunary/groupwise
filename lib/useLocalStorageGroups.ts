'use client';

import { useEffect, useState } from 'react';
import { Group } from './types';

export function useLocalStorageGroups() {
  const [groups, setGroups] = useState<Group[]>([]);

  // Load groups from localStorage on component mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('groupwise-groups');
    if (savedGroups) {
      const parsedGroups = JSON.parse(savedGroups).map((group: any) => ({
        ...group,
        createdAt: new Date(group.createdAt)
      }));
      setGroups(parsedGroups);
    }
  }, []);

  // Save groups to localStorage whenever groups change
  useEffect(() => {
    localStorage.setItem('groupwise-groups', JSON.stringify(groups));
  }, [groups]);

  const addGroup = (group: Group) => {
    setGroups(prev => [...prev, group]);
  };

  const updateGroup = (updatedGroup: Group) => {
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const deleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  return {
    groups,
    addGroup,
    updateGroup,
    deleteGroup,
  };
}
