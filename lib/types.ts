export interface Contest {
  id: string;
  platform: string;
  name: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  durationSeconds: number;
  url: string;
}

// Utility type for partial contest data during fetch
export type PartialContest = Omit<Contest, 'id'> & { id?: string };
