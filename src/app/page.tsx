"use client";

import React, { useState } from "react";
import { StarField } from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Heart, Stars, Gamepad2, MessageSquareHeart } from "lucide-react";

type GameStep = "start" | "q1" | "s1" | "q2" | "s2" | "q3" | "s3" | "final";

export default function HeartsQuest() {
  const [step, setStep] = useState<GameStep>("start");
  const [answer, setAnswer] = useState("");

  const stepsOrder: GameStep[] = ["q1", "q2", "q3", "final"];
  const progress = Math.min(((stepsOrder.indexOf(step as GameStep) + 1) / stepsOrder.length) * 100, 100);

  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");

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

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 transition-all duration-1000">
      <StarField intensity={step.startsWith("s") || step === "final" ? "high" : "normal"} />

      <div className="z-10 w-full max-w-lg">
        {step !== "start" && step !== "final" && (
          <div className="mb-12 space-y-2">
            <div className="flex justify-between items-center text-primary/60 text-sm font-medium">
              <span>Your Quest Progress</span>
              <Heart className="size-4 fill-primary text-primary" />
            </div>
            <Progress value={progress} className="h-2 bg-secondary/30" />
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

        {step === "q1" && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-3xl font-headline text-primary">What was the first profile pictures we matched?</h2>
            <form onSubmit={handleQ1} className="space-y-4">
              <Input 
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="bg-secondary/20 border-primary/30 h-16 text-xl rounded-xl focus:ring-primary"
              />
              <Button type="submit" className="w-full h-14 bg-accent text-background text-lg font-bold">Check Memory</Button>
            </form>
          </div>
        )}

        {step === "s1" && (
          <div className="text-center space-y-8 animate-in zoom-in duration-700">
            <div className="flex justify-center">
              <div className="p-8 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_40px_rgba(216,180,254,0.3)]">
                <Heart className="size-20 text-primary fill-primary" />
              </div>
            </div>
            <h2 className="text-4xl font-headline italic">We didn't know it yet but that's when it all started.</h2>
            <Button onClick={() => setStep("q2")} className="bg-accent text-background">Next Question</Button>
          </div>
        )}

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
            <h2 className="text-4xl font-headline italic">The most important question I ever asked.</h2>
            <Button 
              onClick={() => setStep("final")} 
              className="bg-accent text-background"
            >
              Finish Quest
            </Button>
          </div>
        )}

        {step === "final" && (
          <div className="text-center space-y-8 animate-in fade-in duration-1000 max-w-2xl mx-auto">
            <div className="flex justify-center">
               <Stars className="size-24 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl font-headline text-white">Happy Valentine's Day!</h1>
            <p className="text-primary/80 text-xl">You completed the Hearts Quest. You remember everything perfectly.</p>
            
            <div className="bg-secondary/20 p-8 rounded-3xl border border-primary/20 text-center space-y-6 shadow-2xl">
              <Heart className="size-16 text-primary mx-auto fill-primary/20" />
              <p className="text-accent text-2xl font-headline italic">
                "Every moment with you is a memory I cherish."
              </p>
            </div>
            
            <Button onClick={() => setStep("start")} variant="ghost" className="text-primary/40 hover:text-primary">Play Again</Button>
          </div>
        )}
      </div>
    </main>
  );
}