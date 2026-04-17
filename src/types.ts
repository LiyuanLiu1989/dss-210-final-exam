export interface UserProfile {
  uid?: string;
  firstName: string;
  lastName: string;
  section: string;
  totalSolved: number;
  correctSolved: number;
  accuracy: number;
  timeSpent: number; // minutes
  lastActive: string;
  pin?: string;
  pinHint?: string;
}

export interface Question {
  id?: string;
  topic: string;
  content: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Submission {
  id?: string;
  userId: string;
  topic: string; // Changed from questionId to topic as we generate dynamically
  isCorrect: boolean;
  timestamp: string;
}

export interface Friendship {
  id?: string;
  uids: string[]; // [uid1, uid2]
  status: "pending" | "accepted";
  senderId: string;
  timestamp: string;
}

export interface GameSession {
  id?: string;
  players: {
    [uid: string]: {
      name: string;
      score: number;
      finished: boolean;
      answers: boolean[]; // array of isCorrect for the game session
    };
  };
  questions: Question[];
  status: "waiting" | "active" | "finished";
  activePlayerUids: string[];
  winnerId?: string | "draw";
  createdAt: string;
}
