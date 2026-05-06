import { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, limit, onSnapshot, getDocs } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Trophy, Medal, Target, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

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
  const [error, setError] = useState<string | null>(null);

  const fetchLeaders = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "users"), limit(100));
      const snapshot = await getDocs(q);
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push({ uid: doc.id, ...doc.data() } as LeaderboardEntry);
      });
      
      const sorted = [...entries].sort((a, b) => {
        const xpA = (a.correctSolved || 0) * 10 + (a.accuracy || 0) * 5 + (a.timeSpent || 0) * 2 + (a.socialPoints || 0);
        const xpB = (b.correctSolved || 0) * 10 + (b.accuracy || 0) * 5 + (b.timeSpent || 0) * 2 + (b.socialPoints || 0);
        return xpB - xpA;
      });

      setLeaders(sorted.slice(0, 10));
    } catch (err) {
      console.error("Manual leaderboard fetch error:", err);
      setError("Connection issue. Please try deep refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      limit(200)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push({ uid: doc.id, ...doc.data() } as LeaderboardEntry);
      });
      
      const sorted = [...entries].sort((a, b) => {
        const xpA = (a.correctSolved || 0) * 10 + (a.accuracy || 0) * 5 + (a.timeSpent || 0) * 2 + (a.socialPoints || 0);
        const xpB = (b.correctSolved || 0) * 10 + (b.accuracy || 0) * 5 + (b.timeSpent || 0) * 2 + (b.socialPoints || 0);
        return xpB - xpA;
      });

      setLeaders(sorted.slice(0, 10));
      setLoading(false);
      setError(null);
    }, (err) => {
      console.warn("Leaderboard live sync failed, using fallback mode.", err);
      setError("Live sync limited. Use refresh button below.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`space-y-6 ${fullWidth ? "w-full" : ""}`}>
      <div className="high-density-card">
        <div className="section-title">
          <span>Mastery Elite</span>
          <Badge className="bg-blue-600 text-white text-[10px] uppercase font-bold">Balanced Scoring</Badge>
        </div>
        
        <div className="space-y-1">
          {loading && leaders.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 opacity-50">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hydrating Leaderboard</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-2">
              <p className="text-[10px] text-red-600 font-bold leading-tight uppercase tracking-tight">{error}</p>
            </div>
          )}

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
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-[10px] text-[#64748b] italic">
            Auto-sync active
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-[10px] uppercase font-bold text-blue-600 gap-1 hover:bg-blue-50"
            onClick={fetchLeaders}
            disabled={loading}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Force Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
