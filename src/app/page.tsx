"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Stars, 
  Gamepad2, 
  MessageSquareHeart, 
  Flag, 
  RotateCw, 
  BookHeart, 
  Calculator,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  UserCheck,
  Zap,
  MousePointer2,
  Activity,
  Skull,
  Dna
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
  | "dino_game"
  | "customize" | "customize_result" 
  | "flag_game" | "flag_success"
  | "wheel" 
  | "rate_story" | "compatibility" | "calculating" 
  | "final";

interface Node {
  id: GameStep;
  label: string;
  icon: React.ElementType;
  x: number; // percentage
  y: number; // percentage
}

// Perfect Circular Layout (11 Nodes)
const NODES: Node[] = [
  { id: "q1", label: "Matched Profile", icon: Heart, x: 50, y: 15 },
  { id: "q2", label: "Gamer Duo", icon: Gamepad2, x: 68.9, y: 20.6 },
  { id: "q3", label: "First Words", icon: MessageSquareHeart, x: 81.8, y: 35.5 },
  { id: "chase_heart", label: "Fleeting Heart", icon: MousePointer2, x: 84.6, y: 54.9 },
  { id: "about_me", label: "The Legend Quiz", icon: UserCheck, x: 76.5, y: 72.9 },
  { id: "dino_game", label: "Distance Runner", icon: Activity, x: 59.9, y: 83.6 },
  { id: "customize", label: "Bond Lab", icon: Dna, x: 40.1, y: 83.6 },
  { id: "flag_game", label: "Flag Check", icon: Flag, x: 23.6, y: 72.9 },
  { id: "wheel", label: "Affection Wheel", icon: RotateCw, x: 15.4, y: 54.9 },
  { id: "rate_story", label: "Love Tropes", icon: BookHeart, x: 18.1, y: 35.5 },
  { id: "compatibility", label: "Destiny Test", icon: Calculator, x: 31.0, y: 20.6 },
];

export default function HeartsQuest() {
  const [step, setStep] = useState<GameStep>("start");
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [completedNodes, setCompletedNodes] = useState<GameStep[]>([]);
  const [answer, setAnswer] = useState("");
  const [flagIndex, setFlagIndex] = useState(0);
  
  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [freeQuizStep, setFreeQuizStep] = useState(0);

  // Wheel State
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  // Chasing Heart State
  const [chaseCount, setChaseCount] = useState(0);
  const [heartPos, setHeartPos] = useState({ top: "50%", left: "50%" });

  // Relationship Simulator State
  const [relStats, setRelStats] = useState({
    trust: 50,
    fun: 50,
    communication: 50,
    chaos: 10,
    sleep: 90
  });
  const [relActions, setRelActions] = useState(0);

  // Dino Game State
  const [dinoScore, setDinoScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isHurt, setIsHurt] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; left: number; text: string }[]>([]);
  const dinoGameActive = step === "dino_game";

  const currentProgress = Math.min(((unlockedIndex) / NODES.length) * 100, 100);

  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");

  const finishNode = (nextIndex: number, currentId: GameStep) => {
    if (!completedNodes.includes(currentId)) {
      setCompletedNodes(prev => [...prev, currentId]);
    }
    setUnlockedIndex(Math.max(unlockedIndex, nextIndex));
    setStep("map");
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

  const handleChaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (chaseCount < 6) {
      setChaseCount(prev => prev + 1);
      const newTop = Math.random() * 60 + 20;
      const newLeft = Math.random() * 60 + 20;
      setHeartPos({ top: `${newTop}%`, left: `${newLeft}%` });
    } else {
      setStep("chase_success");
      setChaseCount(0);
    }
  };

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

  // Dino Physics & Loop
  useEffect(() => {
    if (!dinoGameActive) return;
    const obstacleTexts = ["Bad Wi-fi", "Work Schedule", "11 Hour Drive", "Bad Overwatch Teammates"];
    let frameId: number;
    let lastTime = Date.now();
    let obstacleTimer = 0;

    const gameLoop = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      setDinoScore(prev => {
        if (prev >= 6767) return 6767;
        return prev + 4;
      });

      setObstacles(prev => {
        const moved = prev.map(o => ({ ...o, left: o.left - 0.02 * delta }));
        
        moved.forEach(o => {
          if (o.left > 8 && o.left < 14 && dinoY < 25) {
            setIsHurt(true);
            setTimeout(() => setIsHurt(false), 300);
          }
        });

        return moved.filter(o => o.left > -20);
      });

      obstacleTimer += delta;
      if (obstacleTimer > 4000) {
        setObstacles(prev => [
          ...prev,
          { id: Date.now(), left: 110, text: obstacleTexts[Math.floor(Math.random() * obstacleTexts.length)] }
        ]);
        obstacleTimer = 0;
      }
      frameId = requestAnimationFrame(gameLoop);
    };
    frameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameId);
  }, [dinoGameActive, dinoY]);

  useEffect(() => {
    if (dinoScore >= 6767 && step === "dino_game") {
      setTimeout(() => finishNode(6, "dino_game"), 1500);
    }
  }, [dinoScore, step]);

  const handleJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    setDinoY(110);
    setTimeout(() => {
      setDinoY(0);
      setIsJumping(false);
    }, 800);
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

  const pathD = useMemo(() => {
    return NODES.reduce((acc, node, i) => {
      if (i === 0) return `M ${node.x} ${node.y}`;
      return `${acc} L ${node.x} ${node.y}`;
    }, "") + " Z";
  }, []);

  return (
    <main className={cn(
      "relative min-h-screen flex items-center justify-center p-6 transition-all duration-300 overflow-hidden",
      isHurt ? "bg-destructive/20" : "bg-transparent"
    )}>
      <StarField intensity={step === "map" || step === "final" || step === "calculating" ? "high" : "normal"} />

      <div className="z-10 w-full max-w-4xl py-12 h-full flex flex-col justify-center">
        
        {step !== "start" && step !== "final" && step !== "calculating" && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 space-y-2 z-[60]">
            <div className="flex justify-between items-center text-primary/60 text-[10px] uppercase tracking-widest font-bold">
              <span>Nebula Sync Status</span>
              <span>{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-1 bg-secondary/30" />
          </div>
        )}

        {step === "start" && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="size-24 text-primary fill-primary/20 heart-pulse" />
                <Stars className="size-8 absolute -top-2 -right-2 text-accent" />
              </div>
            </div>
            <h1 className="text-6xl font-headline tracking-tighter text-white">Hearts Quest</h1>
            <p className="text-primary/60 italic text-xl">A journey through our star-crossed memories.</p>
            <Button 
              size="lg" 
              onClick={() => setStep("map")}
              className="px-16 py-8 text-xl bg-primary text-background hover:bg-accent transition-all rounded-full shadow-[0_0_30px_rgba(216,180,254,0.3)] font-bold uppercase tracking-widest"
            >
              Enter Nebula
            </Button>
          </div>
        )}

        {step === "map" && (
          <div className="relative w-full max-w-[500px] aspect-square mx-auto animate-in fade-in zoom-in duration-1000">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" className="opacity-10" />
              <path 
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="opacity-20 constellation-line"
              />
              {unlockedIndex > 0 && unlockedIndex < NODES.length && (
                <path 
                  d={`M ${NODES[unlockedIndex-1].x} ${NODES[unlockedIndex-1].y} L ${NODES[unlockedIndex].x} ${NODES[unlockedIndex].y}`}
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="0.8"
                  className="animate-pulse opacity-60"
                />
              )}
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
                    "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 group z-10",
                    !isUnlocked && "opacity-20 grayscale cursor-not-allowed",
                    isUnlocked && "hover:scale-110"
                  )}
                >
                  <div className={cn(
                    "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative",
                    isCompleted ? "bg-primary/20 border-primary text-primary" : "border-primary/40 bg-background text-primary/40",
                    isActive && "border-accent text-accent node-pulse scale-125 z-20 shadow-[0_0_20px_rgba(216,180,254,0.5)]"
                  )}>
                    {isUnlocked ? <node.icon className="size-4" /> : <Lock className="size-3" />}
                    {isActive && (
                      <div className="absolute -inset-2 border border-accent/30 rounded-full animate-ping" />
                    )}
                  </div>
                  <span className={cn(
                    "mt-3 text-[8px] uppercase font-bold tracking-[0.2em] whitespace-nowrap transition-all",
                    isActive ? "text-accent opacity-100 translate-y-0" : "text-primary/40 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                  )}>
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="max-w-lg mx-auto w-full">
          {step === "q1" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-primary">What was the first profile pictures we matched?</h2>
              <form onSubmit={handleQ1} className="space-y-4">
                <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here..." className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl" />
                <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Check Memory</Button>
              </form>
            </div>
          )}
          {step === "s1" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <div className="flex justify-center"><div className="p-8 rounded-full bg-primary/10 border border-primary/20"><Heart className="size-20 text-primary fill-primary" /></div></div>
              <h2 className="text-4xl font-headline italic">We didn't know it yet but that's when it all started.</h2>
              <Button onClick={() => finishNode(1, "q1")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}
          {step === "q2" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-primary">What was the first game we played together?</h2>
              <form onSubmit={handleQ2} className="space-y-4">
                <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Game title..." className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl" />
                <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Submit</Button>
              </form>
            </div>
          )}
          {step === "s2" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <Gamepad2 className="size-24 text-primary mx-auto animate-bounce" />
              <h2 className="text-4xl font-headline italic">The start of an amazing gaming duo.</h2>
              <Button onClick={() => finishNode(2, "q2")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}
          {step === "q3" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-primary">What was the first thing I said to you when we first met?</h2>
              <form onSubmit={handleQ3} className="space-y-4">
                <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="The exact phrase..." className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl" />
                <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Answer</Button>
              </form>
            </div>
          )}
          {step === "s3" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <MessageSquareHeart className="size-24 text-primary mx-auto" />
              <h2 className="text-4xl font-headline italic">The most important words ever spoken.</h2>
              <Button onClick={() => finishNode(3, "q3")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}
          {step === "chase_heart" && (
            <div className="relative w-full h-[60vh] bg-secondary/10 rounded-3xl border border-primary/20 overflow-hidden animate-in fade-in duration-500">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
                <p className="text-xs uppercase tracking-widest text-primary/60">Catch the heart</p>
                <p className="text-2xl font-headline text-white">{7 - chaseCount} more times</p>
              </div>
              <button 
                onClick={handleChaseClick} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all cursor-pointer p-4"
                style={{ 
                  top: heartPos.top, 
                  left: heartPos.left,
                  transitionDuration: `${Math.max(450 - (chaseCount * 70), 80)}ms` 
                }}
              >
                <Heart className="text-primary fill-primary/40 drop-shadow-[0_0_15px_rgba(216,180,254,0.5)]" style={{ width: `${Math.max(120 - chaseCount * 15, 40)}px`, height: `${Math.max(120 - chaseCount * 15, 40)}px` }} />
              </button>
            </div>
          )}
          {step === "chase_success" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <Heart className="size-24 text-primary fill-primary mx-auto heart-pulse" />
              <h2 className="text-3xl font-headline italic">"You really never stop chasing my heart, do you?"</h2>
              <Button onClick={() => finishNode(4, "chase_heart")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}
          {step === "about_me" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <h2 className="text-3xl font-headline text-primary">Testing Your Knowledge...</h2>
              {quizStep === 0 && (
                <div className="space-y-6">
                  <p className="text-xl">Am I a morning person or night person?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {["Morning", "Night", "Both"].map((opt) => (
                      <Button key={opt} variant="outline" onClick={() => handleAboutMeMC(opt === "Both")} className="h-14 text-lg">{opt}</Button>
                    ))}
                  </div>
                </div>
              )}
              {quizStep === 1 && (
                <div className="space-y-6">
                  <p className="text-xl">What is my biggest fear?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {["Spiders", "Heights", "Rejection"].map((opt) => (
                      <Button key={opt} variant="outline" onClick={() => handleAboutMeMC(opt === "Rejection")} className="h-14 text-lg">{opt}</Button>
                    ))}
                  </div>
                </div>
              )}
              {quizStep === 2 && (
                <div className="space-y-6">
                  <p className="text-xl">What is my favorite joke?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {["Crazy? I was crazy once...", "6", "7"].map((opt, i) => (
                      <Button key={i} variant="outline" onClick={() => handleAboutMeMC(i === 0)} className="h-auto py-4 text-left px-6">{opt}</Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {step === "about_me_free" && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-accent">The Vibe Checks</h2>
              <div className="space-y-6">
                <p className="text-xl italic">
                  {freeQuizStep === 0 && "If I were a dog breed what would I be?"}
                  {freeQuizStep === 1 && "If I were a cat what color would I be?"}
                  {freeQuizStep === 2 && "If I were a color what color would I be?"}
                  {freeQuizStep === 3 && "Who would play me in a movie about me?"}
                  {freeQuizStep === 4 && "If I were a kitchen appliance what appliance would I be?"}
                  {freeQuizStep === 5 && "On a scale of 1-10 how likely would it be that I would survive a horror movie?"}
                </p>
                <form onSubmit={handleAboutMeFree} className="space-y-4">
                  <Input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Tell me your thoughts..." className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl" />
                  <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Next Question</Button>
                </form>
              </div>
            </div>
          )}
          {step === "about_me_success" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <Zap className="size-24 text-accent mx-auto animate-pulse" />
              <h2 className="text-4xl font-headline italic">You know me better than anyone.</h2>
              <Button onClick={() => finishNode(5, "about_me")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}
          {step === "dino_game" && (
            <div onClick={handleJump} onKeyDown={(e) => e.key === " " && handleJump()} tabIndex={0} className="relative w-full h-[40vh] bg-secondary/5 rounded-3xl border border-primary/20 overflow-hidden cursor-pointer select-none outline-none">
              <div className="absolute top-4 right-6 text-right z-20"><p className="text-xs uppercase tracking-widest text-primary/60">Distance</p><p className="text-3xl font-mono text-white">{dinoScore}m / 6767m</p></div>
              <div className={cn(
                "absolute bottom-10 left-10 transition-all duration-300 ease-out z-20",
                isHurt && "text-destructive animate-pulse"
              )} style={{ transform: `translateY(-${dinoY}px)` }}>
                {isHurt ? <Skull className="size-10" /> : <Zap className="size-10 text-accent" />}
              </div>
              {obstacles.map(o => (
                <div key={o.id} className="absolute bottom-10 whitespace-nowrap bg-destructive/20 border border-destructive/40 px-2 py-1 rounded-md text-[8px] font-bold text-destructive uppercase tracking-tighter" style={{ left: `${o.left}%` }}>
                  {o.text}
                </div>
              ))}
              <div className="absolute bottom-10 w-full h-px bg-primary/20" />
            </div>
          )}
          {step === "customize" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-headline text-primary">Relationship Simulator 🧬</h2>
                <p className="text-xs text-primary/40 uppercase tracking-widest mt-1">Fine-tuning the dynamic</p>
              </div>
              
              <div className="grid gap-4 bg-secondary/10 p-6 rounded-3xl border border-primary/20">
                {Object.entries(relStats).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <Label className="capitalize text-[10px] font-bold tracking-wider opacity-60">{key}</Label>
                      <span className="text-[10px] font-mono text-primary/60">{value}%</span>
                    </div>
                    <Progress value={value} className="h-1.5" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Send Meme", action: () => updateRel({ fun: 10, communication: 5, chaos: 2 }) },
                  { label: "Start Deep Talk", action: () => updateRel({ trust: 15, communication: 15, sleep: -10 }) },
                  { label: "Tease", action: () => updateRel({ fun: 10, chaos: 15, trust: -2 }) },
                  { label: "Apologize", action: () => updateRel({ trust: 10, chaos: -15 }) },
                  { label: "Plan Date", action: () => updateRel({ fun: 15, trust: 10, sleep: -5 }) },
                  { label: "Overthink", action: () => updateRel({ chaos: 20, trust: -10, sleep: -15 }) },
                ].map((btn) => (
                  <Button 
                    key={btn.label} 
                    variant="outline" 
                    onClick={btn.action}
                    className="h-12 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-[10px] font-bold uppercase tracking-tight"
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>

              {relActions >= 5 && (
                <Button 
                  onClick={() => setStep("customize_result")} 
                  className="w-full h-14 bg-accent text-background font-bold text-lg animate-pulse"
                >
                  Synchronize Bond
                </Button>
              )}
            </div>
          )}
          {step === "customize_result" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <h2 className="text-4xl font-headline text-primary">Synchronization Complete.</h2>
              <p className="text-2xl font-headline text-white">Relationship dynamic stabilized. Current status: Legally Unseparable.</p>
              <Button onClick={() => finishNode(7, "customize")} className="bg-accent text-background">Accept Fate</Button>
            </div>
          )}
          {step === "flag_game" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-3xl font-headline text-center text-primary">Flag Check</h2>
              <div className="min-h-[150px] flex items-center justify-center text-center p-8 bg-secondary/10 rounded-3xl border border-primary/20">
                <p className="text-2xl font-headline italic text-white">{flags[flagIndex].text}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleFlag} className="h-20 bg-destructive/20 text-destructive"><XCircle className="mr-2" /> Red Flag</Button>
                <Button onClick={handleFlag} className="h-20 bg-green-500/20 text-green-500"><CheckCircle2 className="mr-2" /> Green Flag</Button>
              </div>
            </div>
          )}
          {step === "flag_success" && (
            <div className="text-center space-y-12 animate-in zoom-in duration-700">
               <Heart className="size-48 text-primary fill-primary/30 mx-auto heart-pulse" />
               <Button onClick={() => finishNode(8, "flag_game")} className="bg-accent text-background">Node Synchronized</Button>
            </div>
          )}
          {step === "wheel" && (
            <div className="space-y-8 text-center animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-primary">Affection Wheel</h2>
              <div className="relative flex justify-center py-12">
                <div className="relative size-80">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30 w-6 h-10 bg-accent rotate-180" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  <div className="w-full h-full rounded-full border-8 border-primary/20 overflow-hidden relative" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' }}>
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
              <Button disabled={wheelSpinning} onClick={spinWheel} className="w-full h-14 bg-accent text-background font-bold">{wheelSpinning ? "Spinning..." : "Spin the Wheel"}</Button>
              {wheelResult && !wheelSpinning && <Button variant="ghost" onClick={() => finishNode(9, "wheel")} className="text-primary/60">Continue</Button>}
            </div>
          )}
          {step === "rate_story" && (
            <div className="space-y-8 animate-in slide-in-from-left duration-500">
              <h2 className="text-3xl font-headline text-center text-primary">Love Story Rating</h2>
              <div className="space-y-10 bg-secondary/10 p-8 rounded-3xl border border-primary/20">
                {["Enemies to Lovers", "Friends to Lovers", "Slow Burn"].map((trope, i) => (
                  <div key={i} className="space-y-4">
                    <Label className="text-lg font-headline">{trope}</Label>
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1">Nah</Button>
                      <Button variant="outline" className="flex-1">Peak</Button>
                    </div>
                  </div>
                ))}
                <Button onClick={() => finishNode(10, "rate_story")} className="w-full h-14 bg-accent text-background font-bold">Finalize Tropes</Button>
              </div>
            </div>
          )}
          {step === "compatibility" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
               <h2 className="text-3xl font-headline text-center text-primary">Compatibility Scan</h2>
              <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl border border-primary/10">
                  <p className="text-lg font-medium">Pineapple on pizza?</p>
                  <RadioGroup defaultValue="no">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="p2" /><Label htmlFor="p2" className="text-green-500">No (Correct)</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="p1" /><Label htmlFor="p1" className="text-destructive">Yes (Wrong)</Label></div>
                  </RadioGroup>
                </div>
                {[
                  { q: "Do you steal blankets?", opts: ["Yes (Blanket Hog)", "Sometimes"] },
                  { q: "Would you survive a zombie apocalypse?", opts: ["Yes", "No"] },
                  { q: "Would you still love me if I was a worm?", opts: ["Obviously yes", "I'd keep you in a jar"] },
                  { q: "Burp butterflies or fart glitter?", opts: ["Burp butterflies", "Fart glitter"] },
                  { q: "If we're stranded on an island who survives?", opts: ["Me", "You"] },
                  { q: "If we were in a rom-com:", opts: ["Main couple", "Chaotic side couple", "Argue in rain"] },
                  { q: "Who fell first?", opts: ["Me", "You", "Same time"] }
                ].map((item, i) => (
                  <div key={i} className="space-y-4 bg-secondary/10 p-6 rounded-2xl border border-primary/10">
                    <p className="text-lg font-medium">{item.q}</p>
                    <RadioGroup defaultValue={item.opts[0]}>
                      {item.opts.map((o, idx) => (<div key={idx} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`q-${i}-${idx}`} /><Label htmlFor={`q-${i}-${idx}`}>{o}</Label></div>))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep("calculating")} className="w-full h-14 bg-accent text-background font-bold">Run Final Analysis</Button>
            </div>
          )}
          {step === "calculating" && (
            <div className="text-center space-y-8 animate-in fade-in duration-700">
              <Calculator className="size-24 text-primary mx-auto animate-bounce" />
              <h2 className="text-4xl font-headline italic text-accent">Calculating Destiny...</h2>
              <Progress value={undefined} className="h-2 bg-secondary/30" />
            </div>
          )}
          {step === "final" && (
            <div className="text-center space-y-12 animate-in fade-in duration-1000 max-w-2xl mx-auto">
              <Stars className="size-24 text-primary animate-pulse mx-auto" />
              <h1 className="text-7xl font-headline text-white tracking-tighter">100% Match</h1>
              <div className="bg-secondary/20 p-12 rounded-[3rem] border border-primary/20 space-y-6 backdrop-blur-xl">
                <Heart className="size-20 text-primary mx-auto fill-primary/20" />
                <p className="text-accent text-4xl font-headline italic leading-tight">"Idk but it looks like we're legally required to stay together forever."</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="ghost" className="text-primary/40 text-[10px] uppercase">Reset Simulation</Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
