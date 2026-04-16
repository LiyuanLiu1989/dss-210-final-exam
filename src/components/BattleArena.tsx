import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  getDoc,
  setDoc,
  collection,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { Question, GameSession, UserProfile } from "../types";
import { generateSimilarQuestion } from "../services/geminiService";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { Loader2, Swords, Trophy, Target, ChevronRight, Check, X, ShieldAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface BattleArenaProps {
  userId: string;
  sessionId: string;
  onClose: () => void;
}

export default function BattleArena({ userId, sessionId, onClose }: BattleArenaProps) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = onSnapshot(doc(db, "game_sessions", sessionId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as GameSession;
        setSession(data);
        setLoading(false);
      } else {
        toast.error("Battle session not found.");
        onClose();
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  const handleAnswer = async () => {
    if (selectedOption === null || !session || submitting) return;
    setSubmitting(true);

    const question = session.questions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctOptionIndex;
    
    const updatedPlayers = { ...session.players };
    const player = updatedPlayers[userId];
    
    player.score += isCorrect ? 100 : 0;
    player.answers.push(isCorrect);
    
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= session.questions.length) {
      player.finished = true;
    }

    try {
      // Check if both finished
      const otherUid = session.activePlayerUids.find(id => id !== userId);
      const otherFinished = otherUid ? updatedPlayers[otherUid]?.finished : true;
      
      let nextStatus = session.status;
      let winnerId = session.winnerId;

      if (player.finished && otherFinished) {
        nextStatus = "finished";
        const otherScore = otherUid ? updatedPlayers[otherUid].score : 0;
        if (player.score > otherScore) {
          winnerId = userId;
        } else if (player.score < otherScore) {
          winnerId = otherUid;
        } else {
          winnerId = "draw";
        }
      }

      await updateDoc(doc(db, "game_sessions", sessionId), {
        players: updatedPlayers,
        status: nextStatus,
        winnerId: winnerId
      });

      // Also update user's timeSpent if they finished
      if (player.finished) {
        const endTime = Date.now();
        const durationMinutes = (endTime - startTime) / 60000;
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          await updateDoc(userRef, {
            timeSpent: (userData.timeSpent || 0) + durationMinutes,
            lastActive: new Date().toISOString()
          });
        }
      }

      setSelectedOption(null);
      if (!player.finished) {
        setCurrentQuestionIndex(nextIndex);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save answer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-sm font-bold text-slate-500">Entering the Stats Arena...</p>
      </div>
    );
  }

  if (!session) return null;

  const myData = session.players[userId];
  const otherUid = session.activePlayerUids.find(id => id !== userId);
  const opponentData = otherUid ? session.players[otherUid] : null;

  if (session.status === "finished") {
    const iWon = session.winnerId === userId;
    const isDraw = session.winnerId === "draw";

    return (
      <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
        <div className={`p-8 rounded-2xl border-2 ${iWon ? "bg-yellow-50 border-yellow-200" : isDraw ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200 shadow-sm"}`}>
          <div className="flex justify-center mb-6">
            {iWon ? (
              <div className="relative">
                <Trophy className="w-20 h-20 text-yellow-500" />
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-yellow-300 opacity-50" />
              </div>
            ) : isDraw ? (
              <Swords className="w-20 h-20 text-blue-500" />
            ) : (
              <Target className="w-20 h-20 text-slate-400" />
            )}
          </div>
          
          <h2 className="text-3xl font-black text-[#1e293b] mb-2">
            {iWon ? "VICTORY!" : isDraw ? "IT'S A DRAW!" : "TOUGH BATTLE!"}
          </h2>
          <p className="text-sm text-[#64748b] font-medium mb-8">
            {iWon ? "You mastered the stats and defeated your opponent." : "A balanced match of minds!"}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e8f0]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
              <p className="text-xl font-black text-blue-600">{myData.score}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e8f0]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Opponent</p>
              <p className="text-xl font-black text-red-600">{opponentData?.score || 0}</p>
            </div>
          </div>

          <Button onClick={onClose} className="bg-[#1e293b] hover:bg-slate-800 text-white font-bold px-8 py-6 rounded-xl">
            Return to Social Hub
          </Button>
        </div>
      </div>
    );
  }

  if (myData.finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="relative w-20 h-20 flex items-center justify-center bg-blue-50 rounded-full mb-2">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 absolute" />
          <Check className="w-8 h-8 text-blue-600 relative z-10" />
        </div>
        <h3 className="text-xl font-black text-[#1e293b]">Session Complete!</h3>
        <p className="text-sm text-[#64748b] max-w-xs leading-relaxed">
          Waiting for your opponent to finish their stats battle. Stay tuned for the final result!
        </p>
        <div className="w-full max-w-xs space-y-2 mt-4">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Opponent Progress</span>
            <span>{opponentData?.answers.length || 0} / {session.questions.length}</span>
          </div>
          <Progress value={((opponentData?.answers.length || 0) / session.questions.length) * 100} className="h-2 bg-slate-100" />
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1e293b] text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Swords className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Stats Battle</p>
            <p className="text-sm font-black">Question {currentQuestionIndex + 1} of {session.questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-slate-400">Opponent</p>
            <div className="flex items-center gap-1 justify-end">
               <span className="text-sm font-black text-red-400">{opponentData?.score || 0}</span>
               <div className="flex gap-0.5">
                  {opponentData?.answers.map((a, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${a ? "bg-green-500" : "bg-red-500"}`} />
                  ))}
               </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-slate-400">You</p>
            <p className="text-sm font-black text-green-400">{myData.score}</p>
          </div>
        </div>
      </div>

      <div className="high-density-card">
         <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">{currentQuestion.topic}</div>
         <div className="text-lg leading-relaxed text-[#1e293b] mb-10 font-bold">
            <ReactMarkdown>{currentQuestion.content}</ReactMarkdown>
         </div>

         <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`px-6 py-4 rounded-xl border-2 text-sm cursor-pointer transition-all flex items-center gap-4 ${
                  selectedOption === index 
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" 
                    : "border-[#e2e8f0] hover:border-blue-300 hover:bg-slate-50"
                }`}
                onClick={() => setSelectedOption(index)}
              >
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg border font-black text-xs ${
                  selectedOption === index ? "border-blue-300 bg-white" : "border-[#e2e8f0] bg-slate-50 text-slate-400"
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
              </div>
            ))}
         </div>

         <div className="mt-10">
            <Button 
              className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-black py-8 rounded-xl shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] gap-2"
              disabled={selectedOption === null || submitting}
              onClick={handleAnswer}
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Choice"}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
         </div>
      </div>
    </div>
  );
}
