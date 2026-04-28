/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, CheckSquare, Settings2, RotateCcw, Clock, PiggyBank, FileText, AlertCircle, MountainSnow, Settings, Rocket, Sparkles, Info, Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function formatTime(seconds: number) {
  const m = Math.floor(Math.abs(seconds) / 60).toString().padStart(2, '0');
  const s = (Math.abs(seconds) % 60).toString().padStart(2, '0');
  return `${seconds < 0 ? '-' : ''}${m}:${s}`;
}

class AudioEngine {
  ctx: AudioContext | null = null;
  enabled = true;
  theme: 'digital' | 'soft' = 'soft';

  init() {
    if (this.enabled && !this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch(e) {}
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(frequency: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playBankUsed() {
    if (this.theme === 'digital') {
      this.playTone(300, 'square', 0.2, 0.05);
      setTimeout(() => this.playTone(200, 'square', 0.3, 0.05), 200);
    } else {
      this.playTone(349.23, 'sine', 0.4, 0.1); 
    }
  }

  playTimeOut() {
    if (this.theme === 'digital') {
      this.playTone(600, 'square', 0.1, 0.05);
      setTimeout(() => this.playTone(600, 'square', 0.2, 0.05), 150);
    } else {
      this.playTone(880, 'triangle', 0.2, 0.1); 
      setTimeout(() => this.playTone(880, 'triangle', 0.4, 0.1), 200);
    }
  }

  playSessionEnd() {
    if (this.theme === 'digital') {
      this.playTone(400, 'square', 0.1, 0.05);
      setTimeout(() => this.playTone(600, 'square', 0.1, 0.05), 150);
      setTimeout(() => this.playTone(800, 'square', 0.4, 0.05), 300);
    } else {
      this.playTone(523.25, 'sine', 0.2, 0.1); 
      setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 150); 
      setTimeout(() => this.playTone(783.99, 'sine', 0.4, 0.1), 300); 
      setTimeout(() => this.playTone(1046.50, 'sine', 0.6, 0.1), 450); 
    }
  }

  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch(e) {}
  }
}

const audio = new AudioEngine();

function TimerCircle({ 
  timeLeft, 
  timePerQ, 
  bankTime, 
  isPaused,
  showWhoosh
}: { 
  timeLeft: number;
  timePerQ: number;
  bankTime: number;
  isPaused: boolean;
  showWhoosh?: boolean;
}) {
  const radius = 100;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = timePerQ > 0 ? Math.max(0, timePerQ - timeLeft) / timePerQ : 0;
  const strokeDashoffset = circumference - Math.min(progress, 1) * circumference;

  const angle = progress * 360;
  const angleRad = (angle - 90) * (Math.PI / 180);
  
  const x = Math.cos(angleRad) * normalizedRadius; 
  const y = Math.sin(angleRad) * normalizedRadius;

  const isDrainingBank = timeLeft === 0 && bankTime > 0;
  const displayColor = isDrainingBank ? '#a1a1aa' : '#18181b';
  const strokeColor = isDrainingBank ? '#34d399' : '#10b981';

  const animationDuration = progress === 0 ? 0 : 1;

  return (
    <div className="relative flex items-center justify-center w-[200px] h-[200px] mx-auto scale-90 sm:scale-100">
      <AnimatePresence>
        {showWhoosh && (
          <motion.div
            initial={{ width: 176, height: 176, scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[8px] border-emerald-400 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute inset-0 -rotate-90 origin-center"
      >
        <circle
          stroke="rgba(255,255,255,0.4)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animationDuration, ease: "linear" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {/* Rocket */}
      <motion.div
        animate={{ x, y, rotate: angle + 45 }}
        transition={{ duration: animationDuration, ease: "linear" }}
        className="absolute z-10 flex items-center justify-center w-8 h-8"
      >
        <Rocket className={`w-6 h-6 drop-shadow-md transition-colors ${isPaused ? 'text-rose-500' : 'text-zinc-800'}`} fill={isPaused ? "#f43f5e" : "#18181b"} />
      </motion.div>

      <motion.div 
        animate={{ 
          color: displayColor,
          scale: isDrainingBank ? 0.95 : 1
        }}
        className="text-4xl sm:text-5xl font-semibold tracking-tighter tabular-nums drop-shadow-sm z-0"
      >
        {isDrainingBank ? "00:00" : formatTime(timeLeft)}
      </motion.div>
    </div>
  );
}

export default function App() {
  const [gameState, setGameState] = useState<'setup' | 'active' | 'summary'>('setup');
  
  // Settings
  const [totalQsInput, setTotalQsInput] = useState<number | string>(20);
  const [totalTimeInput, setTotalTimeInput] = useState<number | string>(180); // in minutes
  
  // Session tracking
  const [totalQs, setTotalQs] = useState(20);
  const [timePerQ, setTimePerQ] = useState(0); // in seconds
  
  const [clock, setClock] = useState({ qTimeLeft: 0, bankTime: 0, currentQ: 1 });
  const [extraTime, setExtraTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [notes, setNotes] = useState("");
  const [showWhoosh, setShowWhoosh] = useState(false);
  
  const [showInfo, setShowInfo] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundTheme, setSoundTheme] = useState<'soft' | 'digital'>('soft');

  useEffect(() => {
    audio.enabled = soundEnabled;
    audio.theme = soundTheme;
  }, [soundEnabled, soundTheme]);

  const startSession = () => {
    audio.init();
    const qs = Number(totalQsInput);
    const timeMins = Number(totalTimeInput);
    
    if (!qs || !timeMins || qs <= 0 || timeMins <= 0) {
      alert("Please enter valid numbers for questions and time.");
      return;
    }
    
    const tpq = Math.floor((timeMins * 60) / qs);
    setTotalQs(qs);
    setTimePerQ(tpq);
    
    setClock({ qTimeLeft: tpq, bankTime: 0, currentQ: 1 });
    setExtraTime(0);
    setIsPaused(false);
    setNotes("");
    
    setGameState('active');
  };

  const finishSession = () => {
    audio.playSessionEnd();
    setGameState('summary');
  };

  const markDone = () => {
    if (clock.qTimeLeft > 0) {
      setClock(prev => ({
        ...prev,
        bankTime: prev.bankTime + prev.qTimeLeft,
      }));
    }
    
    if (isPaused) {
      setIsPaused(false);
    }
    
    setClock(prev => {
      if (prev.currentQ >= totalQs) {
         return { ...prev, currentQ: prev.currentQ + 1 }; // trigger finish effect
      }
      return { ...prev, currentQ: prev.currentQ + 1, qTimeLeft: timePerQ };
    });
  };

  const prevQRef = useRef(1);
  useEffect(() => {
    if (gameState === 'active' && clock.currentQ > prevQRef.current && clock.currentQ <= totalQs) {
      audio.playWhoosh();
      setShowWhoosh(true);
      const t = setTimeout(() => setShowWhoosh(false), 800);
      prevQRef.current = clock.currentQ;
      return () => clearTimeout(t);
    }
    prevQRef.current = clock.currentQ;
  }, [clock.currentQ, gameState, totalQs]);

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (gameState !== 'active') return;

    let lastTime = Date.now();

    const timerId = setInterval(() => {
      const now = Date.now();
      if (now - lastTime >= 1000) {
        const delta = Math.floor((now - lastTime) / 1000);
        lastTime += delta * 1000;

        if (isPausedRef.current) {
          setExtraTime(e => e + delta);
        } else {
          setClock(prev => {
            let { qTimeLeft, bankTime, currentQ } = prev;
            let d = delta;

            while (d > 0 && currentQ <= totalQs) {
              if (qTimeLeft > 0) {
                const step = Math.min(qTimeLeft, d);
                qTimeLeft -= step;
                d -= step;
                if (qTimeLeft === 0 && currentQ <= totalQs) {
                  if (bankTime > 0) audio.playBankUsed();
                  else audio.playTimeOut();
                }
              } else if (bankTime > 0) {
                const step = Math.min(bankTime, d);
                bankTime -= step;
                d -= step;
                if (bankTime === 0 && currentQ <= totalQs) {
                  audio.playTimeOut();
                }
              } else {
                // Auto advance
                currentQ += 1;
                if (currentQ <= totalQs) qTimeLeft = timePerQ;
              }
            }
            return { qTimeLeft, bankTime, currentQ };
          });
        }
      }
    }, 250);

    return () => clearInterval(timerId);
  }, [gameState, totalQs, timePerQ]);

  useEffect(() => {
    if (clock.currentQ > totalQs && gameState === 'active') {
      finishSession();
      setClock(prev => ({ ...prev, currentQ: totalQs })); // Cap it for summary display
    }
  }, [clock.currentQ, totalQs, gameState]);


  return (
    <div className="scrolling-background min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 md:p-8 antialiased text-zinc-800 overflow-x-hidden relative">
      
      {/* Top Right Mini Controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button 
          onClick={() => setShowInfo(true)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:bg-white/30 transition-all shadow-md active:scale-95"
          title="Information & Settings"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* INFO MODAL */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl relative overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50"></div>
              
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-zinc-900 tracking-tight flex items-center gap-2">
                <Info className="w-6 h-6 text-emerald-600" />
                FocusTimer Features
              </h2>
              
              <ul className="text-sm space-y-4 mb-8 text-zinc-700 font-medium leading-relaxed">
                <li>
                  <strong className="text-zinc-900">Paced Engine:</strong> Calculates exact seconds needed per question based on your total time.
                </li>
                <li>
                  <strong className="text-zinc-900">The "Bank":</strong> Finish a question early to save the extra time for later harder questions.
                </li>
                <li>
                  <strong className="text-zinc-900">Auto-Advance:</strong> When a question's time hits 00:00, your Bank drains. At 00:00 bank, you automatically move to the next question.
                </li>
                <li>
                  <strong className="text-zinc-900">Accountability Pause:</strong> The main timer stops, but an extra red stopwatch runs to log wasted time.
                </li>
              </ul>
              
              {/* Audio Settings */}
              <div className="bg-white/40 p-4 rounded-xl border border-white/50 shadow-inner mb-8">
                <h3 className="font-bold mb-3 text-sm flex items-center gap-2 text-zinc-900">
                  <Volume2 className="w-4 h-4 text-emerald-600" /> 
                  Sound & Alerts
                </h3>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-zinc-700">Enable Sounds</span>
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                      <motion.div 
                        className="absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm"
                        animate={{ left: soundEnabled ? 28 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {soundEnabled && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between text-sm font-medium pt-2 border-t border-white/40"
                      >
                        <span className="text-zinc-700">Sound Theme</span>
                        <div className="flex bg-white/50 rounded-lg p-0.5 shadow-sm border border-white/50 cursor-pointer overflow-hidden">
                          <div 
                            onClick={() => { setSoundTheme('soft'); audio.playWhoosh(); }}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${soundTheme === 'soft' ? 'bg-emerald-500 text-white font-bold' : 'text-zinc-600 hover:bg-white/50'}`}
                          >
                            Soft
                          </div>
                          <div 
                            onClick={() => { setSoundTheme('digital'); audio.playTimeOut(); }}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${soundTheme === 'digital' ? 'bg-emerald-500 text-white font-bold' : 'text-zinc-600 hover:bg-white/50'}`}
                          >
                            Digital
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                Got it
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* SETUP SCREEN */}
        {gameState === 'setup' && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <MountainSnow className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">FocusTimer</h1>
            </div>
            <p className="text-zinc-600 text-sm mb-8 leading-relaxed font-medium">
              <b>One Rule:</b> This is for a single focused session. Set your total time, sit down, and start. No distractions.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Total Questions</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input 
                    type="number" 
                    value={totalQsInput}
                    onChange={(e) => setTotalQsInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" 
                    min="1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700">Total Time (Minutes)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input 
                    type="number" 
                    value={totalTimeInput}
                    onChange={(e) => setTotalTimeInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" 
                    min="1"
                  />
                </div>
              </div>
              
              <button 
                onClick={startSession}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Start Session
              </button>
            </div>
          </motion.div>
        )}

        {/* ACTIVE SESSION SCREEN */}
        {gameState === 'active' && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md glass-panel flex flex-col rounded-[2rem] sm:rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-white/40 flex justify-between items-center bg-white/20">
              <span className="text-xs sm:text-sm font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                <FileText className="w-4 h-4" />
                Q{clock.currentQ} <span className="hidden sm:inline">/ {totalQs}</span><span className="sm:hidden text-zinc-400">&nbsp;of {totalQs}</span>
              </span>
              <button 
                onClick={finishSession} 
                className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors uppercase tracking-wider flex items-center gap-1"
              >
                <Square className="w-3 h-3" fill="currentColor" />
                Finish Early
              </button>
            </div>

            {/* Timer Display */}
            <div className="px-5 sm:px-8 py-8 sm:py-10 flex flex-col items-center justify-center text-center relative">
              <TimerCircle 
                timeLeft={clock.qTimeLeft} 
                timePerQ={timePerQ} 
                bankTime={clock.bankTime} 
                isPaused={isPaused} 
                showWhoosh={showWhoosh}
              />
              
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {/* Bank Time Badge */}
                <motion.div 
                  animate={{
                    borderColor: (clock.qTimeLeft === 0 && clock.bankTime > 0) ? '#34d399' : 'rgba(52, 211, 153, 0)',
                    boxShadow: (clock.qTimeLeft === 0 && clock.bankTime > 0) ? '0 0 15px rgba(52, 211, 153, 0.5)' : 'none'
                  }}
                  className={`flex items-center gap-1.5 bg-emerald-50 border-2 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-all`}
                >
                  <PiggyBank className="w-4 h-4" />
                  Bank: <span>{formatTime(clock.bankTime)}</span>
                </motion.div>

                {/* Extra/Paused Time Badge */}
                <AnimatePresence>
                  {isPaused && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0, scale: 0.8 }}
                      animate={{ opacity: 1, width: 'auto', paddingLeft: 16, paddingRight: 16, scale: 1 }}
                      exit={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0, scale: 0.8 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                      className="flex items-center justify-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-sm font-bold shadow-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Paused: <span>{formatTime(extraTime)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div className="px-5 sm:px-8 pb-6 sm:pb-8 flex gap-3 sm:gap-4">
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 border font-bold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl transition-all active:scale-95 shadow-sm
                  ${isPaused 
                    ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                    : 'bg-white/60 border-white/60 text-zinc-700 hover:bg-white'}`}
              >
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor"/> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button 
                onClick={markDone} 
                className="flex-[2] flex items-center justify-center gap-1.5 sm:gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm sm:text-base py-3 sm:py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
              >
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                Done <span className="hidden sm:inline">(Next Q)</span>
              </button>
            </div>

            {/* Notes Section */}
            <div className="bg-white/30 p-5 sm:p-6 border-t border-white/40 backdrop-blur-md">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <FileText className="w-4 h-4" /> Session Notes
              </label>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full h-20 sm:h-24 bg-white/40 border border-white/50 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm font-medium text-zinc-800 placeholder-zinc-400 hide-scrollbar shadow-inner" 
                placeholder="Jot down questions to revisit (e.g., 'Review Q4 friction calculation')"
              ></textarea>
            </div>
          </motion.div>
        )}

        {/* SUMMARY SCREEN */}
        {gameState === 'summary' && (
          <motion.div 
            key="summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-4 border-white shadow-sm">
              <CheckSquare className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2 tracking-tight">Session Complete</h2>
            <p className="text-zinc-500 font-medium text-sm mb-6 sm:mb-8">Here is how you performed.</p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-white/60 p-4 sm:p-5 rounded-2xl border border-white/50 shadow-sm flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl font-light text-zinc-900 mb-1 sm:mb-2">{clock.currentQ}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Qs Completed</div>
              </div>
              <div className="bg-rose-50/80 p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center justify-center">
                <div className="text-2xl sm:text-3xl font-medium text-rose-600 mb-1 sm:mb-2">{formatTime(extraTime)}</div>
                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Extra Time</div>
              </div>
            </div>

            <div className="text-left bg-white/60 p-4 sm:p-5 rounded-2xl border border-white/50 mb-6 sm:mb-8 shadow-sm">
              <div className="text-[10px] font-bold text-zinc-500 uppercase mb-3 flex items-center gap-1 tracking-wider">
                <FileText className="w-3 h-3" /> Your Notes
              </div>
              <p className="text-sm font-medium text-zinc-800 whitespace-pre-wrap min-h-[4rem] italic">
                {notes || <span className="text-zinc-400 not-italic">No notes taken during this session.</span>}
              </p>
            </div>

            <button 
              onClick={() => {
                setGameState('setup');
                setClock({qTimeLeft: 0, bankTime: 0, currentQ: 1});
                setExtraTime(0);
                setNotes("");
              }}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 sm:py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              Start New Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

