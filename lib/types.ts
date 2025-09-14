export interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
}

export interface Subgroup {
  id: string;
  members: string[];
  completed: boolean;
}

export interface SubgroupRound {
  id: string;
  roundNumber: number;
  subgroups: Subgroup[];
  completed: boolean;
}
