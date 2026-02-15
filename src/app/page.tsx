'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ShieldCheck, Sparkles, ShoppingBag, Loader2 } from 'lucide-react';

// 간단한 가상 추천 데이터
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

export default function LookFitDashboard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState({
    faceType: 'Analyzing',
    trustScore: 0,
    desc: '대표님의 안면 데이터를 정밀 분석 중입니다...'
  });

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
          
          // 실시간 분석 시뮬레이션 (실제 face-api 연동 전 로직 흐름 구축)
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysis({
              faceType: 'Square', // 실제 데이터에선 동적 계산 결과가 들어감
              trustScore: 98,
              desc: '직선적인 턱선을 부드럽게 감싸주는 라운드 프레임이 최적의 조합입니다.'
            });
          }, 3000);
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
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans p-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[#C9A227] text-xl font-black tracking-tighter uppercase italic">K-EYEWARE LOOKFIT</h1>
        <div className="bg-[#C9A227]/10 p-2 rounded-full border border-[#C9A227]/20">
          <ShieldCheck className="text-[#C9A227] w-5 h-5" />
        </div>
      </header>

      {/* 1. Camera / Scan Area */}
      <section className="relative mb-8 aspect-[3/4] bg-black rounded-3xl border-2 border-[#C9A227]/20 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(201,162,39,0.1)]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${streamActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
        />
        
        {!streamActive && (
          <div className="flex flex-col items-center justify-center z-10">
            <Loader2 className="w-10 h-10 text-[#C9A227] animate-spin mb-4" />
            <p className="text-[#C9A227] text-xs font-bold tracking-widest uppercase">Initialising Sensor...</p>
          </div>
        )}

        {/* Scanning Overlays */}
        <div className="absolute inset-0 pointer-events-none border-[15px] border-[#0F0F0F]/30"></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border ${isAnalyzing ? 'border-[#C9A227] animate-pulse' : 'border-[#C9A227]/20'} rounded-full transition-all duration-1000`}></div>
        
        {isAnalyzing && streamActive && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent animate-scan"></div>
        )}
      </section>

      {/* 2. Face Analysis Report */}
      <section className="space-y-4 mb-10">
        <div className="space-y-1">
          <span className="text-[#C9A227] text-[10px] font-bold tracking-widest uppercase opacity-60">AI Logic Result</span>
          <h2 className={`text-3xl font-light transition-all duration-1000 ${isAnalyzing ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
            대표님은 <span className="font-bold text-[#C9A227]">{analysis.faceType === 'Square' ? '각진형(Square)' : analysis.faceType}</span> 입니다.
          </h2>
        </div>

        <div className={`bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 flex items-center justify-between transition-all duration-1000 ${isAnalyzing ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          <div className="space-y-1">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">AI Image Synergy</p>
            <p className="text-[#C9A227] text-4xl font-black">+{analysis.trustScore}%</p>
          </div>
          <div className="relative">
            <Sparkles className={`text-[#C9A227] w-8 h-8 ${isAnalyzing ? 'animate-spin' : 'animate-pulse'}`} />
            <div className="absolute inset-0 bg-[#C9A227] blur-xl opacity-20"></div>
          </div>
        </div>
        
        <p className={`text-gray-400 text-sm leading-relaxed transition-all duration-1000 ${isAnalyzing ? 'opacity-0' : 'opacity-100'}`}>
          {analysis.desc}
        </p>
      </section>

      {/* 3. Recommended K-Eyeware */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-bold text-lg tracking-tight">Logic Curation</h3>
          <span className="text-[#C9A227] text-[10px] font-bold uppercase tracking-widest">Refresh</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {currentRecs.map((item) => (
            <ProductCard key={item.id} name={item.name} price={item.price} isAnalyzing={isAnalyzing} />
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/5 p-5 flex justify-around z-50">
        <div className="flex flex-col items-center gap-1 text-[#C9A227]">
          <Camera className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-widest">Scan</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-600">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-widest">Market</span>
        </div>
      </nav>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          position: absolute;
          animation: scan 2s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function ProductCard({ name, price, isAnalyzing }: { name: string; price: string; isAnalyzing: boolean }) {
  return (
    <div className={`min-w-[150px] bg-[#141414] p-4 rounded-3xl border border-white/5 space-y-4 transition-all duration-700 ${isAnalyzing ? 'opacity-30 blur-sm' : 'opacity-100 blur-0'}`}>
      <div className="aspect-square bg-black rounded-2xl border border-white/5 flex items-center justify-center p-4 relative group">
        <div className="w-full h-1 bg-gradient-to-r from-gray-800 via-[#C9A227]/40 to-gray-800 rounded-full relative">
          <div className="absolute -top-2 left-2 w-5 h-5 border-2 border-[#C9A227] rounded-full bg-black"></div>
          <div className="absolute -top-2 right-2 w-5 h-5 border-2 border-[#C9A227] rounded-full bg-black"></div>
        </div>
        <div className="absolute inset-0 bg-[#C9A227]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="space-y-1 px-1">
        <p className="text-[10px] font-bold truncate text-white uppercase tracking-tighter">{name}</p>
        <p className="text-[#C9A227] text-xs font-black tracking-widest">{price}</p>
      </div>
    </div>
  );
}
