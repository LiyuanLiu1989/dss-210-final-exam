import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
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
}

export default function Dashboard({ userId, onStartPractice, onViewLeaderboard }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  if (!profile) return null;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="stat-box high-density-card flex flex-col items-center justify-center py-8">
          <div className="text-3xl font-black text-[#1e293b]">{profile.totalSolved}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mt-2">Total Solved</div>
        </div>

        <div className="stat-box high-density-card flex flex-col items-center justify-center py-8">
          <div className="text-3xl font-black text-[#1e293b]">{Math.round(profile.accuracy)}%</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mt-2">Accuracy</div>
        </div>

        <div className="stat-box high-density-card flex flex-col items-center justify-center py-8">
          <div className="text-3xl font-black text-[#1e293b]">{profile.correctSolved}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mt-2">Correct Answers</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="high-density-card hover:border-blue-500 transition-colors cursor-pointer group flex flex-col" 
          onClick={onStartPractice}
        >
          <div className="section-title">Practice Arena</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Start Practice</h3>
              <p className="text-sm text-[#64748b]">Generate new problems based on exam topics</p>
            </div>
          </div>
          <Button className="mt-auto bg-blue-600 hover:bg-blue-700 font-bold">Start Now</Button>
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
              <p className="text-sm text-[#64748b]">See how you rank against your classmates</p>
            </div>
          </div>
          <Button variant="outline" className="mt-auto border-blue-600 text-blue-700 hover:bg-blue-50 font-bold">View Rankings</Button>
        </div>
      </div>
    </div>
  );
}
