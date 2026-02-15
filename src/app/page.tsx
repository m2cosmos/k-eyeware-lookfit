'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Camera, ShieldCheck, Sparkles, ShoppingBag, Loader2, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Monet.design Inspired Constants
const MONET_COLORS = {
  gold: '#D4AF37',
  glass: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)',
  accent: 'rgba(212, 175, 55, 0.15)'
};

const RECOMMENDATIONS = {
  Square: [
    { id: 1, name: 'Royal Gold Circular', price: '₩289,000', label: 'PREMIUM' },
    { id: 2, name: 'Ethereal Oval', price: '₩215,000', label: 'ELEGANT' },
    { id: 3, name: 'Commander Aviator', price: '₩345,000', label: 'BOLD' },
  ],
  Unknown: [{ id: 0, name: 'Analyzing...', price: '---', label: '' }]
};

const generateMockLandmarks = () => {
  const points = [];
  for (let i = 0; i < 40; i++) {
    points.push({
      id: i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      delay: Math.random() * 1.2
    });
  }
  return points;
};

export default function MonetRemasterDashboard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [analysis, setAnalysis] = useState({
    faceType: 'Analyzing',
    trustScore: 0,
    desc: '대표님의 안면 구조와 황금 비율을 정밀 분석 중입니다.'
  });

  const landmarks = useMemo(() => generateMockLandmarks(), []);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          setTimeout(() => setShowPoints(true), 400);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysis({
              faceType: 'Square',
              trustScore: 98,
              desc: '직선적인 턱선을 부드럽게 감싸주는 라운드 및 에비에이터 프레임이 대표님의 지적인 카리스마를 극대화합니다.'
            });
          }, 3500);
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    setupCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const currentRecs = RECOMMENDATIONS[analysis.faceType as keyof typeof RECOMMENDATIONS] || RECOMMENDATIONS.Unknown;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D4AF37]/30 overflow-x-hidden">
      {/* Monet Style Header */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-8 flex justify-between items-center bg-gradient-to-b from-[#050505] to-transparent">
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#D4AF37] text-2xl font-black tracking-tighter leading-none"
          >
            K-EYEWARE
          </motion.h1>
          <span className="text-[9px] text-white/30 tracking-[0.4em] font-bold mt-1">LOOKFIT REMASTERED</span>
        </div>
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="h-10 w-10 bg-[#D4AF37]/5 rounded-full border border-[#D4AF37]/20 flex items-center justify-center backdrop-blur-xl"
        >
          <User className="text-[#D4AF37] w-5 h-5" />
        </motion.div>
      </header>

      <main className="pt-24 px-6 pb-32">
        {/* 1. Camera Section with Glassmorphism HUD */}
        <section className="relative mb-10 aspect-[4/5] bg-[#0A0A0A] rounded-[3rem] border border-white/5 flex flex-col items-center justify-center overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          <video 
            ref={videoRef} 
            autoPlay playsInline muted 
            className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${streamActive ? 'opacity-40' : 'opacity-0'} transition-opacity duration-1500`}
          />
          
          {/* Constellation Effect */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {showPoints && isAnalyzing && landmarks.map((pt) => (
              <motion.div
                key={pt.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.6] }}
                transition={{ delay: pt.delay, duration: 0.6 }}
                className="absolute w-1 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              />
            ))}
          </div>

          {!streamActive && (
            <div className="z-10 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin opacity-40" />
              <span className="text-[9px] font-bold tracking-[0.3em] text-[#D4AF37]/60">SYNCHRONIZING...</span>
            </div>
          )}

          {/* HUD Brackets */}
          <div className="absolute inset-10 border border-[#D4AF37]/10 rounded-[2.5rem] pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-[#D4AF37]/30 rounded-full" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-[#D4AF37]/30 rounded-full" />
          </div>
        </section>

        {/* 2. Analysis Report - Monet Glass Style */}
        <section className="relative mb-12">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
                <div className="h-12 w-full bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-32 w-full bg-white/5 rounded-3xl animate-pulse" />
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.2em] uppercase opacity-60">Analysis Result</span>
                  <h2 className="text-4xl font-light tracking-tight leading-[1.1]">
                    대표님의 얼굴형은 <br/>
                    <span className="font-bold text-[#D4AF37]">각진형(Square)</span> 입니다.
                  </h2>
                </div>

                <div className="relative group overflow-hidden bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF37]/10 blur-[60px] rounded-full group-hover:bg-[#D4AF37]/20 transition-all duration-700" />
                  
                  <div className="relative z-10 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Synergy Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#D4AF37] text-6xl font-black tracking-tighter tabular-nums">+{analysis.trustScore}</span>
                        <span className="text-[#D4AF37] text-2xl font-bold">%</span>
                      </div>
                    </div>
                    <Sparkles className="text-[#D4AF37] w-12 h-12 opacity-30 animate-pulse" />
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-white/50 text-sm leading-relaxed font-medium italic">
                      "{analysis.desc}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 3. Curation - Monet Soft Card Style */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Exclusive Curation</h3>
            <ChevronRight className="w-4 h-4 text-[#D4AF37] opacity-40" />
          </div>
          
          <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide">
            {currentRecs.map((item, idx) => (
              <ProductCard key={item.id} idx={idx} {...item} isAnalyzing={isAnalyzing} />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Floating Nav */}
      <nav className="fixed bottom-8 inset-x-6 z-50">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full p-4 flex justify-around shadow-2xl">
          <div className="flex flex-col items-center gap-1 text-[#D4AF37]">
            <Camera className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Scan</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-white/20">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-widest">Shop</span>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        body { background: #050505; }
      `}</style>
    </div>
  );
}

function ProductCard({ name, price, label, idx, isAnalyzing }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isAnalyzing ? 0.2 : 1, x: 0 }}
      transition={{ delay: idx * 0.1, type: 'spring' }}
      className="min-w-[180px] bg-white/[0.02] backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-xl"
    >
      <div className="aspect-square bg-black/40 rounded-[2rem] border border-white/5 flex items-center justify-center p-6 relative group overflow-hidden">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent relative">
          <div className="absolute -top-1.5 left-2 w-4 h-4 border border-[#D4AF37]/40 rounded-full bg-[#050505]" />
          <div className="absolute -top-1.5 right-2 w-4 h-4 border border-[#D4AF37]/40 rounded-full bg-[#050505]" />
        </div>
        <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="space-y-1 px-1">
        <span className="text-[7px] font-black text-[#D4AF37] tracking-widest opacity-60 uppercase">{label}</span>
        <p className="text-[11px] font-bold truncate text-white uppercase tracking-tight leading-tight">{name}</p>
        <p className="text-[#D4AF37] text-xs font-black tabular-nums tracking-widest">{price}</p>
      </div>
    </motion.div>
  );
}
