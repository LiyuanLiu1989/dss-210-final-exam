import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  limit,
  serverTimestamp
} from "firebase/firestore";
import { UserProfile, Friendship } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Search, UserPlus, Check, X, Swords, Users, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface SocialProps {
  userId: string;
  userName: string;
  onChallenge: (friendId: string, friendName: string) => void;
  onStartAssignment: (assignmentId: string, questions: number[]) => void;
}

export default function Social({ userId, userName, onChallenge, onStartAssignment }: SocialProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [friends, setFriends] = useState<(UserProfile & { friendshipId: string })[]>([]);
  const [pendingRequests, setPendingRequests] = useState<(UserProfile & { friendshipId: string })[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Listen for friendships involving the current user
    const q = query(
      collection(db, "friendships"),
      where("uids", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const friendships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Friendship));
      
      const acceptedFriendUids: string[] = [];
      const incomingPending: { uid: string; friendshipId: string }[] = [];
      const outgoingPending: string[] = [];

      friendships.forEach(f => {
        const otherUid = f.uids.find(uid => uid !== userId);
        if (!otherUid) return;

        if (f.status === "accepted") {
          acceptedFriendUids.push(otherUid);
        } else if (f.status === "pending") {
          if (f.senderId === userId) {
            outgoingPending.push(otherUid);
          } else {
            incomingPending.push({ uid: otherUid, friendshipId: f.id! });
          }
        }
      });

      setSentRequests(outgoingPending);

      // Fetch user profiles for accepted friends and incoming requests
      // Note: In real app, we'd handle more efficiently, but for this demo:
      const acceptedProfiles = await Promise.all(
        acceptedFriendUids.map(async (uid) => {
          const d = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
          if (d.empty) return null;
          const friendship = friendships.find(f => f.uids.includes(uid) && f.status === "accepted");
          return { uid, ...d.docs[0].data(), friendshipId: friendship?.id } as UserProfile & { friendshipId: string };
        })
      );
      setFriends(acceptedProfiles.filter(p => p !== null) as any);

      const pendingProfiles = await Promise.all(
        incomingPending.map(async (p) => {
          const d = await getDocs(query(collection(db, "users"), where("uid", "==", p.uid)));
          if (d.empty) return null;
          return { uid: p.uid, ...d.docs[0].data(), friendshipId: p.friendshipId } as UserProfile & { friendshipId: string };
        })
      );
      setPendingRequests(pendingProfiles.filter(p => p !== null) as any);
    });

    // Listen for assignments received
    const aq = query(
      collection(db, "assignments"),
      where("toId", "==", userId),
      where("status", "==", "pending")
    );
    const unsubAssignments = onSnapshot(aq, (snapshot) => {
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe();
      unsubAssignments();
    };
  }, [userId]);

  const assignHomework = async (friendId: string, friendName: string) => {
    try {
      // Pick 5 random questions
      const indices = Array.from({ length: 60 }, (_, i) => i);
      const shuffled = indices.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      await addDoc(collection(db, "assignments"), {
        fromId: userId,
        fromName: userName || "A Classmate",
        toId: friendId,
        questionIndices: shuffled,
        status: "pending",
        pointsValue: 50,
        createdAt: new Date().toISOString()
      });
      
      toast.success(`You assigned a study set to ${friendName}!`);
    } catch (error) {
      toast.error("Failed to assign questions.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      // Simple name search - usually would be more robust
      const q = query(
        collection(db, "users"),
        where("firstName", "==", searchQuery.trim()),
        limit(5)
      );
      const snap = await getDocs(q);
      const results = snap.docs
        .map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile))
        .filter(u => u.uid !== userId);
      setSearchResults(results);
      if (results.length === 0) toast.info("No students found with that name.");
    } catch (error) {
      console.error(error);
      toast.error("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (targetUid: string) => {
    try {
      await addDoc(collection(db, "friendships"), {
        uids: [userId, targetUid],
        senderId: userId,
        status: "pending",
        timestamp: new Date().toISOString()
      });
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error("Failed to send request.");
    }
  };

  const acceptRequest = async (friendshipId: string) => {
    try {
      await updateDoc(doc(db, "friendships", friendshipId), {
        status: "accepted"
      });
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error("Failed to accept.");
    }
  };

  const rejectRequest = async (friendshipId: string) => {
    try {
      await deleteDoc(doc(db, "friendships", friendshipId));
      toast.info("Request removed.");
    } catch (error) {
      toast.error("Failed to ignore request.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="high-density-card">
        <div className="section-title">
          <Users className="w-4 h-4 mr-2" />
          Social Hub
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="friends" className="text-xs font-bold">Friends</TabsTrigger>
            <TabsTrigger value="requests" className="text-xs font-bold relative">
              Requests
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs font-bold relative">
              Homework
              {assignments.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  {assignments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs font-bold">Find</TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {friends.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">No friends yet. Start searching!</p>
                  </div>
                ) : (
                  friends.map((friend) => (
                    <div key={friend.uid} className="flex items-center justify-between p-3 rounded-xl border border-[#e2e8f0] bg-white group hover:border-blue-400 transition-all shadow-sm">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-xs">
                            {friend.firstName[0]}{friend.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-[#1e293b]">{friend.firstName} {friend.lastName}</p>
                          <Badge variant="secondary" className="text-[10px] px-1 py-0 font-bold">{friend.section}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-[10px] font-bold h-8 border-slate-200 hover:bg-slate-50"
                          onClick={() => assignHomework(friend.uid!, friend.firstName)}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Assign
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-[10px] font-bold h-8"
                          onClick={() => onChallenge(friend.uid!, `${friend.firstName} ${friend.lastName}`)}
                        >
                          <Swords className="w-3 h-3 mr-1" />
                          Battle
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="assignments">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <div className="text-center py-10">
                    <Check className="w-12 h-12 text-green-100 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">All caught up! No homework pending.</p>
                  </div>
                ) : (
                  assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">Assigned by {assignment.fromName}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">+ {assignment.pointsValue} Extra Points Available</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-xs font-black px-4"
                        onClick={() => onStartAssignment(assignment.id, assignment.questionIndices)}
                      >
                        Start Now
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="requests">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">No pending invitations.</div>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request.uid} className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-yellow-100 text-yellow-700 font-bold text-xs uppercase">
                            {request.firstName[0]}{request.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{request.firstName} {request.lastName}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Wants to be stats friends!</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-green-600 hover:bg-green-100"
                          onClick={() => acceptRequest(request.friendshipId)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-red-600 hover:bg-red-100"
                          onClick={() => rejectRequest(request.friendshipId)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Student's first name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#f8fafc] border-[#e2e8f0] h-10 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button variant="default" className="bg-blue-600 px-3 h-10" onClick={handleSearch} disabled={loading}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {searchResults.map((user) => {
                  const isFriend = friends.some(f => f.uid === user.uid);
                  const isPending = sentRequests.includes(user.uid!) || pendingRequests.some(p => p.uid === user.uid);
                  
                  return (
                    <div key={user.uid} className="flex items-center justify-between p-3 rounded-lg border border-[#e2e8f0] bg-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px]">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-[13px]">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] text-slate-500">{user.section}</p>
                        </div>
                      </div>
                      {isFriend ? (
                        <Badge variant="outline" className="text-[10px] text-green-600 border-green-200">Friends</Badge>
                      ) : isPending ? (
                        <Badge variant="outline" className="text-[10px] text-slate-400">Request Sent</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-[10px] font-bold h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => sendFriendRequest(user.uid!)}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
