'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const shortDesc = `SoCTeamup Semiconductors Pvt Ltd is a DPIIT recognized startup which envisions to redefine SoC design, aiming to create an IC design services platform which is at par with software development/IT services, maximize visibility of every skilled resource in the semiconductor realm, and democratize IC design process through development of open-source and hybrid EDA design flows.`;
  const fullDesc = `SoCTeamup Semiconductors Pvt Ltd is a DPIIT recognized startup which envisions to redefine SoC design, aiming to create an IC design services platform which is at par with software development/IT services, maximize visibility of every skilled resource in the semiconductor realm, and democratize IC design process through development of open-source and hybrid EDA design flows.

Specializing in the development of cutting-edge Intellectual Properties (IPs), SoCTeamup Semiconductors leads the way in pioneering solutions, particularly in the Design for Test (DFT) space. Our dedicated team of experts leverages state-of-the-art technologies and methodologies to create innovative designs that enhance testability, reliability, and overall product performance with shortest time for end to end DFT Architecture planning and implementation.`;

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

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
            <span className="block slide-delay-1">Reinventing<span className="text-blue-600"> SOC</span></span>
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
          
          {/* Card 1 - Design Verification */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/1.jpg" alt="Design Verification" width={240} height={160} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Design Verification</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              We deliver robust, scalable, and reusable verification environments that ensure first-silicon success for complex SoCs.
            </p>
            <button 
              onClick={() => toggleCardExpansion('verification')}
              className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'verification' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Functional Verification (RTL/Subsystem/SoC level)</li>
                    <li>UVM-based testbench architecture and development</li>
                    <li>SystemVerilog assertions and coverage-driven verification</li>
                    <li>Low-power and clock-domain crossing verification</li>
                    <li>Formal Verification and static analysis</li>
                    <li>Regression automation and debug support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Verification IPs (VIPs) for standard and custom protocols</li>
                    <li>Portable testbench architectures</li>
                    <li>Assertion libraries</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Card 2 - Design for Test (DFT) */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/2.jpg" alt="Design for Test (DFT)" width={240} height={160} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Design for Test (DFT)</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              Our DFT services ensure high fault coverage, yield optimization, and efficient silicon debug across technology nodes.
            </p>
            <button 
              onClick={() => toggleCardExpansion('dft')}
              className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'dft' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Scan insertion and ATPG support</li>
                    <li>Boundary scan and JTAG integration</li>
                    <li>Memory BIST and Logic BIST implementation</li>
                    <li>Test compression and decompression</li>
                    <li>DFT-aware synthesis and netlist signoff</li>
                    <li>Post-silicon validation and debug support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Plug-and-play BIST IPs</li>
                    <li>Secure test access IP for mission-critical applications</li>
                    <li>Configurable scan controller and wrappers</li>
                    <li>DFX libraries for power, reliability, and safety</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Card 3 - Physical Design */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/3.jpg" alt="Physical Design" width={240} height={160} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Physical Design</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              We provide complete RTL-to-GDSII implementation services tailored for high-performance, low-power, and area-optimized designs.
            </p>
            <button 
              onClick={() => toggleCardExpansion('physical')}
              className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'physical' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Floorplanning and power planning</li>
                    <li>Placement, CTS, and routing</li>
                    <li>Timing closure and ECO handling</li>
                    <li>Physical verification (LVS/DRC)</li>
                    <li>IR drop and EM analysis</li>
                    <li>Multi-voltage domain implementation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Automation scripts for STA, PnR, and power optimization</li>
                    <li>Parameterized hard macros</li>
                    <li>Physical-aware IP blocks</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 4 - Analog and Mixed-Signal Design */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center card-hover overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-lg">
              <Image src="/4.jpg" alt="Analog and Mixed-Signal Design" width={360} height={240} className="card-image object-cover rounded-lg" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black text-center leading-tight">
              <span className="block">Analog and Mixed-Signal Design</span>
            </h3>
            <p className="text-gray-800 text-sm mb-4 text-center leading-relaxed">
              We support full AMS development across high-speed interfaces, sensor signal chains, power management, and more.
            </p>
            <button 
              onClick={() => toggleCardExpansion('analog')}
              className="mt-auto bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Explore
            </button>
            
            {/* Expandable Content */}
            {expandedCard === 'analog' && (
              <div className="mt-4 w-full bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 transition-all duration-300">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Our services include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Schematic entry and circuit design</li>
                    <li>Analog layout and device-level LVS/DRC</li>
                    <li>Mixed-signal verification (Verilog-AMS, Spectre, etc.)</li>
                    <li>ADC/DAC design, LDOs, amplifiers, PLLs, and clocking</li>
                    <li>Silicon validation and performance tuning</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">In-house Development:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Configurable analog IPs (e.g., LDOs, PLLs, bandgaps)</li>
                    <li>Mixed-signal wrappers for digital interface</li>
                    <li>Custom AMS simulation environments</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Keep the existing Silicon Layout card */}
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

      {/* Industries We Serve Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our expertise spans a wide range of industries, we help you see the world of Electronics differently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Industry 1 - Semiconductor & Fabless Design Houses */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/1a.jpg" 
                  alt="Semiconductor & Fabless Design Houses" 
                  width={300} 
                  height={200} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  Semiconductor & Fabless Design Houses
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Full-spectrum RTL to GDSII support for analog, digital, and mixed-signal SoCs at advanced nodes (2nm–28nm).
                </p>
              </div>
            </div>

            {/* Industry 2 - Automotive Electronics */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/auto.jpeg" 
                  alt="Automotive Electronics" 
                  width={300} 
                  height={200} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  Automotive Electronics
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Functional safety, mission-critical DFT, and AMS design support for ADAS.
                </p>
              </div>
            </div>

            {/* Industry 3 - Consumer Electronics */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/4.jpg" 
                  alt="Consumer Electronics" 
                  width={300} 
                  height={200} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  Consumer Electronics
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  High-volume verification and IP integration for multimedia, smart devices, and edge AI products.
                </p>
              </div>
            </div>

            {/* Industry 4 - Cloud & AI Infrastructure */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/ai.jpeg" 
                  alt="Cloud & AI Infrastructure" 
                  width={300} 
                  height={200} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  Cloud & AI Infrastructure
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  DFT automation and IP support for data center AI accelerators, inference engines, and custom silicon for hyperscalers.
                </p>
              </div>
            </div>

            {/* Industry 5 - IoT & Edge Computing */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <Image 
                  src="/aboutus2.jpg" 
                  alt="IoT & Edge Computing" 
                  width={300} 
                  height={200} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  IoT & Edge Computing
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  IP development and verification for ultra-low-power edge chips, smart sensors, and connectivity solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Optional: Add navigation dots for mobile carousel */}
          <div className="flex justify-center mt-8 lg:hidden">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div key={dot} className="w-2 h-2 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Clients
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our client ecosystem is a network of trusted collaborators. Together, we strive to build the next hardware success story. We grow, thrive, and succeed as one.
            </p>
          </div>

          {/* Direct Clients */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Direct Clients</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
              {[
                'Scaleflux India',
                'HCL Technologies', 
                'Tessolve',
                'Cyient',
                'USTGlobal',
                'QuestGlobal',
                'Sasken Technologies',
                'Einfochips'
              ].map((client, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">
                          {client.split(' ').map(word => word[0]).join('')}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-tight">
                        {client}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* End Clients Served */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">End Clients Served</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
              {[
                'Tesla',
                'Microsoft', 
                'AMD',
                'Renesas',
                'STMicroelectronics',
                'NXP Semiconductor',
                'Global Unichip Corporation'
              ].map((client, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-100">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">
                          {client.split(' ').map(word => word[0]).join('')}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-tight">
                        {client}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Trusted Partners</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Direct Collaborations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Global Reach</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
