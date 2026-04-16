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
    // Sort primarily by timeSpent (effort) 
    // and secondary accuracy on client
    const q = query(
      collection(db, "users"),
      orderBy("timeSpent", "desc"),
      limit(isMini ? 10 : 20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push(doc.data() as LeaderboardEntry);
      });
      
      // Secondary sort: Accuracy for those with similar time spent
      const sorted = [...entries].sort((a, b) => {
        if (Math.abs(b.timeSpent - a.timeSpent) > 0.1) return b.timeSpent - a.timeSpent;
        return b.accuracy - a.accuracy;
      });

      setLeaders(sorted.slice(0, isMini ? 5 : 10));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isMini]);

  return (
    <div className={`space-y-6 ${fullWidth ? "w-full" : ""}`}>
      <div className="high-density-card">
        <div className="section-title">
          <span>Stats Masters</span>
          <Badge className="bg-red-100 text-red-700 text-[10px] uppercase font-bold">Top Effort</Badge>
        </div>
        
        <div className="space-y-1">
          {leaders.map((leader, index) => (
            <div 
              key={leader.uid} 
              className="grid grid-cols-[30px_1fr_40px] gap-2 py-3 border-b border-[#e2e8f0] last:border-0 items-center text-sm"
            >
              <div className="font-black text-blue-600/50 italic">#{index + 1}</div>
              <div className="flex flex-col">
                <span className="font-bold text-[#1e293b] truncate uppercase tracking-tight">
                  {leader.firstName} {leader.lastName[0]}.
                </span>
                {!isMini && <span className="text-[9px] text-[#64748b] font-black uppercase">{leader.section}</span>}
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-[10px] px-1 py-0 font-bold border-blue-100 text-blue-600 bg-blue-50">
                   {Math.floor(leader.timeSpent || 0)}m
                </Badge>
              </div>
            </div>
          ))}
          
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
