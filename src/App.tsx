/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Practice from "./components/Practice";
import Leaderboard from "./components/Leaderboard";
import Social from "./components/Social";
import BattleArena from "./components/BattleArena";
import { Toaster } from "./components/ui/sonner";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Settings, 
  LogOut, 
  Users, 
  Swords, 
  Check, 
  X 
} from "lucide-react";
import { db } from "./lib/firebase";
import { 
  onSnapshot, 
  collection, 
  query, 
  where, 
  doc, 
  getDoc, 
  getDocs,
  addDoc, 
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { GameSession, UserProfile, Question } from "./types";
import { generateSimilarQuestion, generateBatchQuestions } from "./services/geminiService";
import { toast } from "sonner";
import { Button } from "./components/ui/button";

type View = "dashboard" | "practice" | "leaderboard" | "social";

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [incomingInvite, setIncomingInvite] = useState<GameSession & { id: string } | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("statsMaster_userId");
    if (storedId) {
      setUserId(storedId);
      // Fetch user name for game sessions
      getDoc(doc(db, "users", storedId)).then(snap => {
        if (snap.exists()) setUserName(`${snap.data().firstName} ${snap.data().lastName}`);
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Listen for incoming battle invitations
    const q = query(
      collection(db, "game_sessions"),
      where("activePlayerUids", "array-contains", userId),
      where("status", "==", "waiting")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as GameSession & { id: string }))
        .filter(s => s.status === "waiting" && !s.players[userId].finished);
      
      // If someone else invited us
      const myInvite = invites.find(s => {
        const otherUid = s.activePlayerUids.find(id => id !== userId);
        return otherUid && s.players[otherUid].score === 0; // Simple logic: other player created it
      });

      if (myInvite && !activeBattleId) {
        setIncomingInvite(myInvite);
      } else {
        setIncomingInvite(null);
      }
    });

    return () => unsubscribe();
  }, [userId, activeBattleId]);

  const handleLogout = () => {
    localStorage.removeItem("statsMaster_userId");
    setUserId(null);
    setCurrentView("dashboard");
  };

  const handleChallenge = async (friendId: string, friendName: string) => {
    toast.loading("Finding questions in the bank...");
    try {
      // Pull questions from the bank
      const questionsSnap = await getDocs(collection(db, "questions"));
      let questions = questionsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any as Question));

      // Refill if empty
      if (questions.length < 3) {
        toast.info("Bank empty. Generating fresh battle problems...");
        const newBatch = await generateBatchQuestions(10);
        const savePromises = newBatch.map(q => addDoc(collection(db, "questions"), q));
        await Promise.all(savePromises);
        questions = newBatch;
      }

      // Select 3 random questions
      const selectedQuestions = questions
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const players = {
        [userId!]: { name: userName, score: 0, finished: false, answers: [] },
        [friendId]: { name: friendName, score: 0, finished: false, answers: [] }
      };

      const docRef = await addDoc(collection(db, "game_sessions"), {
        players,
        questions: selectedQuestions,
        status: "waiting",
        activePlayerUids: [userId!, friendId],
        createdAt: new Date().toISOString()
      });

      setActiveBattleId(docRef.id);
      toast.dismiss();
      toast.success("Ready for Battle!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to start battle.");
      console.error(error);
    }
  };

  const acceptInvite = async () => {
    if (!incomingInvite) return;
    try {
      await updateDoc(doc(db, "game_sessions", incomingInvite.id), {
        status: "active"
      });
      setActiveBattleId(incomingInvite.id);
      setIncomingInvite(null);
    } catch (error) {
      toast.error("Failed to join battle.");
    }
  };

  const rejectInvite = async () => {
    if (!incomingInvite) return;
    try {
      await deleteDoc(doc(db, "game_sessions", incomingInvite.id));
      setIncomingInvite(null);
    } catch (error) {
      toast.error("Failed to reject.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <GraduationCap className="w-16 h-16 text-primary mb-4" />
          <p className="text-slate-500 font-medium">Loading StatsMaster...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <>
        <Auth onLogin={(id) => setUserId(id)} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Invite Notification */}
      {incomingInvite && (
        <div className="absolute top-4 right-4 z-50 animate-in slide-in-from-right duration-500">
           <div className="bg-[#1e293b] text-white p-4 rounded-xl shadow-2xl border border-blue-500 flex items-center gap-4">
              <div className="bg-blue-500 rounded-full p-2">
                <Swords className="w-5 h-5" />
              </div>
              <div className="mr-4">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Incoming Challenge</p>
                <p className="text-sm font-black">Ready for a battle?</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8" onClick={acceptInvite}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" className="h-8" onClick={rejectInvite}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-[220px] bg-[#1e293b] text-white p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <GraduationCap className="w-6 h-6 text-blue-500" />
          <span className="font-extrabold text-lg tracking-tight">STATS.IO</span>
        </div>

        <nav className="flex-1 space-y-1">
          <div 
            className={`sidebar-nav-item flex items-center gap-3 ${currentView === "dashboard" ? "active" : ""}`}
            onClick={() => setCurrentView("dashboard")}
          >
            <LayoutDashboard className="w-4 h-4" />
            My Dashboard
          </div>
          <div 
            className={`sidebar-nav-item flex items-center gap-3 ${currentView === "practice" ? "active" : ""}`}
            onClick={() => setCurrentView("practice")}
          >
            <BookOpen className="w-4 h-4" />
            Practice Arena
          </div>
          <div 
            className={`sidebar-nav-item flex items-center gap-3 ${currentView === "social" ? "active" : ""}`}
            onClick={() => setCurrentView("social")}
          >
            <Users className="w-4 h-4" />
            Social Hub
          </div>
          <div 
            className={`sidebar-nav-item flex items-center gap-3 ${currentView === "leaderboard" ? "active" : ""}`}
            onClick={() => setCurrentView("leaderboard")}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </div>
        </nav>

        <div className="mt-auto space-y-1">
          <div className="sidebar-nav-item flex items-center gap-3">
            <Settings className="w-4 h-4" />
            Settings
          </div>
          <div 
            className="sidebar-nav-item flex items-center gap-3 text-red-400 hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-5 relative">
        <div className="max-w-[1200px] mx-auto">
          {activeBattleId ? (
            <div className="max-w-2xl mx-auto">
              <BattleArena 
                userId={userId!} 
                sessionId={activeBattleId} 
                onClose={() => setActiveBattleId(null)} 
              />
            </div>
          ) : (
            <>
              {currentView === "dashboard" && (
                <Dashboard 
                  userId={userId}
                  onStartPractice={() => setCurrentView("practice")}
                  onViewLeaderboard={() => setCurrentView("leaderboard")}
                />
              )}
              
              {(currentView === "practice" || currentView === "leaderboard" || currentView === "social") && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
                  <div className="space-y-5">
                    {currentView === "practice" && <Practice userId={userId} />}
                    {currentView === "leaderboard" && <Leaderboard fullWidth />}
                    {currentView === "social" && <Social userId={userId} onChallenge={handleChallenge} />}
                  </div>
                  
                  <aside className="space-y-5">
                    {/* Consistent Sidebar Widgets */}
                    <Leaderboard isMini />
                    <div className="high-density-card">
                      <div className="section-title">Class Tip</div>
                      <p className="text-[11px] text-[#64748b] leading-relaxed">
                        Practice standard deviation problems carefully—they usually carry more weight in the final exam!
                      </p>
                    </div>
                  </aside>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Toaster position="top-center" />
    </div>
  );
}
