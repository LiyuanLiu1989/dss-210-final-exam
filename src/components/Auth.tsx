import { useState } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { toast } from "sonner";
import { UserProfile } from "../types";
import { GraduationCap } from "lucide-react";

interface AuthProps {
  onLogin: (userId: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [foundUser, setFoundUser] = useState<{ id: string; data: UserProfile } | null>(null);

  const handleInitialCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    
    setLoading(true);
    const fNameInput = firstName.trim();
    const lNameInput = lastName.trim();
    
    try {
      const timeoutId = setTimeout(() => {
        setLoading(false);
        toast.error("Searching is slower than usual. You can try to register as a new user if you don't have an account yet.", { 
          id: "auth-timeout",
          duration: 6000 
        });
      }, 10000);

      // Query by firstName first - targeted query is more reliable than listing all
      const q = query(
        collection(db, "users"), 
        where("firstName", "==", fNameInput)
      );
      
      const querySnapshot = await getDocs(q);
      clearTimeout(timeoutId);
      toast.dismiss("auth-timeout");
      
      // Filter in memory for case-insensitive lastName match
      const userDoc = querySnapshot.docs.find(doc => {
        const data = doc.data();
        const dbLast = (data.lastName || "").toLowerCase();
        return dbLast === lNameInput.toLowerCase();
      });
      
      if (userDoc) {
        setFoundUser({ id: userDoc.id, data: userDoc.data() as UserProfile });
      } else {
        setIsNewUser(true);
        toast.info("No account found with this exact name. Please register as a new user below.");
      }
    } catch (error: any) {
      const wrappedError = handleFirestoreError(error, OperationType.LIST, "users");
      console.error("Auth check failed:", wrappedError);
      toast.error(`Connection Error: ${error.message || "Please check your internet and try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!section) {
      toast.error("Please select a section");
      return;
    }
    
    setLoading(true);
    const timeoutId = setTimeout(() => {
      // Don't disable loading here yet, just warn
      toast.error("Connecting to server... We will proceed shortly if possible.", { id: "reg-waiting" });
    }, 8000);

    try {
      console.log("Starting registration for:", firstName, lastName);
      const newUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        section: section,
        totalSolved: 0,
        correctSolved: 0,
        accuracy: 0,
        lastActive: new Date().toISOString()
      };
      
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userRef = doc(db, "users", newUserId);
      
      // OPTIMISTIC WRITE: Don't await the network confirmation
      setDoc(userRef, newUser).catch(writeErr => {
        console.warn("Background sync for registration pending:", writeErr);
      });
      
      console.log("Registration process moving forward optimistically for:", newUserId);
      
      clearTimeout(timeoutId);
      toast.dismiss("reg-waiting");
      
      localStorage.setItem("statsMaster_userId", newUserId);
      
      // Move to next state immediately
      onLogin(newUserId);
      toast.success(`Welcome to StatsMaster, ${firstName}!`, { id: "reg-success" });
    } catch (error: any) {
      clearTimeout(timeoutId);
      const wrappedError = handleFirestoreError(error, OperationType.WRITE, "users");
      toast.error("Could not register. Please try again.");
      console.error(wrappedError);
      setLoading(false);
    } finally {
      // We don't always want to set loading to false here because onLogin might unmount us
    }
  };

  const handleConfirmLogin = () => {
    if (foundUser) {
      localStorage.setItem("statsMaster_userId", foundUser.id);
      onLogin(foundUser.id);
      toast.success(`Welcome back, ${foundUser.data.firstName}!`);
    }
  };

  const reset = () => {
    setIsNewUser(false);
    setFoundUser(null);
    setFirstName("");
    setLastName("");
    setSection("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-3 md:p-6">
      <Card className="w-full max-w-[360px] md:max-w-md high-density-card">
        <CardHeader className="text-center p-4 md:p-6">
          <div className="mx-auto bg-blue-600 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2 md:mb-4 shadow-lg shadow-blue-200">
            <GraduationCap className="text-white w-6 h-6 md:w-7 md:h-7" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-black text-[#1e293b]">StatsMaster</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {foundUser 
              ? "Verify your identity" 
              : isNewUser 
                ? "Complete your registration" 
                : "Enter your name to start practicing"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          {!foundUser && !isNewUser && (
            <form onSubmit={handleInitialCheck} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jane" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6" disabled={loading}>
                {loading ? "Checking..." : "Continue"}
              </Button>
              {loading && (
                <p className="text-[10px] text-center text-slate-400 animate-pulse uppercase font-extrabold tracking-tighter">
                  Handshaking with database...
                </p>
              )}
              {!loading && firstName && lastName && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-center text-slate-400 mb-2 uppercase font-bold">Stuck or new user?</p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsNewUser(true)} 
                    className="w-full text-blue-600 text-[10px] font-black uppercase tracking-widest h-8"
                  >
                    Register New Account Instead
                  </Button>
                </div>
              )}
            </form>
          )}

          {foundUser && (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-top-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-1">Verify Identity</p>
                <p className="text-lg font-bold text-slate-900">
                  {foundUser.data.firstName} {foundUser.data.lastName}
                </p>
                <p className="text-xs text-[#64748b] bg-white w-fit mx-auto px-2 py-0.5 rounded-full mt-2 font-bold shadow-sm">
                  {foundUser.data.section}
                </p>
              </div>
              
              <div className="px-2 space-y-4">
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Is this you? Click below to load your progress.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleConfirmLogin} 
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6"
                  >
                    Yes, it's me
                  </Button>
                  <Button variant="ghost" onClick={reset} className="w-full text-slate-500 text-xs">
                    Not you? Change Name
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isNewUser && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="grid grid-cols-2 gap-4 opacity-50">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={firstName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={lastName} disabled />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section">Select your Section</Label>
                <Select value={section} onValueChange={setSection} required>
                  <SelectTrigger id="section" className="py-6 border-[#e2e8f0]">
                    <SelectValue placeholder="Choose a section..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Section D01">Section D01</SelectItem>
                    <SelectItem value="Section D02">Section D02</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6" disabled={loading}>
                  {loading ? "Registering..." : "Create Account"}
                </Button>
                <Button variant="ghost" onClick={reset} className="w-full mt-2 text-slate-400 text-xs">
                  Go back
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
