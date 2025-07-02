'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const shortDesc = `SoCTeamup Semiconductors Pvt Ltd is a DPIIT recognized startup which envisions to redefine SoC design, aiming to create an IC design services platform which is at par with software development/IT services, maximize visibility of every skilled resource in the semiconductor realm, and democratize IC design process through development of open-source and hybrid EDA design flows.`;
  const fullDesc = `SoCTeamup Semiconductors Pvt Ltd is a DPIIT recognized startup which envisions to redefine SoC design, aiming to create an IC design services platform which is at par with software development/IT services, maximize visibility of every skilled resource in the semiconductor realm, and democratize IC design process through development of open-source and hybrid EDA design flows.

Specializing in the development of cutting-edge Intellectual Properties (IPs), SoCTeamup Semiconductors leads the way in pioneering solutions, particularly in the Design for Test (DFT) space. Our dedicated team of experts leverages state-of-the-art technologies and methodologies to create innovative designs that enhance testability, reliability, and overall product performance with shortest time for end to end DFT Architecture planning and implementation.`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && videoRef.current) {
      const video = videoRef.current;
      
      const tryAutoplay = async () => {
        try {
          // Start with muted autoplay (browser-friendly)
          video.muted = true;
          video.currentTime = 0;
          video.volume = 0.7; // Pre-set volume for when unmuted
          await video.play();
          console.log('Video started playing (muted autoplay)');
          setIsVideoPlaying(true);
          
          // Keep playing muted - user can manually unmute using controls
          console.log('Video is playing muted. Use controls to enable sound.');
          
        } catch (error) {
          console.log('Autoplay failed, user interaction required:', error);
          video.muted = false; // Unmute for manual play
          setIsVideoPlaying(false);
        }
      };

      const onLoadedData = () => {
        console.log('Video loaded, attempting autoplay...');
        tryAutoplay();
      };
      
      const onCanPlay = () => {
        console.log('Video can play');
        if (video.paused) {
          tryAutoplay();
        }
      };

      // Ensure video keeps playing when state changes
      const onPause = () => {
        console.log('Video paused');
        setIsVideoPlaying(false);
      };

      const onPlay = () => {
        console.log('Video playing');
        setIsVideoPlaying(true);
      };
      
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('loadeddata', onLoadedData);
      video.addEventListener('pause', onPause);
      video.addEventListener('play', onPlay);
      
      // Force load the video
      video.load();

      return () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('loadeddata', onLoadedData);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('play', onPlay);
      };
    }
  }, [isClient]);

  const handlePlayClick = async () => {
    if (videoRef.current) {
      try {
        // When user clicks, enable sound and play
        videoRef.current.muted = false;
        videoRef.current.volume = 0.7;
        videoRef.current.currentTime = 0; // Restart from beginning
        await videoRef.current.play();
        setIsVideoPlaying(true);
        console.log('Video started with sound via user interaction');
      } catch (error) {
        console.log('Manual play failed:', error);
        // If that fails, try muted play
        try {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsVideoPlaying(true);
          console.log('Video started muted as fallback');
        } catch (mutedError) {
          console.log('Even muted play failed:', mutedError);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Headline Above Video - Fixed Position */}
      <div className="relative z-20 bg-white py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 slide-in-left">
            <span className="block slide-delay-1">Let us<span className="text-blue-600"> Innovate</span></span>
            <span className="block slide-delay-2">Together!!</span>
          </h1>
        </div>
      </div>

      {/* Hero Video Section - Full Height */}
      <section className="relative h-screen overflow-hidden -mt-20">
        {/* Full-Screen Hero Video */}
        {isClient ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              loop
              playsInline
              controls
              preload="auto"
              onError={() => setVideoError(true)}
            >
              <source src="/SoCTeamup_IC_Design_Solutions.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Click to Play Overlay */}
            {!isVideoPlaying && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer z-10 transition-all duration-300"
                onClick={handlePlayClick}
              >
                <div className="bg-white bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-all">
                  <svg className="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Fallback for server-side rendering
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
            <p className="text-white text-lg">Loading video...</p>
          </div>
        )}
        
        {/* Show error message if video fails to load */}
        {videoError && (
          <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center z-20">
            <div className="text-center">
              <p className="text-white text-lg mb-4">Unable to load video</p>
              <button 
                onClick={() => {
                  setVideoError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Description Below Image */}
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed text-left">
              {showFullDesc ? fullDesc : shortDesc}
            </p>
            <div className="text-left">
              {!showFullDesc && (
                <button
                  onClick={() => setShowFullDesc(true)}
                  className="inline-flex items-center bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors"
                >
                  Read more
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Shaping the Future Through Collaborative Innovation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Electronic Design */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/1.jpg" alt="Electronic Design" width={240} height={160} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Design</span>
              <span className="block text-gray-700">(Analog, Digital and Mixed)</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">We bring deep expertise in Analog, Digital, and Mixed-Signal IC design — enabling high-performance, low-power, and scalable silicon solutions for the next generation of semiconductors.</p>
            <Link href="#" className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">Explore</Link>
          </div>
          {/* Card 2 - DFT */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/2.jpg" alt="DFT Design for Test" width={240} height={160} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">DFT</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">Our Design-for-Test (DFT) solutions ensure your chips are not just functional — they're fully verifiable, testable, and production-ready. From scan insertion and ATPG to BIST and boundary scan, we help reduce time-to-market while maximizing yield and reliability.</p>
            <Link href="#" className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">Explore</Link>
          </div>
          {/* Card 3 - Design Verification */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/3.jpg" alt="Design Verification" width={240} height={160} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Design Verification</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">Our Design Verification team ensures functional correctness, performance, and compliance through industry-standard methodologies like UVM, SystemVerilog, and Assertion-Based Verification. We help you minimize risk and maximize confidence in your chip before it ever reaches silicon.</p>
            <Link href="#" className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">Explore</Link>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 - Physical IC Design */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/4.jpg" alt="Physical IC Design" width={360} height={240} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Physical IC Design</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">We hustle through every stage of the back-end flow — floorplan, power planning, P&R, CTS, IR drop analysis, timing closure, and signoff — to get your chip ready for tape-out, fast and clean. Our tools, skills, and obsession with detail make us your ideal physical design partner</p>
            <Link href="#" className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">Learn More</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/6.jpeg" alt="Silicon Layout" width={360} height={240} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Silicon Layout</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">We don't just place polygons — we sculpt silicon. Our team handles complex analog and full-custom layouts with deep tech precision, ensuring every transistor, via, and metal layer aligns with your performance and yield goals.</p>
            <Link href="#" className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
