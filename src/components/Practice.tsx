import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { Question } from "../types";
import { STATIC_QUESTIONS } from "../staticQuestions";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, ArrowRight, Database, RefreshCcw, Award } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface PracticeProps {
  userId: string;
  assignmentData?: {
    id: string;
    questionIndices: number[];
  };
  onCompleteAssignment?: () => void;
}

export default function Practice({ userId, assignmentData, onCompleteAssignment }: PracticeProps) {
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [sessionScore, setSessionScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    startNewSession();
  }, [assignmentData]);

  const startNewSession = () => {
    setLoading(true);
    setCompleted(false);
    setSessionScore(0);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setShowExplanation(false);
    
    if (assignmentData) {
      // Use specifically assigned questions
      const assigned = assignmentData.questionIndices.map(idx => STATIC_QUESTIONS[idx]);
      setSessionQuestions(assigned);
    } else {
      // Pick 20 unique random questions
      const shuffled = [...STATIC_QUESTIONS].sort(() => 0.5 - Math.random());
      setSessionQuestions(shuffled.slice(0, 20));
    }
    setStartTime(Date.now());
    setLoading(false);
  };

  const currentQuestion = sessionQuestions[currentIndex];

  const handleSubmit = async () => {
    if (selectedOption === null || !currentQuestion || !userId) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    setSubmitted(true);
    if (isCorrect) setSessionScore(prev => prev + 1);

    const endTime = Date.now();
    const sessionMinutes = (endTime - startTime) / 60000;

    try {
      await addDoc(collection(db, "submissions"), {
        userId: userId,
        topic: currentQuestion.topic,
        isCorrect,
        timestamp: new Date().toISOString()
      });

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const newTotal = (data.totalSolved || 0) + 1;
        const newCorrect = (data.correctSolved || 0) + (isCorrect ? 1 : 0);
        const newTimeSpent = (data.timeSpent || 0) + sessionMinutes;
        
        await updateDoc(userRef, {
          totalSolved: newTotal,
          correctSolved: newCorrect,
          accuracy: (newCorrect / newTotal) * 100,
          timeSpent: newTimeSpent,
          lastActive: new Date().toISOString()
        });
      }

      if (isCorrect) {
        toast.success("Correct answer!");
      } else {
        toast.error("Incorrect answer.");
      }
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  const handleFinish = async () => {
    if (assignmentData) {
      try {
        // Complete the assignment
        const assignmentRef = doc(db, "assignments", assignmentData.id);
        const assignmentSnap = await getDoc(assignmentRef);
        
        if (assignmentSnap.exists()) {
          const ad = assignmentSnap.data();
          const fromId = ad.fromId;
          const toId = ad.toId;
          const points = ad.pointsValue || 50;

          // Award points to BOTH Friend A and Friend B
          const fromUserRef = doc(db, "users", fromId);
          const toUserRef = doc(db, "users", toId);

          const fromSnap = await getDoc(fromUserRef);
          const toSnap = await getDoc(toUserRef);

          if (fromSnap.exists()) {
            await updateDoc(fromUserRef, {
              socialPoints: (fromSnap.data().socialPoints || 0) + points
            });
          }
          if (toSnap.exists()) {
            await updateDoc(toUserRef, {
              socialPoints: (toSnap.data().socialPoints || 0) + points
            });
          }

          // Mark assignment as completed
          await updateDoc(assignmentRef, { status: "completed" });
          
          toast.success(`Social achievement! You and your friend both earned ${points} bonus points!`);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setCompleted(true);
    if (onCompleteAssignment) onCompleteAssignment();
  };

  const handleNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setSubmitted(false);
      setShowExplanation(false);
      setStartTime(Date.now());
    } else {
      handleFinish();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-[#64748b] font-bold italic">Preparing Session...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <Award className="w-12 h-12 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1e293b] uppercase tracking-tight">Session Complete!</h2>
          <p className="text-slate-500 font-medium">You finished your practice set of 20 questions.</p>
        </div>
        
        <div className="bg-white border-4 border-[#1e293b] p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</div>
          <div className="text-6xl font-black text-blue-600">{sessionScore} / 20</div>
          <div className="text-sm font-bold text-slate-500 mt-2">({(sessionScore / 20 * 100).toFixed(0)}% Accuracy)</div>
        </div>

        <Button 
          onClick={startNewSession}
          className="bg-[#1e293b] hover:bg-slate-800 text-white font-black py-8 px-12 text-lg rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
        >
          <RefreshCcw className="w-5 h-5 mr-3" />
          Start New Practice
        </Button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question</span>
          <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full">{currentIndex + 1} / 20</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-black text-green-600 uppercase tracking-widest">Score: {sessionScore}</div>
        </div>
      </div>

      <div className="high-density-card">
        <div className="section-title flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{currentQuestion.topic}</span>
            <Badge variant={currentQuestion.difficulty === "easy" ? "secondary" : currentQuestion.difficulty === "medium" ? "default" : "destructive"} className="text-[10px] uppercase font-bold">
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Database className="w-3 h-3" />
            Pool: {STATIC_QUESTIONS.length}
          </div>
        </div>
        
        <div className="text-lg leading-relaxed text-[#1e293b] mb-8 font-medium">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {currentQuestion.content}
          </ReactMarkdown>
        </div>

        <div className="grid gap-2">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`px-4 py-3 rounded-lg border text-sm cursor-pointer transition-all flex items-center gap-3 ${
                selectedOption === index 
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold" 
                  : "border-[#e2e8f0] hover:border-blue-300 hover:bg-slate-50"
              } ${
                submitted && index === currentQuestion.correctOptionIndex
                  ? "border-green-500 bg-green-50 text-green-700 font-bold"
                  : submitted && selectedOption === index && index !== currentQuestion.correctOptionIndex
                  ? "border-red-500 bg-red-50 text-red-700 font-bold"
                  : ""
              }`}
              onClick={() => !submitted && setSelectedOption(index)}
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {submitted && index === currentQuestion.correctOptionIndex && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
              {submitted && selectedOption === index && index !== currentQuestion.correctOptionIndex && (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          {!submitted ? (
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold py-6" 
              disabled={selectedOption === null}
              onClick={handleSubmit}
            >
              Submit Answer
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1 border-blue-600 text-blue-700 font-bold py-6"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold py-6"
                onClick={handleNext}
              >
                {currentIndex < sessionQuestions.length - 1 ? "Next Question" : "Finish Session"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {submitted && showExplanation && (
        <div className="high-density-card bg-blue-50/50 border-blue-100">
          <div className="section-title text-blue-600">Detailed Explanation</div>
          <div className="text-sm text-blue-900 leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkMath]} 
              rehypePlugins={[rehypeKatex]}
            >
              {currentQuestion.explanation}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
