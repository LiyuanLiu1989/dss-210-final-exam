import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
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

interface AuthProps {
  onLogin: (userId: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [section, setSection] = useState("");
  const [pin, setPin] = useState("");
  const [pinHint, setPinHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [foundUser, setFoundUser] = useState<{ id: string; data: UserProfile } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleInitialCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    
    setLoading(true);
    const fName = firstName.trim();
    const lName = lastName.trim();
    
    try {
      const q = query(
        collection(db, "users"), 
        where("firstName", "==", fName),
        where("lastName", "==", lName)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setFoundUser({ id: userDoc.id, data: userDoc.data() as UserProfile });
      } else {
        setIsNewUser(true);
        toast.info("No account found. Please select your section to create one.");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
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
    try {
      if (pin.length !== 4) {
        toast.error("PIN must be exactly 4 digits");
        return;
      }

      const newUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        section: section,
        pin: pin,
        pinHint: pinHint.trim(),
        totalSolved: 0,
        correctSolved: 0,
        accuracy: 0,
        lastActive: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, "users"), newUser);
      localStorage.setItem("statsMaster_userId", docRef.id);
      onLogin(docRef.id);
      toast.success(`Welcome, ${firstName}!`);
    } catch (error: any) {
      toast.error("Failed to create profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLogin = () => {
    if (foundUser) {
      if (foundUser.data.pin && pin !== foundUser.data.pin) {
        toast.error("Incorrect PIN. Please try again.");
        return;
      }

      // If legacy user without PIN, let them through or force PIN?
      // For now, if no pin is in DB, let them in (they will set it on next active)
      // but ideally we should handle legacy users.

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
    setPin("");
    setPinHint("");
    setShowHint(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md high-density-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-[#1e293b]">StatsMaster</CardTitle>
          <CardDescription>
            {foundUser 
              ? "Verify your identity" 
              : isNewUser 
                ? "Complete your registration" 
                : "Enter your name to start practicing"}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="space-y-2 text-left">
                  <Label htmlFor="pin-login">Enter 4-Digit PIN</Label>
                  <Input 
                    id="pin-login"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-[1em] py-8"
                  />
                </div>

                {foundUser.data.pinHint && (
                  <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-center animate-in zoom-in-95 duration-300">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Your PIN Hint</p>
                    <p className="text-sm font-bold text-slate-700">"{foundUser.data.pinHint}"</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleConfirmLogin} 
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6"
                    disabled={pin.length !== 4}
                  >
                    Confirm & Login
                  </Button>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" onClick={reset} className="w-full text-slate-500 text-xs">
                      Not you? Change Name
                    </Button>
                    <button 
                      onClick={() => toast.info("Forgot your PIN? Please contact your Section Instructor to verify your identity and reset your account.", { 
                        duration: 6000,
                        icon: "🔒" 
                      })}
                      className="text-[10px] text-blue-500 hover:underline font-bold uppercase tracking-widest"
                    >
                      Forgot PIN?
                    </button>
                  </div>
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

              <div className="space-y-2">
                <Label htmlFor="pin-reg">Set a 4-Digit PIN</Label>
                <Input 
                  id="pin-reg"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-[1em] py-8"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin-hint">PIN Hint (Optional)</Label>
                <Input 
                  id="pin-hint"
                  placeholder="e.g. My birth month or Favorite number"
                  value={pinHint}
                  onChange={(e) => setPinHint(e.target.value)}
                  className="italic"
                />
                <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">This hint will be shown if you forget your PIN</p>
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6" disabled={loading || pin.length !== 4}>
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
