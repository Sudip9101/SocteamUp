'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const images = [
    { src: '1a.jpg', alt: 'Quality Engineering Resources' },
    { src: '1b.jpg', alt: 'Successful Tapeouts' },
    { src: '1c.jpg', alt: 'Active IP Development' },
    { src: '14.jpg', alt: 'Proven Client Engagements' },
    { src: 'aboutus1.jpg', alt: 'End-to-End Design Capability' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPoints = document.querySelectorAll('.scroll-point');
      const scrollContainer = document.querySelector('.scroll-container');
      const scrollImage = document.getElementById('scroll-image-container');
      
      if (!scrollContainer || !scrollImage) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // Calculate overall scroll progress through the container
      const scrollStart = containerTop - windowHeight * 0.8;
      const scrollEnd = containerTop + containerHeight - windowHeight * 0.2;
      const totalScrollDistance = scrollEnd - scrollStart;
      const currentScrollPosition = -scrollStart;
      const progress = Math.max(0, Math.min(1, currentScrollPosition / totalScrollDistance));
      
      setScrollProgress(progress);

      // Apply parallax effect to image container
      const parallaxOffset = progress * 100;
      (scrollImage as HTMLElement).style.transform = `translateY(${parallaxOffset * 0.3}px) scale(${1 + progress * 0.1})`;

      let activePoint: Element | null = null;
      let maxVisibility = 0;
      let activeIndex = 0;

      scrollPoints.forEach((point, index) => {
        const rect = point.getBoundingClientRect();
        
        // Calculate how much of the element is visible
        const visibleTop = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
        const visiblePercent = visibleTop / rect.height;
        
        // If this point is more visible than others, make it active
        if (visiblePercent > maxVisibility && visiblePercent > 0.2) {
          maxVisibility = visiblePercent;
          activePoint = point;
          activeIndex = index;
        }
      });

      // Update current image index
      setCurrentImageIndex(activeIndex);

      // Update opacity for all points
      scrollPoints.forEach((point, index) => {
        if (point === activePoint) {
          point.classList.remove('opacity-50');
          point.classList.add('opacity-100');
          
          // Add scale effect to active point
          (point as HTMLElement).style.transform = 'scale(1.02)';
        } else {
          point.classList.remove('opacity-100');
          point.classList.add('opacity-50');
          (point as HTMLElement).style.transform = 'scale(1)';
        }
      });
    };

    // Initial load
    handleScroll();
    
    // Add scroll listener with throttling for performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', scrollListener);
    
    // Cleanup
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean Text Only */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Reinventing<br />
            SoC Design.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              From SoC labs to real-world semiconductor solutions—where 
              deep science meets practical impact.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Exist Section - Enhanced Interactive Scroll */}
      <section className="py-20 bg-white scroll-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why SoCTeamup</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Leading the semiconductor revolution with proven expertise and innovative solutions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Content - Points */}
            <div className="space-y-16">
              <div className="scroll-point opacity-50 transition-all duration-700 ease-out" data-image="1a.jpg">
                <div className="flex items-start gap-6 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Engineering Resources</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Deep experience in advanced-node SoCs with proven expertise across cutting-edge process technologies
                    </p>
                  </div>
                </div>
              </div>

              <div className="scroll-point opacity-50 transition-all duration-700 ease-out" data-image="1b.jpg">
                <div className="flex items-start gap-6 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Successful Tapeouts</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Proven track record of successful tapeouts across leading design houses with zero defect delivery
                    </p>
                  </div>
                </div>
              </div>

              <div className="scroll-point opacity-50 transition-all duration-700 ease-out" data-image="1c.jpg">
                <div className="flex items-start gap-6 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Active IP Development</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Continuous innovation in DFT, Verification, Physical Design, and Analog Mixed-Signal solutions
                    </p>
                  </div>
                </div>
              </div>

              <div className="scroll-point opacity-50 transition-all duration-700 ease-out" data-image="14.jpg">
                <div className="flex items-start gap-6 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Client Engagements</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Trusted partnerships with industry leaders including Scaleflux, HCL, UST Global, Tessolve, and more
                    </p>
                  </div>
                </div>
              </div>

              <div className="scroll-point opacity-50 transition-all duration-700 ease-out" data-image="aboutus1.jpg">
                <div className="flex items-start gap-6 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">End-to-End Design Capability</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Complete semiconductor design solutions under one roof - from concept to silicon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Image Gallery */}
            <div className="sticky top-24">
              <div id="scroll-image-container" className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 ease-out">
                {/* Progress Bar */}
                <div className="absolute top-4 left-4 right-4 z-10">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-300 ease-out"
                      style={{ width: `${scrollProgress * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Image Stack with Crossfade */}
                <div className="relative w-full h-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                  <Image
                        src={`/${image.src}`}
                        alt={image.alt}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                      />
                      {/* Gradient Overlay for Better Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 z-10">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              </div>

              {/* Image Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-cyan-500 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Cyan Background */}
      <section className="py-20 bg-cyan-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
              Built on Science.<br />
              Driven by Impact.
            </h2>
              <p className="text-lg text-cyan-50 leading-relaxed">
              With a cross-disciplinary team of scientists, engineers, and tech professionals,
                working hand-in-hand to deliver semiconductor-grade solutions, at SoCTeamup, 
                we're here to make high-performance semiconductor design accessible to all.
            </p>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">20+</div>
                <div className="text-lg text-white font-medium mb-1">Patents</div>
                <div className="text-sm text-cyan-50">in high-performance IC design</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">18+</div>
                <div className="text-lg text-white font-medium mb-1">Years</div>
                <div className="text-sm text-cyan-50">of collective excellence</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">1</div>
                <div className="text-lg text-white font-medium mb-1">Vision</div>
                <div className="text-sm text-cyan-50">Democratizing IC design</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
          </div>
            
            <div className="space-y-12">
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">2021</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    SoCTeamup begins operations as a high-performance IC design and verification company,
                    focusing on delivering cutting-edge semiconductor solutions.
                  </p>
                </div>
                </div>
              </div>

            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">2022</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    Expanded our services to include full-custom layout design and physical verification,
                    establishing partnerships with leading semiconductor companies.
                  </p>
                </div>
                </div>
              </div>

            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">2023</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    Launched comprehensive DFT solutions and advanced verification methodologies,
                    strengthening our position in the semiconductor industry.
                  </p>
                </div>
                </div>
              </div>

            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">2024</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    Continuing to innovate and expand our services while maintaining our commitment
                    to excellence in semiconductor design and verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 