'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Camera, ShieldCheck, Sparkles, ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 가상 추천 데이터
const RECOMMENDATIONS = {
  Square: [
    { id: 1, name: 'Classic Gold Round', price: '₩249,000' },
    { id: 2, name: 'Modern Silk Oval', price: '₩189,000' },
    { id: 3, name: 'Seoul Aviator', price: '₩310,000' },
  ],
  Round: [
    { id: 4, name: 'Edge Square Black', price: '₩210,000' },
    { id: 5, name: 'Titanium Rectangle', price: '₩275,000' },
    { id: 6, name: 'Urban Wayfarer', price: '₩195,000' },
  ],
  Oval: [
    { id: 7, name: 'Any-Fit Universal', price: '₩220,000' },
    { id: 8, name: 'Creative Geometric', price: '₩340,000' },
    { id: 9, name: 'Minimalist Rimless', price: '₩299,000' },
  ],
  Unknown: [
    { id: 0, name: 'Analyzing...', price: '---' },
  ]
};

// 가상 랜드마크 포인트 생성
const generateMockLandmarks = () => {
  const points = [];
  for (let i = 0; i < 30; i++) {
    points.push({
      id: i,
      x: 20 + Math.random() * 60, // 20% to 80%
      y: 20 + Math.random() * 60, // 20% to 80%
      delay: Math.random() * 1.5
    });
  }
  return points;
};

export default function LookFitDashboard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [analysis, setAnalysis] = useState({
    faceType: 'Analyzing',
    trustScore: 0,
    desc: '대표님의 안면 데이터를 정밀 분석 중입니다...'
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
          
          // 랜드마크 컨스텔레이션 연출 시퀀스
          setTimeout(() => setShowPoints(true), 500);
          
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysis({
              faceType: 'Square',
              trustScore: 98,
              desc: '직선적인 턱선을 부드럽게 감싸주는 라운드 프레임이 대표님의 신뢰도를 극대화합니다.'
            });
          }, 4000);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const currentRecs = RECOMMENDATIONS[analysis.faceType as keyof typeof RECOMMENDATIONS] || RECOMMENDATIONS.Unknown;

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans p-6 pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h1 className="text-[#C9A227] text-xl font-black tracking-tighter uppercase italic leading-none">K-EYEWARE</h1>
          <span className="text-[10px] text-white/40 tracking-[0.3em] font-bold">LOOKFIT PRO</span>
        </div>
        <div className="bg-[#C9A227]/10 p-2 rounded-full border border-[#C9A227]/20 shadow-[0_0_15px_rgba(201,162,39,0.1)]">
          <ShieldCheck className="text-[#C9A227] w-5 h-5" />
        </div>
      </header>

      {/* 1. Camera / Scan Area (Landmark Constellation Effect) */}
      <section className="relative mb-8 aspect-[3/4] bg-black rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${streamActive ? 'opacity-60' : 'opacity-0'} transition-opacity duration-1000`}
        />
        
        {/* Constellation Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {showPoints && isAnalyzing && landmarks.map((pt) => (
            <motion.div
              key={pt.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
              transition={{ delay: pt.delay, duration: 0.5 }}
              className="absolute w-1.5 h-1.5 bg-[#C9A227] rounded-full shadow-[0_0_8px_#C9A227]"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              {/* Connecting Lines (Simulated with simple CSS) */}
              {pt.id % 4 === 0 && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '60px' }}
                  transition={{ delay: pt.delay + 0.3, duration: 0.8 }}
                  className="absolute h-[1px] bg-gradient-to-r from-[#C9A227] to-transparent origin-left rotate-[45deg]"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* HUD Elements */}
        <div className="absolute inset-x-8 top-8 flex justify-between items-start z-30">
          <div className="flex flex-col gap-1">
            <div className="h-[2px] w-8 bg-[#C9A227]"></div>
            <div className="h-8 w-[2px] bg-[#C9A227]"></div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-[2px] w-8 bg-[#C9A227]"></div>
            <div className="h-8 w-[2px] bg-[#C9A227]"></div>
          </div>
        </div>

        <div className="absolute inset-x-8 bottom-8 flex justify-between items-end z-30">
          <div className="flex flex-col gap-1">
            <div className="h-8 w-[2px] bg-[#C9A227]"></div>
            <div className="h-[2px] w-8 bg-[#C9A227]"></div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="h-8 w-[2px] bg-[#C9A227]"></div>
            <div className="h-[2px] w-8 bg-[#C9A227]"></div>
          </div>
        </div>
        
        {!streamActive && (
          <div className="flex flex-col items-center justify-center z-10">
            <Loader2 className="w-10 h-10 text-[#C9A227] animate-spin mb-4" />
            <p className="text-[#C9A227] text-[10px] font-black tracking-[0.2em] uppercase">Connecting to Hive...</p>
          </div>
        )}

        {isAnalyzing && streamActive && (
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center z-30">
             <motion.div 
               animate={{ opacity: [0.4, 1, 0.4] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="text-[#C9A227] text-[10px] font-black tracking-[0.3em] mb-2"
             >
               MAPPING FACIAL MESH
             </motion.div>
             <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-full h-full bg-[#C9A227]"
                />
             </div>
          </div>
        )}
      </section>

      {/* 2. Face Analysis Report */}
      <section className="space-y-5 mb-10 relative">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-white/5 rounded-xl animate-pulse"></div>
              <div className="h-24 w-full bg-white/5 rounded-2xl animate-pulse"></div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[#C9A227] text-[10px] font-black tracking-widest uppercase opacity-80">Logic Intelligence</span>
                <h2 className="text-3xl font-light leading-tight">
                  대표님은 <span className="font-bold text-[#C9A227]">각진형(Square)</span> 형태의 마스크를 보유하고 계십니다.
                </h2>
              </div>

              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] p-6 rounded-[2rem] border border-white/5 flex items-center justify-between shadow-xl">
                <div className="space-y-1">
                  <p className="text-white/40 text-[9px] uppercase font-black tracking-widest">Image Synergy Score</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-[#C9A227] text-5xl font-black tabular-nums">+{analysis.trustScore}</p>
                    <span className="text-[#C9A227] text-xl font-bold">%</span>
                  </div>
                </div>
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <Sparkles className="text-[#C9A227] w-10 h-10 animate-pulse relative z-10" />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-[#C9A227] rounded-full blur-2xl"
                  />
                </div>
              </div>
              
              <p className="text-white/50 text-sm leading-relaxed font-medium">
                {analysis.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. Recommended K-Eyeware */}
      <section className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white/60">Curation Engine</h3>
          <div className="h-[1px] flex-1 mx-4 bg-white/5"></div>
          <span className="text-[#C9A227] text-[10px] font-black uppercase tracking-widest">View All</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {currentRecs.map((item) => (
            <ProductCard key={item.id} name={item.name} price={item.price} isAnalyzing={isAnalyzing} />
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/5 p-6 flex justify-around z-50">
        <div className="flex flex-col items-center gap-1.5 text-[#C9A227]">
          <Camera className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Scanner</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-white/20">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Market</span>
        </div>
      </nav>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function ProductCard({ name, price, isAnalyzing }: { name: string; price: string; isAnalyzing: boolean }) {
  return (
    <motion.div 
      initial={false}
      animate={{ opacity: isAnalyzing ? 0.2 : 1, y: isAnalyzing ? 10 : 0 }}
      className="min-w-[160px] bg-[#111] p-5 rounded-[2.5rem] border border-white/5 space-y-4"
    >
      <div className="aspect-square bg-black rounded-[2rem] border border-white/5 flex items-center justify-center p-4 relative group overflow-hidden">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/50 to-transparent relative">
          <div className="absolute -top-2 left-3 w-4 h-4 border border-[#C9A227] rounded-full bg-black"></div>
          <div className="absolute -top-2 right-3 w-4 h-4 border border-[#C9A227] rounded-full bg-black"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#C9A227]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="space-y-1 px-1">
        <p className="text-[10px] font-black truncate text-white uppercase tracking-tighter leading-none">{name}</p>
        <p className="text-[#C9A227] text-xs font-black tabular-nums">{price}</p>
      </div>
    </motion.div>
  );
}
