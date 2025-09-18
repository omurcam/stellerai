"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";

export function NavbarDemo({ 
  onNavigateToImage, 
  onNavigateToVideo, 
  onNavigateToHome,
  onScrollToPricing 
}: { 
  onNavigateToImage: () => void;
  onNavigateToVideo: () => void;
  onNavigateToHome: () => void;
  onScrollToPricing: () => void;
}) {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar 
        className="top-2" 
        onNavigateToImage={onNavigateToImage}
        onNavigateToVideo={onNavigateToVideo}
        onNavigateToHome={onNavigateToHome}
        onScrollToPricing={onScrollToPricing}
      />
    </div>
  );
}

function Navbar({ 
  className,
  onNavigateToImage,
  onNavigateToVideo,
  onNavigateToHome,
  onScrollToPricing
}: { 
  className?: string;
  onNavigateToImage: () => void;
  onNavigateToVideo: () => void;
  onNavigateToHome: () => void;
  onScrollToPricing: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 hidden md:block", className)}
      >
        <Menu setActive={setActive}>
          {/* Logo/Home */}
          <div 
            onClick={onNavigateToHome}
            className="cursor-pointer text-xl font-bold tracking-tighter text-black dark:text-white hover:opacity-90 transition-opacity"
          >
            Stellar AI
          </div>
        
        {/* AI Tools Menu */}
        <MenuItem setActive={setActive} active={active} item="AI Tools">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="#image">
              Image Effects
            </HoveredLink>
            <HoveredLink href="#video">
              Video Effects
            </HoveredLink>
            <HoveredLink href="#image-effects">
              Before & After Gallery
            </HoveredLink>
            <HoveredLink href="#video-effects">
              Motion Tracking Demo
            </HoveredLink>
          </div>
        </MenuItem>
        
        {/* Effects Showcase */}
        <MenuItem setActive={setActive} active={active} item="Effects">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Fire & Smoke"
              href="#image-effects"
              src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=400&h=200&auto=format&fit=crop"
              description="Add realistic fire, smoke, and explosion effects to any image."
            />
            <ProductItem
              title="Disintegration"
              href="#image-effects"
              src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&h=200&auto=format&fit=crop"
              description="Create stunning particle disintegration effects like from superhero movies."
            />
            <ProductItem
              title="Levitation"
              href="#image-effects"
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&h=200&auto=format&fit=crop"
              description="Make objects and people float with realistic physics and lighting."
            />
            <ProductItem
              title="Motion Tracking"
              href="#video-effects"
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&h=200&auto=format&fit=crop"
              description="AI automatically tracks objects and applies effects that follow movement."
            />
          </div>
        </MenuItem>
        
        {/* Pricing */}
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <button 
              onClick={onScrollToPricing}
              className="text-left text-neutral-700 dark:text-neutral-200 hover:text-black transition-colors"
            >
              View Plans
            </button>
            <HoveredLink href="#pricing">
              Free Plan
            </HoveredLink>
            <HoveredLink href="#pricing">
              Pro Plan - $29/month
            </HoveredLink>
            <HoveredLink href="#pricing">
              Enterprise Solutions
            </HoveredLink>
          </div>
        </MenuItem>
        
        {/* Get Started Button */}
        <div className="ml-4">
          <a 
            href="#image"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:brightness-110 transition-all duration-300 text-sm inline-block"
          >
            Get Started
          </a>
        </div>
      </Menu>
    </div>
    
    {/* Mobile Navbar */}
    <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <div 
            onClick={onNavigateToHome}
            className="text-xl font-bold tracking-tighter text-white cursor-pointer"
          >
            Stellar AI
          </div>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top duration-200">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-2">AI Tools</h3>
            <a 
              href="#image" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Image Effects
            </a>
            <a 
              href="#video" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Video Effects
            </a>
            
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2">Effects</h3>
            <a 
              href="#image-effects" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Before & After Gallery
            </a>
            <a 
              href="#video-effects" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Motion Tracking Demo
            </a>
            
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2">Pricing</h3>
            <button 
              onClick={() => {
                onScrollToPricing();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              View Plans
            </button>
            
            <div className="pt-4 mt-4 border-t border-white/10">
              <a 
                href="#image"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:brightness-110 transition-all duration-300"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
