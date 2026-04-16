import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, doc, updateDoc, getDoc, getDocs, limit, query } from "firebase/firestore";
import { generateBatchQuestions, Question } from "../services/geminiService";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, ArrowRight, BookOpen, Database } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface PracticeProps {
  userId: string;
}

export default function Practice({ userId }: PracticeProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [bankSize, setBankSize] = useState(0);
  const [isBulkRefilling, setIsBulkRefilling] = useState(false);
  const [refillProgress, setRefillProgress] = useState(0);

  const fetchNewQuestion = async (forceBulk: boolean = false) => {
    if (forceBulk) setIsBulkRefilling(true);
    setLoading(true);
    setSelectedOption(null);
    setSubmitted(false);
    setShowExplanation(false);
    setStartTime(Date.now());
    
    try {
      // 1. Check if we have questions in the bank
      const qSnap = await getDocs(collection(db, "questions"));
      let questions = qSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any as Question));
      
      // 2. If bank is low OR forceBulk is requested
      if (questions.length < 5 || forceBulk) {
        const target = forceBulk ? 50 : 10;
        setRefillProgress(0);
        
        // Use batches to avoid timeouts (batches of 10)
        const batchSize = 10;
        const iterations = Math.ceil(target / batchSize);
        
        for(let i=0; i<iterations; i++) {
          const newBatch = await generateBatchQuestions(batchSize);
          const savePromises = newBatch.map(q => addDoc(collection(db, "questions"), q));
          await Promise.all(savePromises);
          setRefillProgress(Math.round(((i + 1) / iterations) * 100));
        }
        
        // Refetch after saving
        const refreshedSnap = await getDocs(collection(db, "questions"));
        questions = refreshedSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any as Question));
        toast.success(`Successfully added questions to the class bank!`);
      }
      
      setBankSize(questions.length);

      if (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestion(questions[randomIndex]);
      }
    } catch (error) {
      toast.error("Failed to fetch questions. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setIsBulkRefilling(false);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const handleSubmit = async () => {
    if (selectedOption === null || !question || !userId) return;

    const isCorrect = selectedOption === question.correctOptionIndex;
    setSubmitted(true);
    const endTime = Date.now();
    const sessionMinutes = (endTime - startTime) / 60000;

    try {
      await addDoc(collection(db, "submissions"), {
        userId: userId,
        topic: question.topic,
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

  if (loading && !question) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-[#64748b] font-bold italic mb-4">
          {isBulkRefilling ? "Building Statistics Question Bank..." : "Scanning Question Bank..."}
        </p>
        {isBulkRefilling && (
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-blue-600 tracking-widest">
              <span>Generating Problems</span>
              <span>{refillProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${refillProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-6">
      <div className="high-density-card">
        <div className="section-title flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{question.topic}</span>
            <Badge variant={question.difficulty === "easy" ? "secondary" : question.difficulty === "medium" ? "default" : "destructive"} className="text-[10px] uppercase font-bold">
              {question.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Database className="w-3 h-3" />
            Bank: {bankSize}
            <Button 
              variant="ghost" 
              className="h-5 px-1 ml-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => fetchNewQuestion(true)}
              title="Seed 50 more questions"
            >
              <ArrowRight className="w-2 h-2 rotate-90" />
              +50
            </Button>
          </div>
        </div>
        
        <div className="text-lg leading-relaxed text-[#1e293b] mb-8 font-medium">
          <ReactMarkdown>{question.content}</ReactMarkdown>
        </div>

        <div className="grid gap-2">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`px-4 py-3 rounded-lg border text-sm cursor-pointer transition-all flex items-center gap-3 ${
                selectedOption === index 
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold" 
                  : "border-[#e2e8f0] hover:border-blue-300 hover:bg-slate-50"
              } ${
                submitted && index === question.correctOptionIndex
                  ? "border-green-500 bg-green-50 text-green-700 font-bold"
                  : submitted && selectedOption === index && index !== question.correctOptionIndex
                  ? "border-red-500 bg-red-50 text-red-700 font-bold"
                  : ""
              }`}
              onClick={() => !submitted && setSelectedOption(index)}
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {submitted && index === question.correctOptionIndex && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
              {submitted && selectedOption === index && index !== question.correctOptionIndex && (
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
                onClick={() => fetchNewQuestion()}
              >
                Next Problem
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
            <ReactMarkdown>{question.explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
