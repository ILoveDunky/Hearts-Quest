
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Gamepad2, 
  MessageSquareHeart, 
  Lock,
  ArrowRight,
  UserCheck,
  Zap,
  MousePointer2,
  Dna,
  RotateCw,
  Calculator,
  CheckCircle2,
  XCircle,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

type GameStep = 
  | "start" 
  | "map"
  | "q1" | "s1" 
  | "q2" | "s2" 
  | "q3" | "s3" 
  | "chase_heart" | "chase_success"
  | "about_me" | "about_me_free" | "about_me_success"
  | "customize" | "customize_result" 
  | "prove_love" | "prove_success"
  | "who_loves_more" | "who_loves_result"
  | "flag_game" | "flag_success"
  | "wheel" 
  | "compatibility" | "calculating" 
  | "final";

interface Node {
  id: GameStep;
  label: string;
  icon: React.ElementType;
  x: number;
  y: number;
}

const generateNodes = (): Node[] => {
  const nodeData: { id: GameStep; label: string; icon: any }[] = [
    { id: "q1", label: "Matched Profile", icon: Heart },
    { id: "q2", label: "Gamer Duo", icon: Gamepad2 },
    { id: "q3", label: "First Words", icon: MessageSquareHeart },
    { id: "chase_heart", label: "Fleeting Heart", icon: MousePointer2 },
    { id: "about_me", label: "The Legend Quiz", icon: UserCheck },
    { id: "customize", label: "Bond Lab", icon: Dna },
    { id: "prove_love", label: "Love Proof", icon: Zap },
    { id: "who_loves_more", label: "Love Battle", icon: Heart },
    { id: "flag_game", label: "Flag Check", icon: Activity },
    { id: "wheel", label: "Affection Wheel", icon: RotateCw },
    { id: "compatibility", label: "Destiny Test", icon: Calculator },
  ];

  return nodeData.map((data, i) => {
    const angle = (i * (360 / nodeData.length) - 90) * (Math.PI / 180);
    const radius = 42; 
    return {
      ...data,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
};

const NODES = generateNodes();

export default function HeartsQuest() {
  const [step, setStep] = useState<GameStep>("start");
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [completedNodes, setCompletedNodes] = useState<GameStep[]>([]);
  const [answer, setAnswer] = useState("");
  const [flagIndex, setFlagIndex] = useState(0);
  
  const [quizStep, setQuizStep] = useState(0);
  const [freeQuizStep, setFreeQuizStep] = useState(0);

  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  // Heart Chase DVD Bouncing Logic
  const [chaseCount, setChaseCount] = useState(0);
  const [heartPos, setHeartPos] = useState({ x: 50, y: 50 });
  const [heartVel, setHeartVel] = useState({ x: 0.5, y: 0.5 });
  const chaseContainerRef = useRef<HTMLDivElement>(null);

  // Love Proof Logic
  const [proveCount, setProveCount] = useState(0);
  const [proveBtnPos, setProveBtnPos] = useState({ top: "50%", left: "50%" });

  // Love Battle Logic
  const [p1Love, setP1Love] = useState(0);
  const [p2Love, setP2Love] = useState(0);
  const [loveCountdown, setLoveCountdown] = useState(10);

  // Relationship Stats Logic
  const [relStats, setRelStats] = useState({
    trust: 50,
    fun: 50,
    communication: 50,
    chaos: 10,
    sleep: 90
  });
  const [relActions, setRelActions] = useState(0);

  const currentProgress = Math.min(((unlockedIndex) / NODES.length) * 100, 100);

  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");

  const finishNode = (nextIndex: number, currentId: GameStep) => {
    if (!completedNodes.includes(currentId)) {
      setCompletedNodes(prev => [...prev, currentId]);
    }
    setUnlockedIndex(Math.max(unlockedIndex, nextIndex));
    setStep("map");
  };

  // Heart Chase Bouncing Animation
  useEffect(() => {
    if (step !== "chase_heart") return;
    
    const speedMultiplier = 1 + (chaseCount * 0.15);
    const interval = setInterval(() => {
      setHeartPos(prev => {
        let nextX = prev.x + heartVel.x * speedMultiplier;
        let nextY = prev.y + heartVel.y * speedMultiplier;

        const newVel = { ...heartVel };
        if (nextX <= 5 || nextX >= 95) {
          newVel.x *= -1;
          nextX = prev.x; // prevent getting stuck
        }
        if (nextY <= 5 || nextY >= 95) {
          newVel.y *= -1;
          nextY = prev.y; // prevent getting stuck
        }
        
        if (newVel.x !== heartVel.x || newVel.y !== heartVel.y) {
          setHeartVel(newVel);
        }

        return { x: nextX, y: nextY };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [step, heartVel, chaseCount]);

  const handleChaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (chaseCount < 10) {
      setChaseCount(prev => prev + 1);
    } else {
      setStep("chase_success");
      setChaseCount(0);
      setHeartVel({ x: 0.5, y: 0.5 }); // reset velocity for potential replay
    }
  };

  const handleQ1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (normalize(answer).includes("frog")) {
      setStep("s1");
      setAnswer("");
    }
  };

  const handleQ2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (normalize(answer) === "minecraft") {
      setStep("s2");
      setAnswer("");
    }
  };

  const handleQ3 = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalize(answer);
    if (normalized.includes("who is you") || normalized.includes("who are you")) {
      setStep("s3");
      setAnswer("");
    }
  };

  const handleProveClick = () => {
    const nextCount = proveCount + 1;
    setProveCount(nextCount);
    if (nextCount >= 100) {
      setStep("prove_success");
    } else if (nextCount % 10 === 0) {
      setProveBtnPos({
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 60 + 20}%`
      });
    }
  };

  const handleLoveSpam = () => {
    if (loveCountdown > 0) return;
    if (p1Love < 100) {
      const nextP1 = Math.min(100, p1Love + 5);
      setP1Love(nextP1);
      // Synchronize P2 love - it chases P1 but only hits 100 when P1 does
      if (nextP1 >= 100) {
        setP2Love(100);
        setTimeout(() => setStep("who_loves_result"), 500);
      } else {
        // P2 keeps up but stays slightly behind or equal
        setP2Love(prev => Math.min(nextP1, prev + (Math.random() * 6)));
      }
    }
  };

  useEffect(() => {
    if (step === "who_loves_more") {
      setLoveCountdown(10);
      const countInterval = setInterval(() => {
        setLoveCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countInterval);
    }
  }, [step]);

  const updateRel = (changes: Partial<typeof relStats>) => {
    setRelStats(prev => {
      const next = { ...prev };
      (Object.keys(changes) as (keyof typeof relStats)[]).forEach(key => {
        next[key] = Math.min(100, Math.max(0, next[key] + (changes[key] || 0)));
      });
      return next;
    });
    setRelActions(c => c + 1);
  };

  const handleAboutMeMC = (correct: boolean) => {
    if (correct) {
      if (quizStep < 2) {
        setQuizStep(prev => prev + 1);
      } else {
        setStep("about_me_free");
      }
    }
  };

  const handleAboutMeFree = (e: React.FormEvent) => {
    e.preventDefault();
    if (freeQuizStep < 5) {
      setFreeQuizStep(prev => prev + 1);
      setAnswer("");
    } else {
      setStep("about_me_success");
    }
  };

  const flags = [
    { text: "Insists on splitting the check", ideal: "red" },
    { text: "Ordering for you", ideal: "red" },
    { text: "Calling you pet names only", ideal: "green" },
    { text: "Remembers your orders for everything", ideal: "green" },
    { text: "Creates a whole website for valentines day", ideal: "green" },
  ];

  const handleFlag = () => {
    if (flagIndex < flags.length - 1) {
      setFlagIndex(prev => prev + 1);
    } else {
      setFlagIndex(0);
      setStep("flag_success");
    }
  };

  const wheelOptions = [
    "1 full minute of compliments",
    "Try a stupid pick up line",
    "1 hour of Overwatch"
  ];

  const spinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);
    const segmentAngle = 360 / wheelOptions.length;
    const randomIndex = Math.floor(Math.random() * wheelOptions.length);
    const centerOfSegment = (randomIndex * segmentAngle) + (segmentAngle / 2);
    const targetOffset = 360 - centerOfSegment;
    const extraRotation = targetOffset + (360 * 5); 
    const newRotation = rotation + extraRotation;
    setRotation(newRotation);
    setTimeout(() => {
      setWheelResult(wheelOptions[randomIndex]);
      setWheelSpinning(false);
    }, 4000);
  };

  useEffect(() => {
    if (step === "calculating") {
      const timer = setTimeout(() => {
        setStep("final");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const circlePathD = useMemo(() => {
    return NODES.reduce((acc, node, i) => {
      if (i === 0) return `M ${node.x} ${node.y}`;
      return `${acc} L ${node.x} ${node.y}`;
    }, "") + " Z";
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 transition-all duration-300 overflow-hidden">
      <StarField intensity={step === "map" || step === "final" || step === "calculating" ? "high" : "normal"} />

      <div className="z-10 w-full max-w-7xl py-12 h-full flex flex-col justify-center">
        
        {step !== "start" && step !== "final" && step !== "calculating" && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 space-y-4 z-[60]">
            <div className="flex justify-between items-center text-primary/60 text-lg uppercase tracking-[0.3em] font-bold">
              <span>Constellation Sync</span>
              <span>{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-4 bg-secondary/30" />
          </div>
        )}

        {step === "start" && (
          <div className="text-center space-y-16 animate-in fade-in zoom-in duration-700">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="size-48 text-primary fill-primary/20 heart-pulse" />
              </div>
            </div>
            <h1 className="text-9xl font-headline tracking-tighter text-white">Hearts Quest</h1>
            <p className="text-primary/60 italic text-4xl">Our memories, mapped in the stars.</p>
            <Button 
              size="lg" 
              onClick={() => setStep("map")}
              className="px-32 py-16 text-5xl bg-primary text-background hover:bg-accent transition-all rounded-full shadow-[0_0_60px_rgba(216,180,254,0.4)] font-bold uppercase tracking-widest"
            >
              Enter Nebula
            </Button>
          </div>
        )}

        {step === "map" && (
          <div className="relative w-full max-w-[900px] aspect-square mx-auto animate-in fade-in zoom-in duration-1000">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100">
              <path 
                d={circlePathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="opacity-20 constellation-line"
              />
            </svg>

            {NODES.map((node, index) => {
              const isUnlocked = index <= unlockedIndex;
              const isCompleted = completedNodes.includes(node.id);
              const isActive = index === unlockedIndex;

              return (
                <button
                  key={node.id}
                  disabled={!isUnlocked}
                  onClick={() => setStep(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 group z-[20]",
                    !isUnlocked && "opacity-20 grayscale cursor-not-allowed",
                    isUnlocked && "hover:scale-125"
                  )}
                >
                  <div className={cn(
                    "size-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative bg-background shadow-2xl",
                    isCompleted ? "bg-primary/20 border-primary text-primary" : "border-primary/40 text-primary/40",
                    isActive && "border-accent text-accent node-pulse scale-150 z-[30] shadow-[0_0_40px_rgba(216,180,254,0.6)]"
                  )}>
                    {isUnlocked ? <node.icon className="size-12" /> : <Lock className="size-10" />}
                  </div>
                  <span className={cn(
                    "mt-8 text-sm uppercase font-bold tracking-[0.4em] whitespace-nowrap transition-all",
                    isActive ? "text-accent opacity-100 translate-y-0" : "text-primary/40 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                  )}>
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="max-w-5xl mx-auto w-full px-6">
          {step === "q1" && (
            <div className="space-y-16 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-7xl font-headline text-primary text-center">What was the first profile pictures we matched?</h2>
              <form onSubmit={handleQ1} className="space-y-10">
                <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here..." className="bg-secondary/20 border-primary/30 h-32 text-6xl rounded-3xl text-center" />
                <Button type="submit" className="w-full h-24 bg-accent text-background text-4xl font-bold rounded-2xl">Check Memory</Button>
              </form>
            </div>
          )}
          {step === "s1" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <Heart className="size-48 text-primary fill-primary mx-auto" />
              <h2 className="text-7xl font-headline italic leading-tight">We didn't know it yet but that's when it all started.</h2>
              <Button onClick={() => finishNode(1, "q1")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized <ArrowRight className="ml-4" /></Button>
            </div>
          )}
          {step === "q2" && (
            <div className="space-y-16 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-7xl font-headline text-primary text-center">What was the first game we played together?</h2>
              <form onSubmit={handleQ2} className="space-y-10">
                <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Game title..." className="bg-secondary/20 border-primary/30 h-32 text-6xl rounded-3xl text-center" />
                <Button type="submit" className="w-full h-24 bg-accent text-background text-4xl font-bold rounded-2xl">Submit</Button>
              </form>
            </div>
          )}
          {step === "s2" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <Gamepad2 className="size-64 text-primary mx-auto" />
              <h2 className="text-7xl font-headline italic leading-tight">The start of an amazing gaming duo.</h2>
              <Button onClick={() => finishNode(2, "q2")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized <ArrowRight className="ml-4" /></Button>
            </div>
          )}
          {step === "q3" && (
            <div className="space-y-16 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-7xl font-headline text-primary text-center">What was the first thing I said to you when we first met?</h2>
              <form onSubmit={handleQ3} className="space-y-10">
                <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="The exact phrase..." className="bg-secondary/20 border-primary/30 h-32 text-6xl rounded-3xl text-center" />
                <Button type="submit" className="w-full h-24 bg-accent text-background text-4xl font-bold rounded-2xl">Answer</Button>
              </form>
            </div>
          )}
          {step === "s3" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <MessageSquareHeart className="size-64 text-primary mx-auto" />
              <h2 className="text-7xl font-headline italic leading-tight">The most important words ever spoken.</h2>
              <Button onClick={() => finishNode(3, "q3")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized <ArrowRight className="ml-4" /></Button>
            </div>
          )}
          {step === "chase_heart" && (
            <div ref={chaseContainerRef} className="relative w-full h-[75vh] bg-secondary/10 rounded-[5rem] border border-primary/20 overflow-hidden animate-in fade-in duration-500 shadow-3xl">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
                <p className="text-xl uppercase tracking-[0.5em] text-primary/60 font-bold mb-4">Catch the bouncing heart</p>
                <p className="text-6xl font-headline text-white">{11 - chaseCount} more times</p>
              </div>
              <button 
                onClick={handleChaseClick} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-none cursor-pointer p-8"
                style={{ 
                  left: `${heartPos.x}%`, 
                  top: `${heartPos.y}%`,
                }}
              >
                <Heart className="text-primary fill-primary/40 drop-shadow-[0_0_30px_rgba(216,180,254,0.7)] size-36" />
              </button>
            </div>
          )}
          {step === "chase_success" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <Heart className="size-64 text-primary fill-primary mx-auto heart-pulse" />
              <h2 className="text-7xl font-headline italic leading-tight">"You really never stop chasing my heart, do you?"</h2>
              <Button onClick={() => finishNode(4, "chase_heart")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized <ArrowRight className="ml-4" /></Button>
            </div>
          )}
          {step === "about_me" && (
            <div className="space-y-16 animate-in slide-in-from-right duration-500">
              <h2 className="text-7xl font-headline text-primary text-center">Testing Your Knowledge...</h2>
              {quizStep === 0 && (
                <div className="space-y-12">
                  <p className="text-5xl text-center">Am I a morning person or night person?</p>
                  <div className="grid grid-cols-1 gap-8">
                    {["Morning", "Night", "Both"].map((opt) => (
                      <Button key={opt} variant="outline" onClick={() => handleAboutMeMC(opt === "Both")} className="h-28 text-4xl rounded-3xl">{opt}</Button>
                    ))}
                  </div>
                </div>
              )}
              {quizStep === 1 && (
                <div className="space-y-12">
                  <p className="text-5xl text-center">What is my biggest fear?</p>
                  <div className="grid grid-cols-1 gap-8">
                    {["Spiders", "Heights", "Rejection"].map((opt) => (
                      <Button key={opt} variant="outline" onClick={() => handleAboutMeMC(opt === "Rejection")} className="h-28 text-4xl rounded-3xl">{opt}</Button>
                    ))}
                  </div>
                </div>
              )}
              {quizStep === 2 && (
                <div className="space-y-12">
                  <p className="text-5xl text-center">What is my favorite joke?</p>
                  <div className="grid grid-cols-1 gap-8">
                    {["Crazy? I was crazy once...", "6", "7"].map((opt, i) => (
                      <Button key={i} variant="outline" onClick={() => handleAboutMeMC(i === 0)} className="h-auto py-12 text-center px-12 text-3xl leading-relaxed rounded-3xl">{opt}</Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {step === "about_me_free" && (
            <div className="space-y-16 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-7xl font-headline text-accent text-center">The Vibe Checks</h2>
              <div className="space-y-12">
                <p className="text-5xl italic text-center leading-relaxed">
                  {freeQuizStep === 0 && "If I were a dog breed what would I be?"}
                  {freeQuizStep === 1 && "If I were a cat what color would I be?"}
                  {freeQuizStep === 2 && "If I were a color what color would I be?"}
                  {freeQuizStep === 3 && "Who would play me in a movie about me?"}
                  {freeQuizStep === 4 && "If I were a kitchen appliance what appliance would I be?"}
                  {freeQuizStep === 5 && "On a scale of 1-10 how likely would it be that I would survive a horror movie?"}
                </p>
                <form onSubmit={handleAboutMeFree} className="space-y-10">
                  <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Tell me your thoughts..." className="bg-secondary/20 border-primary/30 h-32 text-6xl rounded-3xl text-center" />
                  <Button type="submit" className="w-full h-24 bg-accent text-background text-4xl font-bold rounded-3xl">Next Question</Button>
                </form>
              </div>
            </div>
          )}
          {step === "about_me_success" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <Zap className="size-64 text-accent mx-auto animate-pulse" />
              <h2 className="text-8xl font-headline italic leading-tight">You know me better than anyone.</h2>
              <Button onClick={() => finishNode(5, "about_me")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized <ArrowRight className="ml-4" /></Button>
            </div>
          )}
          {step === "customize" && (
            <div className="space-y-16 animate-in slide-in-from-bottom duration-500">
              <div className="text-center">
                <h2 className="text-7xl font-headline text-primary">Bond Lab 🧬</h2>
              </div>
              
              <div className="grid gap-12 bg-secondary/10 p-16 rounded-[4rem] border border-primary/20 shadow-3xl">
                {Object.entries(relStats).map(([key, value]) => (
                  <div key={key} className="space-y-6">
                    <div className="flex justify-between items-end">
                      <Label className="capitalize text-xl font-bold tracking-[0.3em] opacity-60">{key}</Label>
                      <span className="text-xl font-mono text-primary/60">{Math.round(value)}%</span>
                    </div>
                    <Progress value={value} className="h-6" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Send Meme", action: () => updateRel({ fun: 15, communication: 5, chaos: 2 }) },
                  { label: "Start Deep Talk", action: () => updateRel({ trust: 15, communication: 20, sleep: -15 }) },
                  { label: "Tease", action: () => updateRel({ fun: 10, chaos: 20, trust: -5 }) },
                  { label: "Apologize", action: () => updateRel({ trust: 20, chaos: -20, communication: 10 }) },
                  { label: "Plan Date", action: () => updateRel({ fun: 20, trust: 10, sleep: -10 }) },
                  { label: "Sleep on call", action: () => updateRel({ trust: 15, fun: 5, sleep: 30, communication: -5 }) },
                ].map((btn) => (
                  <Button 
                    key={btn.label} 
                    variant="outline" 
                    onClick={btn.action}
                    className="h-28 border-primary/20 hover:bg-primary/5 text-xl font-bold uppercase tracking-widest rounded-3xl"
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>

              {relActions >= 5 && (
                <Button 
                  onClick={() => setStep("customize_result")} 
                  className="w-full h-32 bg-accent text-background font-bold text-4xl animate-pulse rounded-full shadow-3xl"
                >
                  Synchronize Bond
                </Button>
              )}
            </div>
          )}
          {step === "customize_result" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <h2 className="text-8xl font-headline text-primary leading-tight">Status: Legally Unseparable.</h2>
              <Button onClick={() => finishNode(6, "customize")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Accept Fate</Button>
            </div>
          )}
          {step === "prove_love" && (
            <div className="relative w-full h-[75vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="text-center mb-16 space-y-8">
                <h2 className="text-7xl font-headline text-primary uppercase tracking-tighter">PROVE YOU LOVE ME</h2>
                <p className="text-[12rem] font-headline text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] leading-none">{proveCount}</p>
              </div>
              <Button
                onClick={handleProveClick}
                className="absolute transition-all duration-200 h-48 w-[32rem] bg-accent text-background text-4xl font-bold rounded-[3rem] shadow-[0_0_60px_rgba(216,180,254,0.5)]"
                style={{ top: proveBtnPos.top, left: proveBtnPos.left, transform: 'translate(-50%, -50%)' }}
              >
                PRESS IF YOU LOVE ME
              </Button>
            </div>
          )}
          {step === "prove_success" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <Heart className="size-64 text-primary fill-primary mx-auto animate-ping" />
              <h2 className="text-8xl font-headline italic leading-tight">"Okay okay I get it."</h2>
              <Button onClick={() => finishNode(7, "prove_love")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized</Button>
            </div>
          )}
          {step === "who_loves_more" && (
            <div className="space-y-20 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-8xl font-headline text-center text-primary">Who loves the other more?</h2>
              
              {loveCountdown > 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl uppercase tracking-[0.5em] text-accent/60 mb-8 font-bold">Battle starting in</p>
                  <p className="text-[15rem] font-headline text-white animate-pulse">{loveCountdown}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-16 bg-secondary/10 p-20 rounded-[5rem] border border-primary/20 shadow-3xl">
                    <div className="space-y-8">
                      <div className="flex justify-between text-xl font-bold uppercase tracking-[0.4em] text-primary/60">
                        <span>Her Love</span>
                        <span>{Math.round(p1Love)}%</span>
                      </div>
                      <Progress value={p1Love} className="h-10" />
                    </div>

                    <div className="space-y-8">
                      <div className="flex justify-between text-xl font-bold uppercase tracking-[0.4em] text-accent/60">
                        <span>My Love</span>
                        <span>{Math.round(p2Love)}%</span>
                      </div>
                      <Progress value={p2Love} className="h-10 bg-accent/10" />
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={handleLoveSpam}
                      className="size-[24rem] rounded-full bg-primary text-background font-bold text-6xl shadow-[0_0_100px_rgba(216,180,254,0.6)] active:scale-90 transition-transform"
                    >
                      SPAM LOVE
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
          {step === "who_loves_result" && (
            <div className="text-center space-y-16 animate-in zoom-in duration-700">
              <h2 className="text-8xl font-headline italic leading-tight">"We love each other equally."</h2>
              <Button onClick={() => finishNode(8, "who_loves_more")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized</Button>
            </div>
          )}
          {step === "flag_game" && (
            <div className="space-y-16 animate-in fade-in duration-500">
              <h2 className="text-7xl font-headline text-center text-primary">Flag Check</h2>
              <div className="min-h-[350px] flex items-center justify-center text-center p-16 bg-secondary/10 rounded-[4rem] border border-primary/20 shadow-3xl">
                <p className="text-6xl font-headline italic text-white leading-relaxed">{flags[flagIndex].text}</p>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <Button onClick={handleFlag} className="h-36 text-4xl bg-destructive/20 text-destructive border-4 border-destructive/20 rounded-[2.5rem]"><XCircle className="mr-6 size-12" /> Red Flag</Button>
                <Button onClick={handleFlag} className="h-36 text-4xl bg-green-500/20 text-green-500 border-4 border-green-500/20 rounded-[2.5rem]"><CheckCircle2 className="mr-6 size-12" /> Green Flag</Button>
              </div>
            </div>
          )}
          {step === "flag_success" && (
            <div className="text-center space-y-20 animate-in zoom-in duration-700">
               <Activity className="size-[20rem] text-primary mx-auto opacity-50" />
               <Button onClick={() => finishNode(9, "flag_game")} className="bg-accent text-background h-24 px-16 text-3xl font-bold rounded-2xl">Node Synchronized</Button>
            </div>
          )}
          {step === "wheel" && (
            <div className="space-y-16 text-center animate-in slide-in-from-bottom duration-500">
              <h2 className="text-7xl font-headline text-primary">Affection Wheel</h2>
              <div className="relative flex justify-center py-20">
                <div className="relative size-[600px]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-30 w-12 h-20 bg-accent rotate-180" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  <div className="w-full h-full rounded-full border-[16px] border-primary/20 overflow-hidden relative shadow-3xl" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' }}>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {wheelOptions.map((opt, i) => (
                        <g key={i}>
                          <path d={`M 50 50 L ${50 + 50 * Math.cos((Math.PI * (i * 120 - 90)) / 180)} ${50 + 50 * Math.sin((Math.PI * (i * 120 - 90)) / 180)} A 50 50 0 0 1 ${50 + 50 * Math.cos((Math.PI * ((i + 1) * 120 - 90)) / 180)} ${50 + 50 * Math.sin((Math.PI * ((i + 1) * 120 - 90)) / 180)} Z`} fill={i === 0 ? 'hsl(var(--primary) / 0.15)' : i === 1 ? 'hsl(var(--accent) / 0.15)' : 'hsl(var(--secondary) / 0.3)'} />
                          <text x="50" y="25" transform={`rotate(${i * 120 + 60} 50 50)`} fill="white" fontSize="3" textAnchor="middle" className="font-bold">{opt}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
              <Button disabled={wheelSpinning} onClick={spinWheel} className="w-full h-32 bg-accent text-background font-bold text-4xl rounded-[2.5rem] shadow-3xl">{wheelSpinning ? "Spinning..." : "Spin the Wheel"}</Button>
              {wheelResult && !wheelSpinning && <Button variant="ghost" onClick={() => finishNode(10, "wheel")} className="text-primary/60 text-2xl mt-8">Continue</Button>}
            </div>
          )}
          {step === "compatibility" && (
            <div className="space-y-16 animate-in slide-in-from-right duration-500">
               <h2 className="text-7xl font-headline text-center text-primary">Compatibility Scan</h2>
              <div className="space-y-12 max-h-[60vh] overflow-y-auto pr-8 custom-scrollbar px-4">
                <div className="space-y-8 bg-secondary/10 p-16 rounded-[4rem] border border-primary/10 shadow-xl">
                  <p className="text-4xl font-medium">Pineapple on pizza?</p>
                  <RadioGroup defaultValue="no" className="space-y-6">
                    <div className="flex items-center space-x-6"><RadioGroupItem value="no" id="p2" className="size-10" /><Label htmlFor="p2" className="text-green-500 text-3xl font-bold cursor-pointer">No (Correct)</Label></div>
                    <div className="flex items-center space-x-6"><RadioGroupItem value="yes" id="p1" className="size-10" /><Label htmlFor="p1" className="text-destructive text-3xl font-bold cursor-pointer">Yes (Wrong)</Label></div>
                  </RadioGroup>
                </div>
                {[
                  { q: "Do you steal blankets?", opts: ["Yes (Blanket Hog)", "Sometimes"] },
                  { q: "Would you survive a zombie apocalypse?", opts: ["Yes", "No"] },
                  { q: "Would you still love me if I was a worm?", opts: ["Obviously yes", "I'd keep you in a jar"] },
                ].map((item, i) => (
                  <div key={i} className="space-y-8 bg-secondary/10 p-16 rounded-[4rem] border border-primary/10 shadow-xl">
                    <p className="text-4xl font-medium">{item.q}</p>
                    <RadioGroup defaultValue={item.opts[0]} className="space-y-6">
                      {item.opts.map((o, idx) => (
                        <div key={idx} className="flex items-center space-x-6">
                          <RadioGroupItem value={o} id={`q-${i}-${idx}`} className="size-10" />
                          <Label htmlFor={`q-${i}-${idx}`} className="text-3xl cursor-pointer">{o}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep("calculating")} className="w-full h-32 bg-accent text-background font-bold text-4xl rounded-full shadow-3xl">Run Final Analysis</Button>
            </div>
          )}
          {step === "calculating" && (
            <div className="text-center space-y-16 animate-in fade-in duration-700">
              <Calculator className="size-64 text-primary mx-auto animate-bounce opacity-70" />
              <h2 className="text-8xl font-headline italic text-accent leading-tight">Calculating Destiny...</h2>
              <Progress value={undefined} className="h-6 bg-secondary/30" />
            </div>
          )}
          {step === "final" && (
            <div className="text-center space-y-20 animate-in fade-in duration-1000 max-w-6xl mx-auto">
              <h1 className="text-[10rem] font-headline text-white tracking-tighter drop-shadow-[0_0_80px_rgba(216,180,254,0.5)] leading-none">100% Match</h1>
              <div className="bg-secondary/20 p-24 rounded-[5rem] border border-primary/20 space-y-16 backdrop-blur-3xl shadow-3xl">
                <Heart className="size-48 text-primary mx-auto fill-primary/20 heart-pulse" />
                <p className="text-accent text-7xl font-headline italic leading-tight">"Idk but it looks like we're legally required to stay together forever."</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
