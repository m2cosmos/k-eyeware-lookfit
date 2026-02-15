'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';

export default function LookFitDashboard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans p-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[#C9A227] text-xl font-black tracking-tighter">K-EYEWARE LOOKFIT</h1>
        <div className="bg-[#C9A227]/10 p-2 rounded-full border border-[#C9A227]/20">
          <ShieldCheck className="text-[#C9A227] w-5 h-5" />
        </div>
      </header>

      {/* 1. Camera / Scan Area */}
      <section className="relative mb-8 aspect-[3/4] bg-black rounded-3xl border-2 border-[#C9A227]/20 flex flex-col items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${streamActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        />
        
        {!streamActive && (
          <div className="flex flex-col items-center justify-center z-10">
            <Camera className="w-12 h-12 text-[#C9A227]/50 mb-4 animate-pulse" />
            <p className="text-[#C9A227] text-sm font-medium text-center px-4">카메라 권한을 허용해주세요</p>
          </div>
        )}

        {/* Scanning Overlays */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-[#0F0F0F]/40 border-double"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#C9A227]/40 rounded-full"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-10 border-b border-[#C9A227]/30 rounded-[50%]"></div>
      </section>

      {/* 2. Face Analysis Report */}
      <section className="space-y-4 mb-10">
        <div className="space-y-1">
          <span className="text-[#C9A227] text-[10px] font-bold tracking-widest uppercase">AI Face Analysis</span>
          <h2 className="text-3xl font-light">대표님은 <span className="font-bold text-[#C9A227]">각진형(Square)</span> 입니다.</h2>
        </div>

        <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs">AI 예상 이미지 상승률</p>
            <p className="text-[#C9A227] text-3xl font-black">+98%</p>
          </div>
          <Sparkles className="text-[#C9A227] w-8 h-8 opacity-50" />
        </div>
        
        <p className="text-gray-400 text-sm leading-relaxed">
          직선적인 턱선을 부드럽게 감싸주는 <span className="text-white font-medium">라운드 및 에비에이터 프레임</span>이 대표님의 신뢰도를 극대화합니다.
        </p>
      </section>

      {/* 3. Recommended K-Eyeware */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-lg">Recommended</h3>
          <span className="text-[#C9A227] text-xs font-medium">전체보기</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <ProductCard name="Classic Gold" price="₩249,000" />
          <ProductCard name="Modern Black" price="₩189,000" />
          <ProductCard name="Seoul Aviator" price="₩310,000" />
        </div>
      </section>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/5 p-4 flex justify-around z-50">
        <div className="flex flex-col items-center gap-1 text-[#C9A227]">
          <Camera className="w-6 h-6" />
          <span className="text-[10px] font-bold">SCAN</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-500">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold">SHOP</span>
        </div>
      </nav>
    </div>
  );
}

function ProductCard({ name, price }: { name: string; price: string }) {
  return (
    <div className="min-w-[140px] bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 space-y-3">
      <div className="aspect-square bg-black rounded-xl border border-white/5 flex items-center justify-center p-2 relative overflow-hidden">
        {/* Placeholder for glasses icon */}
        <div className="w-16 h-4 border-2 border-[#C9A227] rounded-full relative">
          <div className="absolute top-0 left-4 w-0.5 h-full bg-[#C9A227]"></div>
          <div className="absolute top-0 right-4 w-0.5 h-full bg-[#C9A227]"></div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-bold truncate text-white">{name}</p>
        <p className="text-[#C9A227] text-[10px] font-black">{price}</p>
      </div>
    </div>
  );
}
