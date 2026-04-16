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
}

interface LeaderboardProps {
  isMini?: boolean;
  fullWidth?: boolean;
}

export default function Leaderboard({ isMini, fullWidth }: LeaderboardProps) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("correctSolved", "desc"),
      limit(isMini ? 5 : 10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push(doc.data() as LeaderboardEntry);
      });
      setLeaders(entries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isMini]);

  return (
    <div className={`space-y-6 ${fullWidth ? "w-full" : ""}`}>
      <div className="high-density-card">
        <div className="section-title">
          <span>Top Rankings</span>
          <Badge className="bg-red-100 text-red-700 text-[10px] uppercase font-bold">Live</Badge>
        </div>
        
        <div className="space-y-1">
          {leaders.map((leader, index) => (
            <div 
              key={leader.uid} 
              className="grid grid-cols-[24px_1fr_60px_50px] gap-2 py-3 border-b border-[#e2e8f0] last:border-0 items-center text-sm"
            >
              <div className="font-bold text-[#64748b]">{index + 1}</div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#1e293b] truncate">{leader.firstName} {leader.lastName}</span>
                {!isMini && <span className="text-[10px] text-[#64748b] uppercase font-bold">{leader.section}</span>}
              </div>
              <div className="text-right font-bold text-blue-600">
                {leader.correctSolved}
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-[10px] px-1 py-0 font-bold">
                  {Math.round(leader.accuracy)}%
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
