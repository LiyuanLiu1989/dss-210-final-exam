import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Trophy, Medal, Target, Zap } from "lucide-react";

interface LeaderboardEntry {
  uid: string;
  firstName: string;
  lastName: string;
  section: string;
  totalSolved: number;
  correctSolved: number;
  socialPoints: number;
  accuracy: number;
  timeSpent: number;
}

interface LeaderboardProps {
  isMini?: boolean;
  fullWidth?: boolean;
}

export default function Leaderboard({ isMini, fullWidth }: LeaderboardProps) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll fetch all users in the section (or top 50) and sort by combined XP
    const q = query(
      collection(db, "users"),
      orderBy("correctSolved", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push(doc.data() as LeaderboardEntry);
      });
      
      // XP = (Correct Solved * 5) + (Accuracy * 2) + (Time spent * 0.5) + Social Points
      const sorted = [...entries].sort((a, b) => {
        const xpA = (a.correctSolved || 0) * 10 + (a.accuracy || 0) * 5 + (a.timeSpent || 0) * 2 + (a.socialPoints || 0);
        const xpB = (b.correctSolved || 0) * 10 + (b.accuracy || 0) * 5 + (b.timeSpent || 0) * 2 + (b.socialPoints || 0);
        return xpB - xpA;
      });

      setLeaders(sorted.slice(0, 10));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isMini]);

  return (
    <div className={`space-y-6 ${fullWidth ? "w-full" : ""}`}>
      <div className="high-density-card">
        <div className="section-title">
          <span>Mastery Elite</span>
          <Badge className="bg-blue-600 text-white text-[10px] uppercase font-bold">Balanced Scoring</Badge>
        </div>
        
        <div className="space-y-1">
          {leaders.map((leader, index) => {
            const xp = Math.floor((leader.correctSolved || 0) * 10 + (leader.accuracy || 0) * 5 + (leader.timeSpent || 0) * 2 + (leader.socialPoints || 0));
            return (
              <div 
                key={leader.uid || `leader-${index}`} 
                className="grid grid-cols-[30px_1fr_60px] gap-2 py-4 border-b border-[#e2e8f0] last:border-0 items-center text-sm group"
              >
                <div className={`font-black italic flex items-center justify-center h-6 w-6 rounded-full text-[10px] ${
                  index === 0 ? "bg-amber-100 text-amber-600" :
                  index === 1 ? "bg-slate-100 text-slate-500" :
                  index === 2 ? "bg-orange-100 text-orange-600" : "text-slate-300"
                }`}>
                  #{index + 1}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#1e293b] truncate uppercase tracking-tighter text-base group-hover:text-blue-600 transition-colors">
                      {leader.firstName} {leader.lastName[0]}.
                    </span>
                    {leader.socialPoints > 30 && (
                       <Zap className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-base font-black text-blue-600 leading-none">{xp}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Power XP</div>
                </div>
              </div>
            );
          })}
          
          {leaders.length === 0 && !loading && (
            <div className="text-center py-8 text-[#64748b] text-xs italic">
              No rankings available yet.
            </div>
          )}
        </div>
        
        <div className="mt-4 text-[10px] text-[#64748b] italic">
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
