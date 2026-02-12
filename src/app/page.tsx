
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
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type GameStep = 
  | "start" 
  | "q1" | "s1" 
  | "q2" | "s2" 
  | "q3" | "s3" 
  | "customize" | "customize_result" 
  | "flag_game" | "wheel" 
  | "rate_story" | "compatibility" | "calculating" 
  | "final";

export default function HeartsQuest() {
  const [step, setStep] = useState<GameStep>("start");
  const [answer, setAnswer] = useState("");
  const [flagIndex, setFlagIndex] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Steps for progress bar
  const stepsOrder: GameStep[] = [
    "q1", "q2", "q3", "customize", "flag_game", "wheel", "rate_story", "compatibility", "final"
  ];
  const progress = Math.min(((stepsOrder.indexOf(step as GameStep) + 1) / stepsOrder.length) * 100, 100);

  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");

  // Handlers for memory questions
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

  // Flag Game Logic
  const flags = [
    { text: "Insists on splitting the check", ideal: "red" },
    { text: "Ordering for you", ideal: "red" },
    { text: "Calling you pet names only", ideal: "green" },
    { text: "Likes his coffee black", ideal: "green" },
    { text: "Remembers your orders for everything", ideal: "green" },
    { text: "Still plays Minecraft at 3am", ideal: "green" },
    { text: "Creates a whole website for valentines day", ideal: "green" },
  ];

  const handleFlag = () => {
    if (flagIndex < flags.length - 1) {
      setFlagIndex(prev => prev + 1);
    } else {
      setStep("wheel");
    }
  };

  // Wheel Logic
  const wheelOptions = [
    "1 full minute of me complimenting you.",
    "You have to try a stupid pick up line on me.",
    "1 hour of Overwatch"
  ];

  const spinWheel = () => {
    setWheelSpinning(true);
    setWheelResult(null);
    setTimeout(() => {
      const result = wheelOptions[Math.floor(Math.random() * wheelOptions.length)];
      setWheelResult(result);
      setWheelSpinning(false);
    }, 2000);
  };

  // Rigged Calculation Logic
  useEffect(() => {
    if (step === "calculating") {
      const timer = setTimeout(() => {
        setStep("final");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 transition-all duration-1000 overflow-y-auto">
      <StarField intensity={step.startsWith("s") || step === "final" || step === "calculating" ? "high" : "normal"} />

      <div className="z-10 w-full max-w-lg py-12">
        {step !== "start" && step !== "final" && step !== "calculating" && (
          <div className="mb-12 space-y-2">
            <div className="flex justify-between items-center text-primary/60 text-sm font-medium">
              <span>Your Quest Progress</span>
              <Heart className="size-4 fill-primary text-primary" />
            </div>
            <Progress value={progress} className="h-2 bg-secondary/30" />
          </div>
        )}

        {/* START */}
        {step === "start" && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Heart className="size-24 text-primary fill-primary/20 heart-pulse" />
                <Stars className="size-8 absolute -top-2 -right-2 text-accent" />
              </div>
            </div>
            <h1 className="text-5xl font-headline tracking-tight text-white">Hi. This is for my Pretty Girl</h1>
            <p className="text-primary/60 italic">Are you ready for a little scavenger hunt through our memories?</p>
            <Button 
              size="lg" 
              onClick={() => setStep("q1")}
              className="px-12 py-8 text-xl bg-accent text-background hover:bg-primary transition-all rounded-full shadow-[0_0_20px_rgba(230,230,250,0.4)]"
            >
              Start
            </Button>
          </div>
        )}

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
            <Button onClick={() => setStep("q2")} className="bg-accent text-background">Next Question</Button>
          </div>
        )}

        {/* Q2: Minecraft */}
        {step === "q2" && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-2 text-primary/60 mb-2">
              <Gamepad2 className="size-5" />
              <span className="text-sm">Gamer Duo Check</span>
            </div>
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
            <div className="flex justify-center">
              <Gamepad2 className="size-24 text-primary animate-bounce" />
            </div>
            <h2 className="text-4xl font-headline italic">The start of an amazing gaming duo in the making.</h2>
            <Button onClick={() => setStep("q3")} className="bg-accent text-background">Almost there...</Button>
          </div>
        )}

        {/* Q3: First Words */}
        {step === "q3" && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-2 text-primary/60 mb-2">
              <MessageSquareHeart className="size-5" />
              <span className="text-sm">The First Words</span>
            </div>
            <h2 className="text-3xl font-headline text-primary">What was the first thing I said to you when we first met?</h2>
            <form onSubmit={handleQ3} className="space-y-4">
              <Input 
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="The exact (or almost exact) phrase..."
                className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl"
              />
              <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Answer</Button>
            </form>
          </div>
        )}

        {step === "s3" && (
          <div className="text-center space-y-8 animate-in zoom-in duration-700">
            <div className="flex justify-center">
              <MessageSquareHeart className="size-24 text-primary" />
            </div>
            <h2 className="text-4xl font-headline italic">The most important words ever spoken.</h2>
            <Button 
              onClick={() => setStep("customize")} 
              className="bg-accent text-background"
            >
              Next: The Boyfriend Lab
            </Button>
          </div>
        )}

        {/* CUSTOMIZE BOYFRIEND */}
        {step === "customize" && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
              <UserPlus className="size-12 text-primary mx-auto" />
              <h2 className="text-3xl font-headline">Customize Your Boyfriend</h2>
              <p className="text-primary/60 italic">Dial it in exactly how you want it.</p>
            </div>

            <div className="space-y-8 bg-secondary/10 p-6 rounded-2xl border border-primary/10">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Cuddly</span>
                  <span>Annoying</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Calm</span>
                  <span>Overdramatic</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Mature</span>
                  <span>Sends reels at 3am</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Romantic</span>
                  <span>Feral</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
              </div>

              <Button onClick={() => setStep("customize_result")} className="w-full h-14 bg-accent text-background font-bold text-lg">
                Create Boyfriend
              </Button>
            </div>
          </div>
        )}

        {step === "customize_result" && (
          <div className="text-center space-y-8 animate-in zoom-in duration-700">
            <h2 className="text-4xl font-headline">Congratulations.</h2>
            <div className="space-y-4">
              <p className="text-5xl font-headline text-white animate-pulse">You have created: Me.</p>
              <p className="text-primary/60 italic text-xl">Unfortunately this version is permanent.</p>
            </div>
            <Button onClick={() => setStep("flag_game")} className="bg-accent text-background">Accept Fate</Button>
          </div>
        )}

        {/* RED FLAG GREEN FLAG */}
        {step === "flag_game" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <Flag className="size-12 text-primary mx-auto" />
              <h2 className="text-3xl font-headline">Red Flag ↔ Green Flag</h2>
              <p className="text-primary/60">Rapid fire. No thinking.</p>
            </div>

            <div className="min-h-[200px] flex items-center justify-center text-center p-8 bg-secondary/10 rounded-3xl border border-primary/20 shadow-xl relative overflow-hidden">
               <div key={flagIndex} className="animate-in slide-in-from-right duration-300">
                  <p className="text-2xl font-headline italic text-white">{flags[flagIndex].text}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleFlag}
                className="h-20 bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30 text-xl font-bold rounded-2xl"
              >
                <XCircle className="mr-2" /> Red Flag
              </Button>
              <Button 
                onClick={handleFlag}
                className="h-20 bg-green-500/20 border border-green-500/40 text-green-500 hover:bg-green-500/30 text-xl font-bold rounded-2xl"
              >
                <CheckCircle2 className="mr-2" /> Green Flag
              </Button>
            </div>
          </div>
        )}

        {/* AFFECTION WHEEL */}
        {step === "wheel" && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500 text-center">
            <div className="space-y-2">
              <RotateCw className="size-12 text-primary mx-auto" />
              <h2 className="text-3xl font-headline">Affection Wheel</h2>
              <p className="text-primary/60">Spin to see your prize.</p>
            </div>

            <div className="relative flex justify-center py-8">
              <div className={cn(
                "size-64 rounded-full border-4 border-primary/30 bg-secondary/10 flex items-center justify-center relative",
                wheelSpinning && "animate-spin-slow"
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-1 h-32 bg-accent absolute top-0 origin-bottom" />
                   <div className="grid grid-cols-1 gap-2 text-[10px] text-primary/40 p-4">
                      {wheelOptions.map((opt, i) => <span key={i} className="max-w-[100px] leading-tight">{opt}</span>)}
                   </div>
                </div>
                <Stars className="size-12 text-accent" />
              </div>
            </div>

            {wheelResult && (
              <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl animate-in zoom-in duration-500">
                <p className="text-xl font-headline text-accent">{wheelResult}</p>
              </div>
            )}

            <Button 
              disabled={wheelSpinning}
              onClick={spinWheel} 
              className="w-full h-14 bg-accent text-background text-lg font-bold"
            >
              {wheelSpinning ? "Spinning..." : "Spin the Wheel"}
            </Button>
            
            {wheelResult && !wheelSpinning && (
               <Button variant="ghost" onClick={() => setStep("rate_story")} className="text-primary/60">Continue</Button>
            )}
          </div>
        )}

        {/* RATE OUR LOVE STORY */}
        {step === "rate_story" && (
          <div className="space-y-8 animate-in slide-in-from-left duration-500">
            <div className="text-center space-y-2">
              <BookHeart className="size-12 text-primary mx-auto" />
              <h2 className="text-3xl font-headline">Rate Our Love Story</h2>
              <p className="text-primary/60 italic">Which trope fits us best?</p>
            </div>

            <div className="space-y-10 bg-secondary/10 p-8 rounded-3xl border border-primary/20">
              <div className="space-y-4">
                <Label className="text-lg">Enemies to Lovers</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="space-y-4">
                <Label className="text-lg">Friends to Lovers</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="space-y-4">
                <Label className="text-lg">Slow Burn</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <Button onClick={() => setStep("compatibility")} className="w-full h-14 bg-accent text-background text-lg font-bold">
                Submit Rating
              </Button>
            </div>
          </div>
        )}

        {/* COMPATIBILITY TEST */}
        {step === "compatibility" && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
             <div className="text-center space-y-2">
              <Calculator className="size-12 text-primary mx-auto" />
              <h2 className="text-3xl font-headline">Compatibility Test</h2>
              <p className="text-primary/60 italic">This is scientific. Trust me.</p>
            </div>

            <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
              <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl">
                <p className="text-lg font-medium">Pineapple on pizza?</p>
                <RadioGroup defaultValue="yes">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="p1" />
                    <Label htmlFor="p1">Yes (Correct)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="p2" />
                    <Label htmlFor="p2">No (Wrong)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl">
                <p className="text-lg font-medium">Do you steal blankets when sleeping?</p>
                <RadioGroup defaultValue="sometimes">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="b1" />
                    <Label htmlFor="b1">I'm a blanket hog</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sometimes" id="b2" />
                    <Label htmlFor="b2">Only sometimes</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl">
                <p className="text-lg font-medium">Would you still love me if I was a worm?</p>
                <RadioGroup defaultValue="yes">
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="w1" />
                    <Label htmlFor="w1">Obviously yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="w2" />
                    <Label htmlFor="w2">I'd keep you in a jar</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl">
                <p className="text-lg font-medium">If we were in a rom-com:</p>
                <RadioGroup defaultValue="main">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="main" id="r1" />
                    <Label htmlFor="r1">We'd be the main couple</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="side" id="r2" />
                    <Label htmlFor="r2">The chaotic side couple</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rain" id="r3" />
                    <Label htmlFor="r3">We'd argue in the rain</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl">
                <p className="text-lg font-medium">Who fell first?</p>
                <RadioGroup defaultValue="me">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="me" id="f1" />
                    <Label htmlFor="f1">Me.</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="you" id="f2" />
                    <Label htmlFor="f2">You.</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="same" id="f3" />
                    <Label htmlFor="f3">Same time.</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button onClick={() => setStep("calculating")} className="w-full h-14 bg-accent text-background text-lg font-bold">
              Calculate Compatibility
            </Button>
          </div>
        )}

        {/* CALCULATING */}
        {step === "calculating" && (
          <div className="text-center space-y-8 animate-in fade-in duration-700">
            <Calculator className="size-24 text-primary mx-auto animate-bounce" />
            <h2 className="text-4xl font-headline italic">Analyzing results...</h2>
            <div className="space-y-2">
               <Progress value={undefined} className="h-2 bg-secondary/30" />
               <p className="text-primary/60 text-sm">Cross-referencing memories and snack preferences...</p>
            </div>
          </div>
        )}

        {/* FINAL RESULT */}
        {step === "final" && (
          <div className="text-center space-y-8 animate-in fade-in duration-1000 max-w-2xl mx-auto">
            <div className="flex justify-center">
               <Stars className="size-24 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl font-headline text-white">100% Match!</h1>
            
            <div className="bg-secondary/20 p-8 rounded-3xl border border-primary/20 text-center space-y-6 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 bg-accent text-background px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Legally Binding
              </div>
              <Heart className="size-16 text-primary mx-auto fill-primary/20" />
              <p className="text-accent text-3xl font-headline italic leading-snug">
                "Idk but it looks like we're legally required to stay together forever."
              </p>
            </div>

            <div className="space-y-2">
               <h2 className="text-2xl font-headline text-white">Happy Valentine's Day!</h2>
               <p className="text-primary/60">You completed the Hearts Quest.</p>
            </div>
            
            <Button onClick={() => setStep("start")} variant="ghost" className="text-primary/40 hover:text-primary">Play Again</Button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
