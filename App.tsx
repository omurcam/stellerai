import React, { useState, useEffect } from 'react';
import { ShaderAnimation } from './components/ui/shader-animation';
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from './components/ui/image-comparison';
import { ScrollReveal } from './components/ui/scroll-reveal';
import { ImagePlayground } from './components/ImagePlaygroundEnhanced';
import { NavbarDemo } from './components/NavbarDemo';

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId.replace('#', ''));
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="p-3 bg-indigo-500/20 rounded-full mb-4 border border-indigo-500/50">
    {children}
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'image' | 'video'>('home');

  // Initialize page based on URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (hash === 'image' || hash === 'video') {
      setCurrentPage(hash);
    } else {
      setCurrentPage('home');
    }

    // Listen for hash changes (back/forward buttons)
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash === 'image' || newHash === 'video') {
        setCurrentPage(newHash);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation functions with URL hash and smooth scroll to top
  const navigateToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = '';
    setCurrentPage('home');
  };
  const navigateToImage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = 'image';
    setCurrentPage('image');
  };
  const navigateToVideo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = 'video';
    setCurrentPage('video');
  };

  // Render different pages based on current page
  if (currentPage === 'image') {
    return <ImagePlayground onNavigateHome={navigateToHome} />;
  }

  if (currentPage === 'video') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Video Playground</h1>
          <p className="text-base sm:text-lg text-neutral-400 mb-6 sm:mb-8">Coming Soon...</p>
          <button 
            onClick={navigateToHome}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-semibold hover:brightness-110 transition-all duration-300 text-sm sm:text-base"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased">
      {/* Animated Navigation Bar */}
      <NavbarDemo 
        onNavigateToImage={navigateToImage}
        onNavigateToVideo={navigateToVideo}
        onNavigateToHome={navigateToHome}
        onScrollToPricing={() => smoothScrollTo('#pricing')}
      />

      {/* Hero Section */}
      <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
        <ShaderAnimation />
        <div className="relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            AI Visual Effects
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-neutral-300 mb-6 sm:mb-8 leading-relaxed px-4">
            Create cinematic VFX with AI. Transform images and videos with professional-grade effects in seconds. No technical skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md">
            <a href="#image" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transform transition-transform duration-300 ease-in-out shadow-lg shadow-purple-500/30 inline-block w-full sm:w-auto" aria-label="Try image effects">
              Try Image Effects
            </a>
            <a href="#video" className="bg-transparent border-2 border-white/20 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:border-white/40 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 inline-block w-full sm:w-auto" aria-label="Try video effects">
              Try Video Effects
            </a>
          </div>
        </div>
      </main>
      
      {/* Image Effects Section */}
      <section id="image-effects" className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4">Image Effects</h2>
            <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Transform static images with cinematic VFX. Add disintegration, fire, levitation, and 20+ other professional effects to your photos.
            </p>
          </ScrollReveal>
          
          {/* Before/After Comparison */}
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20 mb-12">
            <ImageComparison
              className="h-[300px] md:h-[500px] w-full"
            >
              <ImageComparisonImage
                src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop"
                alt="Original image before AI effects"
                position="left"
              />
              <ImageComparisonImage
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
                alt="Image transformed with AI effects"
                position="right"
              />
              <ImageComparisonSlider className="bg-purple-500">
                <div className="h-12 w-12 rounded-full bg-purple-500 shadow-lg flex items-center justify-center text-white ring-4 ring-black/50 backdrop-blur-sm bg-opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 17-5-5 5-5"/><path d="m15 17 5-5-5-5"/></svg>
                </div>
              </ImageComparisonSlider>
            </ImageComparison>
          </div>

          {/* Effect Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <ScrollReveal delay={0.1} direction="up">
              <div className="bg-neutral-900/50 border border-white/10 p-6 sm:p-8 rounded-xl flex flex-col items-center text-center hover:border-purple-500/30 transition-colors duration-300 group">
                <div className="p-3 sm:p-4 bg-red-500/20 rounded-full mb-4 border border-red-500/50 group-hover:bg-red-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 sm:w-8 sm:h-8"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-red-300 transition-colors">Fire & Smoke</h3>
                <p className="text-sm sm:text-base text-neutral-400">Add realistic fire, smoke, and explosion effects to any image with precise control.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2} direction="up">
              <div className="bg-neutral-900/50 border border-white/10 p-6 sm:p-8 rounded-xl flex flex-col items-center text-center hover:border-purple-500/30 transition-colors duration-300 group">
                <div className="p-3 sm:p-4 bg-blue-500/20 rounded-full mb-4 border border-blue-500/50 group-hover:bg-blue-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 sm:w-8 sm:h-8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors">Disintegration</h3>
                <p className="text-sm sm:text-base text-neutral-400">Create stunning particle disintegration effects like from superhero movies.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3} direction="up">
              <div className="bg-neutral-900/50 border border-white/10 p-6 sm:p-8 rounded-xl flex flex-col items-center text-center hover:border-purple-500/30 transition-colors duration-300 group">
                <div className="p-3 sm:p-4 bg-purple-500/20 rounded-full mb-4 border border-purple-500/50 group-hover:bg-purple-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 sm:w-8 sm:h-8"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/><path d="M12 22V2"/></svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">Levitation</h3>
                <p className="text-sm sm:text-base text-neutral-400">Make objects and people float with realistic physics and lighting.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Video Effects Section */}
      <section id="video-effects" className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-neutral-950">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4">Video Effects</h2>
            <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Bring your videos to life with dynamic AI-powered VFX. Create professional cinematic effects that adapt to motion and lighting.
            </p>
          </ScrollReveal>
          
          {/* Video Preview Placeholder */}
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 mb-12 bg-gradient-to-br from-neutral-900 to-neutral-800">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><polygon points="5,3 19,12 5,21"/></svg>
                </div>
                <p className="text-neutral-300 font-medium">Video Demo Coming Soon</p>
                <p className="text-neutral-500 text-sm">Interactive video effects preview</p>
              </div>
            </div>
          </div>

          {/* Video Effect Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <ScrollReveal delay={0.1} direction="left">
              <div className="bg-neutral-900/50 border border-white/10 p-6 sm:p-8 rounded-xl text-left hover:border-indigo-500/30 transition-colors duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="p-2.5 sm:p-3 bg-green-500/20 rounded-full mr-3 sm:mr-4 border border-green-500/50 group-hover:bg-green-500/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 sm:w-6 sm:h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5,4.21 12,6.81 16.5,4.21"/><polyline points="7.5,19.79 7.5,14.6 3,12"/><polyline points="21,12 16.5,14.6 16.5,19.79"/></svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold group-hover:text-green-300 transition-colors">Motion Tracking</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-400">AI automatically tracks objects and applies effects that follow natural movement and perspective changes.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2} direction="right">
              <div className="bg-neutral-900/50 border border-white/10 p-6 sm:p-8 rounded-xl text-left hover:border-indigo-500/30 transition-colors duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="p-2.5 sm:p-3 bg-yellow-500/20 rounded-full mr-3 sm:mr-4 border border-yellow-500/50 group-hover:bg-yellow-500/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 sm:w-6 sm:h-6"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold group-hover:text-yellow-300 transition-colors">Dynamic Lighting</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-400">Effects automatically adapt to changing lighting conditions and cast realistic shadows throughout the video.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4">Simple Pricing</h2>
            <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto mb-8 sm:mb-12">Professional AI effects for everyone. Start creating today.</p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <ScrollReveal delay={0.1} direction="left">
              <div className="bg-neutral-900/50 border border-white/10 p-6 sm:p-8 rounded-xl flex flex-col hover:border-white/20 transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">Free</h3>
                <p className="text-3xl sm:text-4xl font-bold mb-4">$0<span className="text-base sm:text-lg font-normal text-neutral-400">/month</span></p>
                <ul className="text-neutral-300 space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    5 image effects per day
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    HD quality exports
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    10+ effect types
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="text-neutral-500">Video effects</span>
                  </li>
                </ul>
                <button className="mt-auto w-full py-3 px-4 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-300">
                  Start Free
                </button>
              </div>
            </ScrollReveal>

            {/* Pro Plan */}
            <ScrollReveal delay={0.2} direction="right">
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-2 border-purple-500 p-6 sm:p-8 rounded-xl flex flex-col relative transform md:scale-105 shadow-2xl shadow-purple-500/20">
                <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                  Most Popular
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">Pro</h3>
                <p className="text-3xl sm:text-4xl font-bold mb-4">$29<span className="text-base sm:text-lg font-normal text-neutral-400">/month</span></p>
                <ul className="text-neutral-300 space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Unlimited image effects
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    50 video effects per month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    4K quality exports
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    All 23+ effect types
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Priority processing
                  </li>
                </ul>
                <button className="mt-auto w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300">
                  Start Pro Trial
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Additional Info */}
          <ScrollReveal delay={0.3}>
            <div className="mt-12 text-center">
              <p className="text-neutral-400 mb-4">Need custom solutions for your team?</p>
              <button className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4 transition-colors duration-300">
                Contact us for Enterprise pricing
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="text-sm sm:text-base text-neutral-400">&copy; 2024 Stellar AI. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
              <a href="#" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
