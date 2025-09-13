export interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
}

export interface Subgroup {
  members: string[];
}
