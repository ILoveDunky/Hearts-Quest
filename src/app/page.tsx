"use client";

import React, { useState, useEffect } from "react";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Stars, 
  Gamepad2, 
  MessageSquareHeart, 
  UserPlus, 
  Flag, 
  RotateCw, 
  BookHeart, 
  Calculator,
  CheckCircle2,
  XCircle,
  Map as MapIcon,
  Lock,
  ArrowRight,
  UserCheck,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

type GameStep = 
  | "start" 
  | "map"
  | "q1" | "s1" 
  | "q2" | "s2" 
  | "q3" | "s3" 
  | "about_me" | "about_me_free" | "about_me_success"
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

const NODES: Node[] = [
  { id: "q1", label: "Matched Profile", icon: Heart, x: 20, y: 30 },
  { id: "q2", label: "Gamer Duo", icon: Gamepad2, x: 40, y: 20 },
  { id: "q3", label: "First Words", icon: MessageSquareHeart, x: 60, y: 35 },
  { id: "about_me", label: "The Legend Quiz", icon: UserCheck, x: 80, y: 45 },
  { id: "customize", label: "Boyfriend Lab", icon: UserPlus, x: 70, y: 15 },
  { id: "flag_game", label: "The Flags", icon: Flag, x: 50, y: 55 },
  { id: "wheel", label: "Affection Wheel", icon: RotateCw, x: 30, y: 75 },
  { id: "rate_story", label: "Love Tropes", icon: BookHeart, x: 10, y: 60 },
  { id: "compatibility", label: "Destiny Test", icon: Calculator, x: 15, y: 85 },
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

  const currentProgress = Math.min(((unlockedIndex) / NODES.length) * 100, 100);

  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");

  const finishNode = (nextIndex: number, currentId: GameStep) => {
    if (!completedNodes.includes(currentId)) {
      setCompletedNodes(prev => [...prev, currentId]);
    }
    setUnlockedIndex(Math.max(unlockedIndex, nextIndex));
    setStep("map");
  };

  // Memory Handlers
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

  // About Me Quiz Handlers
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

  // Flag Game Logic
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

  // Wheel Logic
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

  // Rigged Calculation Logic
  useEffect(() => {
    if (step === "calculating") {
      const timer = setTimeout(() => {
        setStep("final");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 transition-all duration-1000 overflow-hidden">
      <StarField intensity={step === "map" || step === "final" || step === "calculating" ? "high" : "normal"} />

      {/* BACKGROUND MAP LINES */}
      {step === "map" && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {NODES.map((node, i) => {
            if (i === 0) return null;
            const prev = NODES[i - 1];
            return (
              <line 
                key={i}
                x1={`${prev.x}%`} y1={`${prev.y}%`}
                x2={`${node.x}%`} y2={`${node.y}%`}
                stroke="white"
                strokeWidth="2"
                className={cn("constellation-line", unlockedIndex < i && "opacity-20")}
              />
            );
          })}
        </svg>
      )}

      <div className="z-10 w-full max-w-2xl py-12 h-full flex flex-col justify-center">
        
        {/* PROGRESS HEADER */}
        {step !== "start" && step !== "final" && step !== "calculating" && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 space-y-2 z-50">
            <div className="flex justify-between items-center text-primary/60 text-[10px] uppercase tracking-widest font-bold">
              <span>Star System Synced</span>
              <span>{Math.round(currentProgress)}%</span>
            </div>
            <Progress value={currentProgress} className="h-1 bg-secondary/30" />
          </div>
        )}

        {/* START SCREEN */}
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

        {/* CONSTELLATION MAP */}
        {step === "map" && (
          <div className="relative w-full aspect-square md:aspect-video animate-in fade-in zoom-in duration-1000">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2 opacity-40">
                <MapIcon className="size-12 mx-auto text-primary" />
                <p className="text-xs uppercase tracking-[0.3em] font-bold">Select Active Node</p>
              </div>
            </div>

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
                    "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 group",
                    !isUnlocked && "opacity-30 grayscale cursor-not-allowed",
                    isUnlocked && "hover:scale-110"
                  )}
                >
                  <div className={cn(
                    "size-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative",
                    isCompleted ? "bg-primary/20 border-primary text-primary" : "border-primary/40 bg-background text-primary/40",
                    isActive && "border-accent text-accent node-pulse scale-125 z-20 shadow-[0_0_20px_rgba(216,180,254,0.5)]"
                  )}>
                    {isUnlocked ? <node.icon className="size-6" /> : <Lock className="size-5" />}
                    {isActive && (
                      <div className="absolute -inset-2 border border-accent/30 rounded-full animate-ping" />
                    )}
                  </div>
                  <span className={cn(
                    "mt-3 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-all",
                    isActive ? "text-accent opacity-100 translate-y-0" : "text-primary/40 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                  )}>
                    {node.label}
                  </span>
                </button>
              );
            })}

            {unlockedIndex === NODES.length && (
              <Button 
                onClick={() => setStep("final")}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-12 py-8 bg-accent text-background rounded-full font-bold animate-pulse shadow-[0_0_50px_rgba(230,230,250,0.6)]"
              >
                FINAL DESTINY
              </Button>
            )}
          </div>
        )}

        {/* CHALLENGE SCREENS */}
        <div className="max-w-lg mx-auto w-full">
          {/* Q1: Match Photo */}
          {step === "q1" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-primary">What was the first profile pictures we matched?</h2>
              <form onSubmit={handleQ1} className="space-y-4">
                <Input 
                  autoFocus
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl"
                />
                <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Check Memory</Button>
              </form>
            </div>
          )}

          {step === "s1" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <div className="flex justify-center">
                <div className="p-8 rounded-full bg-primary/10 border border-primary/20">
                  <Heart className="size-20 text-primary fill-primary" />
                </div>
              </div>
              <h2 className="text-4xl font-headline italic">We didn't know it yet but that's when it all started.</h2>
              <Button onClick={() => finishNode(1, "q1")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}

          {/* Q2: Minecraft */}
          {step === "q2" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-primary">What was the first game we played together?</h2>
              <form onSubmit={handleQ2} className="space-y-4">
                <Input 
                  autoFocus
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Game title..."
                  className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl"
                />
                <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Submit</Button>
              </form>
            </div>
          )}

          {step === "s2" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <Gamepad2 className="size-24 text-primary mx-auto animate-bounce" />
              <h2 className="text-4xl font-headline italic">The start of an amazing gaming duo in the making.</h2>
              <Button onClick={() => finishNode(2, "q2")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}

          {/* Q3: First Words */}
          {step === "q3" && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-3xl font-headline text-primary">What was the first thing I said to you when we first met?</h2>
              <form onSubmit={handleQ3} className="space-y-4">
                <Input 
                  autoFocus
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="The exact phrase..."
                  className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl"
                />
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

          {/* ABOUT ME QUIZ */}
          {step === "about_me" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <h2 className="text-3xl font-headline text-primary">Testing Your Knowledge...</h2>
              
              {quizStep === 0 && (
                <div className="space-y-6">
                  <p className="text-xl">Am I a morning person or night person?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {["Morning", "Night", "Both"].map((opt) => (
                      <Button key={opt} variant="outline" onClick={() => handleAboutMeMC(opt === "Both")} className="h-14 text-lg border-primary/20 hover:bg-primary/10">
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 1 && (
                <div className="space-y-6">
                  <p className="text-xl">What is my biggest fear?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {["Spiders", "Heights", "Rejection"].map((opt) => (
                      <Button key={opt} variant="outline" onClick={() => handleAboutMeMC(opt === "Rejection")} className="h-14 text-lg border-primary/20 hover:bg-primary/10">
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-6">
                  <p className="text-xl">What is my favorite joke?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "Crazy? I was crazy once. They locked me in a room a rubber room a rubber room with rats and rats make me crazy.",
                      "6", "7", "6", "7", "6"
                    ].map((opt, i) => (
                      <Button key={i} variant="outline" onClick={() => handleAboutMeMC(opt.startsWith("Crazy"))} className="h-auto py-4 text-left px-6 border-primary/20 hover:bg-primary/10">
                        {opt}
                      </Button>
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
                  <Input 
                    autoFocus
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Tell me your thoughts..."
                    className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl"
                  />
                  <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Next Question</Button>
                </form>
              </div>
            </div>
          )}

          {step === "about_me_success" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <Zap className="size-24 text-accent mx-auto animate-pulse" />
              <h2 className="text-4xl font-headline italic">You know me better than anyone.</h2>
              <Button onClick={() => finishNode(4, "about_me")} className="bg-accent text-background">Node Synchronized <ArrowRight className="ml-2" /></Button>
            </div>
          )}

          {/* CUSTOMIZE BOYFRIEND */}
          {step === "customize" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-headline uppercase tracking-widest text-primary">Boyfriend Lab</h2>
                <p className="text-primary/60 italic">Dial in the settings.</p>
              </div>

              <div className="space-y-8 bg-secondary/10 p-6 rounded-2xl border border-primary/10 backdrop-blur-sm">
                {[
                  { l: "Cuddly", r: "Annoying" },
                  { l: "Calm", r: "Overdramatic" },
                  { l: "Mature", r: "Sends reels at 3am" },
                  { l: "Romantic", r: "Feral" },
                ].map((pair, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter opacity-60">
                      <span>{pair.l}</span>
                      <span>{pair.r}</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
                  </div>
                ))}
                <Button onClick={() => setStep("customize_result")} className="w-full h-14 bg-accent text-background font-bold text-lg">
                  Initialize Creation
                </Button>
              </div>
            </div>
          )}

          {step === "customize_result" && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700">
              <h2 className="text-4xl font-headline text-primary uppercase">Synchronization Complete.</h2>
              <div className="space-y-4">
                <p className="text-5xl font-headline text-white">You have created: Me.</p>
                <p className="text-primary/60 italic text-xl">Unfortunately this version is permanent.</p>
              </div>
              <Button onClick={() => finishNode(5, "customize")} className="bg-accent text-background">Accept Fate</Button>
            </div>
          )}

          {/* RED FLAG GREEN FLAG */}
          {step === "flag_game" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-headline uppercase tracking-widest text-primary">Flag Check</h2>
                <p className="text-primary/60">Decision required.</p>
              </div>

              <div className="min-h-[200px] flex items-center justify-center text-center p-8 bg-secondary/10 rounded-3xl border border-primary/20 shadow-xl relative overflow-hidden backdrop-blur-md">
                 <div key={flagIndex} className="animate-in slide-in-from-right duration-300">
                    <p className="text-2xl font-headline italic text-white">{flags[flagIndex].text}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleFlag} className="h-20 bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30 text-xl font-bold rounded-2xl">
                  <XCircle className="mr-2" /> Red Flag
                </Button>
                <Button onClick={handleFlag} className="h-20 bg-green-500/20 border border-green-500/40 text-green-500 hover:bg-green-500/30 text-xl font-bold rounded-2xl">
                  <CheckCircle2 className="mr-2" /> Green Flag
                </Button>
              </div>
            </div>
          )}

          {step === "flag_success" && (
            <div className="text-center space-y-12 animate-in zoom-in duration-700 py-12">
               <div className="flex justify-center relative">
                  <Heart className="size-48 text-primary fill-primary/30 heart-pulse" />
                  <Stars className="size-12 absolute top-0 right-0 text-accent animate-spin" />
               </div>
               <Button onClick={() => finishNode(6, "flag_game")} className="bg-accent text-background px-12 h-16 text-lg font-bold rounded-full">
                  Node Synchronized <ArrowRight className="ml-2" />
               </Button>
            </div>
          )}

          {/* AFFECTION WHEEL */}
          {step === "wheel" && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-headline uppercase tracking-widest text-primary">Affection Wheel</h2>
                <p className="text-primary/60 italic">RNG Reward System.</p>
              </div>

              <div className="relative flex justify-center py-12">
                <div className="relative size-80 group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    <div className="w-6 h-10 bg-accent clip-path-triangle rotate-180" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  </div>

                  <div 
                    className="w-full h-full rounded-full border-8 border-primary/20 bg-background overflow-hidden shadow-[0_0_50px_rgba(216,180,254,0.3)] relative"
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      transition: 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)'
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {wheelOptions.map((opt, i) => {
                        const startAngle = (i * 120);
                        const endAngle = ((i + 1) * 120);
                        const midAngle = startAngle + 60;
                        const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                        const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                        const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                        const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                        
                        return (
                          <g key={i}>
                            <path 
                              d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                              fill={i === 0 ? 'hsl(var(--primary) / 0.15)' : i === 1 ? 'hsl(var(--accent) / 0.15)' : 'hsl(var(--secondary) / 0.3)'}
                              stroke="hsl(var(--primary) / 0.3)"
                              strokeWidth="0.5"
                            />
                            <text 
                              x="50" y="20" 
                              transform={`rotate(${midAngle} 50 50)`}
                              fill="white" 
                              fontSize="3.5"
                              textAnchor="middle"
                              className="font-bold uppercase tracking-tighter"
                              style={{ paintOrder: 'stroke', stroke: 'black', strokeWidth: '0.5px' }}
                            >
                              {opt}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-8 rounded-full bg-accent border-4 border-background shadow-lg z-10 flex items-center justify-center">
                        <Stars className="size-4 text-background" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {wheelResult && !wheelSpinning && (
                <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl animate-in zoom-in duration-500">
                  <p className="text-xl font-headline text-accent uppercase tracking-widest">Unlocked: {wheelResult}</p>
                </div>
              )}

              <div className="space-y-4">
                <Button 
                  disabled={wheelSpinning} 
                  onClick={spinWheel} 
                  className="w-full h-14 bg-accent text-background text-lg font-bold rounded-full shadow-lg"
                >
                  {wheelSpinning ? "Spinning..." : "Spin the Wheel"}
                </Button>
                
                {wheelResult && !wheelSpinning && (
                   <Button variant="ghost" onClick={() => finishNode(7, "wheel")} className="text-primary/60 hover:text-primary">
                     Confirm Reward & Continue
                   </Button>
                )}
              </div>
            </div>
          )}

          {/* RATE OUR LOVE STORY */}
          {step === "rate_story" && (
            <div className="space-y-8 animate-in slide-in-from-left duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-headline uppercase tracking-widest text-primary">Story Trope Rating</h2>
                <p className="text-primary/60 italic">Define the narrative.</p>
              </div>

              <div className="space-y-10 bg-secondary/10 p-8 rounded-3xl border border-primary/20 backdrop-blur-sm">
                {["Enemies to Lovers", "Friends to Lovers", "Slow Burn"].map((trope, i) => (
                  <div key={i} className="space-y-4">
                    <Label className="text-lg font-headline">{trope}</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                ))}
                <Button onClick={() => finishNode(8, "rate_story")} className="w-full h-14 bg-accent text-background text-lg font-bold">
                  Finalize Tropes
                </Button>
              </div>
            </div>
          )}

          {/* COMPATIBILITY TEST */}
          {step === "compatibility" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
               <div className="text-center space-y-2">
                <h2 className="text-3xl font-headline uppercase tracking-widest text-primary">Compatibility Scan</h2>
                <p className="text-primary/60 italic">Scientific rigorousity: 100%.</p>
              </div>

              <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl border border-primary/10">
                  <p className="text-lg font-medium">Pineapple on pizza?</p>
                  <RadioGroup defaultValue="no">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="p2" />
                      <Label htmlFor="p2" className="text-green-500">No (Correct)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="p1" />
                      <Label htmlFor="p1" className="text-destructive">Yes (Wrong)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {[
                  { q: "Do you steal blankets?", opts: ["Yes (Blanket Hog)", "Sometimes"] },
                  { q: "Would you survive a zombie apocalypse?", opts: ["Yes", "No, I'd be the first to go"] },
                  { q: "Love me if I was a worm?", opts: ["Obviously yes", "I'd keep you in a jar"] },
                  { q: "Who survives longer on an island?", opts: ["Me", "You"] },
                  { q: "Rom-com status:", opts: ["Main Couple", "Chaotic Side Couple", "Arguing in the Rain"] },
                ].map((item, i) => (
                  <div key={i} className="space-y-4 bg-secondary/10 p-6 rounded-2xl border border-primary/10">
                    <p className="text-lg font-medium">{item.q}</p>
                    <RadioGroup defaultValue={item.opts[0]}>
                      {item.opts.map((o, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={o} id={`q-${i}-${idx}`} />
                          <Label htmlFor={`q-${i}-${idx}`}>{o}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <Button onClick={() => setStep("calculating")} className="w-full h-14 bg-accent text-background text-lg font-bold">
                Run Final Analysis
              </Button>
            </div>
          )}

          {/* CALCULATING */}
          {step === "calculating" && (
            <div className="text-center space-y-8 animate-in fade-in duration-700">
              <Calculator className="size-24 text-primary mx-auto animate-bounce" />
              <h2 className="text-4xl font-headline italic uppercase tracking-widest text-accent">Calculating Destiny...</h2>
              <div className="space-y-2">
                 <Progress value={undefined} className="h-2 bg-secondary/30" />
                 <p className="text-primary/60 text-xs uppercase tracking-[0.2em]">Cross-referencing soul patterns...</p>
              </div>
            </div>
          )}

          {/* FINAL RESULT */}
          {step === "final" && (
            <div className="text-center space-y-12 animate-in fade-in duration-1000 max-w-2xl mx-auto">
              <div className="flex justify-center">
                 <Stars className="size-24 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h1 className="text-7xl font-headline text-white tracking-tighter">100% Match</h1>
                <p className="text-accent uppercase tracking-[0.5em] text-sm">Synchronization Absolute</p>
              </div>
              
              <div className="bg-secondary/20 p-12 rounded-[3rem] border border-primary/20 text-center space-y-6 shadow-[0_0_50px_rgba(216,180,254,0.2)] relative backdrop-blur-xl">
                <Heart className="size-20 text-primary mx-auto fill-primary/20" />
                <p className="text-accent text-4xl font-headline italic leading-tight">
                  "Idk but it looks like we're legally required to stay together forever."
                </p>
              </div>

              <div className="space-y-4">
                 <h2 className="text-3xl font-headline text-white">Happy Valentine's Day!</h2>
                 <p className="text-primary/60 uppercase tracking-widest text-xs">Quest Complete // Memory Archived</p>
              </div>
              
              <Button onClick={() => { setStep("start"); setUnlockedIndex(0); setCompletedNodes([]); setRotation(0); setWheelResult(null); setQuizStep(0); setFreeQuizStep(0); }} variant="ghost" className="text-primary/40 hover:text-primary uppercase tracking-widest text-[10px]">
                Reset Simulation
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
