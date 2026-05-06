import { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { UserProfile } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { BookOpen, Trophy, Target, LogOut, User as UserIcon } from "lucide-react";

interface DashboardProps {
  userId: string;
  onStartPractice: () => void;
  onViewLeaderboard: () => void;
  onOpenStudyGuide: () => void;
}

export default function Dashboard({ userId, onStartPractice, onViewLeaderboard, onOpenStudyGuide }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, "users", userId), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
      } else {
        console.warn("User profile not found in sync");
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    });

    return () => unsubscribe();
  }, [userId]);

  const refreshProfile = async () => {
    if (!userId) return;
    try {
      const snap = await getDoc(doc(db, "users", userId));
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
    } catch (e) {
      console.error("Manual refresh failed:", e);
    }
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-white rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent" />
        <div className="relative flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-slate-600 font-extrabold text-lg">Fetching your stats...</p>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Establishing secure connection</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[10px] font-bold text-blue-600 underline"
            onClick={refreshProfile}
          >
            Click here if taking too long
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-full">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1e293b]">Welcome, {profile.firstName}!</h1>
            <p className="text-[#64748b] text-sm font-medium">{profile.section}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        <div className="stat-box high-density-card flex flex-col items-center justify-center py-4 md:py-8">
          <div className="text-xl md:text-2xl font-black text-[#1e293b]">{profile.totalSolved}</div>
          <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#64748b] mt-1 md:mt-2">Total Solved</div>
        </div>

        <div className="stat-box high-density-card flex flex-col items-center justify-center py-4 md:py-8">
          <div className="text-xl md:text-2xl font-black text-[#1e293b]">{Math.round(profile.accuracy)}%</div>
          <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#64748b] mt-1 md:mt-2">Accuracy</div>
        </div>

        <div className="stat-box high-density-card flex flex-col items-center justify-center py-4 md:py-8">
          <div className="text-xl md:text-2xl font-black text-[#1e293b]">{profile.correctSolved}</div>
          <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#64748b] mt-1 md:mt-2">Correct</div>
        </div>

        <div className="stat-box high-density-card flex flex-col items-center justify-center py-4 md:py-8">
          <div className="text-xl md:text-2xl font-black text-blue-600">{Math.floor(profile.timeSpent || 0)}m</div>
          <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#64748b] mt-1 md:mt-2">Time Spent</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="high-density-card hover:border-blue-500 transition-colors cursor-pointer group flex flex-col" 
          onClick={onOpenStudyGuide}
        >
          <div className="section-title">Reference Bank</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-xl group-hover:bg-purple-100 transition-colors">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Study Guide</h3>
              <p className="text-sm text-[#64748b]">Review master formulas and definitions</p>
            </div>
          </div>
          <Button variant="outline" className="mt-auto border-purple-600 text-purple-700 hover:bg-purple-50 font-bold">Open Guide</Button>
        </div>

        <div 
          className="high-density-card hover:border-blue-500 transition-colors cursor-pointer group flex flex-col" 
          onClick={onStartPractice}
        >
          <div className="section-title">Practice Arena</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Start Practice</h3>
              <p className="text-sm text-[#64748b]">Solve specific exam worksheet problems</p>
            </div>
          </div>
          <Button className="mt-auto bg-blue-600 hover:bg-blue-700 font-bold">Start Session</Button>
        </div>

        <div 
          className="high-density-card hover:border-blue-500 transition-colors cursor-pointer group flex flex-col" 
          onClick={onViewLeaderboard}
        >
          <div className="section-title">Global Rankings</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-xl group-hover:bg-yellow-100 transition-colors">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Leaderboard</h3>
              <p className="text-sm text-[#64748b]">Compare your scores with classmates</p>
            </div>
          </div>
          <Button variant="outline" className="mt-auto border-[#1e293b] text-[#1e293b] hover:bg-slate-50 font-bold">View Rankings</Button>
        </div>
      </div>
    </div>
  );
}
