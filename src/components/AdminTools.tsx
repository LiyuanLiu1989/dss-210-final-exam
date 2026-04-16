import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { generateBatchQuestions } from "../services/geminiService";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Database, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function AdminTools() {
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState(0);

  const seedBank = async (totalTarget: number) => {
    setSeeding(true);
    setProgress(0);
    const batchSize = 10;
    const iterations = Math.ceil(totalTarget / batchSize);

    try {
      for (let i = 0; i < iterations; i++) {
        toast.info(`Generating Batch ${i + 1}/${iterations}...`);
        const newBatch = await generateBatchQuestions(batchSize);
        
        const savePromises = newBatch.map(q => addDoc(collection(db, "questions"), q));
        await Promise.all(savePromises);
        
        setProgress(Math.round(((i + 1) / iterations) * 100));
      }
      toast.success(`Successfully added ${totalTarget} questions to the bank!`);
    } catch (error) {
      toast.error("Seeding failed midway. Check console.");
      console.error(error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="high-density-card border-amber-200 bg-amber-50/30 mt-8">
      <div className="section-title border-amber-200 text-amber-800 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Admin Power Tools
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Database className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-amber-900">Question Bank Seeding</h4>
            <p className="text-[11px] text-amber-700/80 leading-relaxed mb-3">
              Efficiently batch-generate questions using Gemini 2.0 Flash. This saves tokens by generating 10 at once.
            </p>
            
            {seeding ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-amber-700 tracking-widest">
                  <span>Refilling Stock...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-amber-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-[9px] text-amber-600 italic">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Communicating with Gemini API for Batch...
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-amber-600 hover:bg-amber-700 font-bold h-8 text-[11px]"
                  onClick={() => seedBank(50)}
                >
                  Seed 50 Questions
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-amber-600 text-amber-700 font-bold h-8 text-[11px] hover:bg-amber-100"
                  onClick={() => seedBank(20)}
                >
                  Seed 20
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-amber-100/50 rounded border border-amber-200 text-[10px] text-amber-700 font-medium italic">
          <AlertCircle className="w-3 h-3" />
          Note: This uses real Gemini API tokens. Use sparingly for production setup.
        </div>
      </div>
    </div>
  );
}
