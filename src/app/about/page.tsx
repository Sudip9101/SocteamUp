'use client';

import { Target, Users, Lightbulb, Rocket, ChevronRight, ChevronLeft, Mail, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Executive Team Data
const executiveTeam = [
      {
      id: 1,
      name: 'Dr Kunwar Singh',
      title: 'Co-Founder',
      image: '/team/kunwar-singh.jpg',
    description: 'Dr. Singh brings over 15 years of experience in semiconductor design and holds international Patent and has more than 25 publication in high-performance VLSI design. Previously led R&D teams at major semiconductor companies.',
    linkedin: 'https://www.linkedin.com/in/ksdelhi/',
    email: 'Kunwar.Singh@socteamup.com',
    expertise: ['Strategic Leadership', 'IC Design', 'R&D Management']
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    title: 'Chief Technology Officer',
    image: '/team/michael-rodriguez.jpg',
    description: 'Michael has 18+ years in ASIC design and verification. Expert in advanced node technologies and has successfully delivered 20+ complex SoC projects to production.',
    linkedin: 'https://linkedin.com/in/michael-rodriguez-cto',
    email: 'michael.rodriguez@socteamup.com',
    expertise: ['ASIC Design', 'SoC Architecture', 'Advanced Node Technologies']
  },
  {
    id: 3,
    name: 'Dr. James Liu',
    title: 'VP of Engineering',
    image: '/team/james-liu.jpg',
    description: 'Dr. Liu specializes in analog/mixed-signal design and physical implementation. PhD in Electrical Engineering from Stanford with focus on high-speed circuit design.',
    linkedin: 'https://linkedin.com/in/james-liu-vp',
    email: 'james.liu@socteamup.com',
    expertise: ['Analog Design', 'Mixed-Signal', 'Physical Implementation']
  },
  {
    id: 4,
    name: 'Emily Watson',
    title: 'Chief Operating Officer',
    image: '/team/emily-watson.jpg',
    description: 'Emily brings operational excellence with 12+ years in semiconductor manufacturing and supply chain management. MBA from Wharton with focus on technology operations.',
    linkedin: 'https://linkedin.com/in/emily-watson-coo',
    email: 'emily.watson@socteamup.com',
    expertise: ['Operations', 'Supply Chain', 'Manufacturing']
  },
  {
    id: 5,
    name: 'Dr. Alex Kumar',
    title: 'VP of Research & Development',
    image: '/team/alex-kumar.jpg',
    description: 'Dr. Kumar leads our research initiatives in next-generation semiconductor technologies. Former principal scientist at Intel with expertise in quantum computing and AI chips.',
    linkedin: 'https://linkedin.com/in/alex-kumar-research',
    email: 'alex.kumar@socteamup.com',
    expertise: ['Quantum Computing', 'AI Chips', 'Research Leadership']
  },
  {
    id: 6,
    name: 'Lisa Zhang',
    title: 'Chief Financial Officer',
    image: '/team/lisa-zhang.jpg',
    description: 'Lisa oversees financial strategy and investor relations. CPA with 14+ years in tech finance, previously CFO at two successful semiconductor startups that achieved IPO.',
    linkedin: 'https://linkedin.com/in/lisa-zhang-cfo',
    email: 'lisa.zhang@socteamup.com',
    expertise: ['Financial Strategy', 'Investor Relations', 'IPO Experience']
  }
];

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % executiveTeam.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + executiveTeam.length) % executiveTeam.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleImageError = (memberId: number) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Rooted in Research.<br />
              Powering Performance.
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              From NIELIT labs to real-world semiconductor solutions—where<br />
              deep science meets practical impact.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why We Exist</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're on a mission to unlock semiconductor's full promise by delivering turnkey
              platforms that accelerate innovation and reliability.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="mb-4">
                  <Image
                    src="/electronic-design.svg"
                    alt="Semiconductor Design"
                    width={40}
                    height={40}
                    className="text-primary-600"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Democratizing Design</h3>
                <p className="text-gray-600">Making advanced semiconductor design accessible to innovators</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="mb-4">
                  <Image
                    src="/file.svg"
                    alt="End-to-end expertise"
                    width={40}
                    height={40}
                    className="text-primary-600"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">End-to-end Expertise</h3>
                <p className="text-gray-600">From design to verification to physical implementation</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="mb-4">
                  <Image
                    src="/window.svg"
                    alt="Performance"
                    width={40}
                    height={40}
                    className="text-primary-600"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Built for Speed</h3>
                <p className="text-gray-600">Rapid performance in design, verification, and delivery</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="mb-4">
                  <Image
                    src="/globe.svg"
                    alt="Global Standards"
                    width={40}
                    height={40}
                    className="text-primary-600"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black">Global Standards</h3>
                <p className="text-gray-600">Backed by expertise, rigorous R&D, and engineering excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-8">
              Built on Science.<br />
              Driven by Impact.
            </h2>
            <p className="text-lg mb-12 opacity-90">
              With a cross-disciplinary team of scientists, engineers, and tech professionals,
              working hand-in-hand to deliver semiconductor-grade GaN solutions, at SoCTeamup, we're
              here to make high-performance semiconductor design accessible to all.
            </p>

            <div className="grid grid-cols-3 gap-12">
              <div>
                <div className="text-4xl font-bold mb-2">20+</div>
                <div className="text-sm opacity-80">Patents</div>
                <div className="text-xs opacity-60">in high-performance IC design</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">18+</div>
                <div className="text-sm opacity-80">Years</div>
                <div className="text-xs opacity-60">of collective excellence</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1</div>
                <div className="text-sm opacity-80">Vision</div>
                <div className="text-xs opacity-60">Democratizing IC design</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-12">Our Journey</h2>
            
            <div className="space-y-12">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-24">
                  <div className="text-xl font-bold text-gray-900">2021</div>
                </div>
                <div>
                  <p className="text-gray-600">
                    SoCTeamup begins operations as a high-performance IC design and verification company,
                    focusing on delivering cutting-edge semiconductor solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-24">
                  <div className="text-xl font-bold text-gray-900">2022</div>
                </div>
                <div>
                  <p className="text-gray-600">
                    Expanded our services to include full-custom layout design and physical verification,
                    establishing partnerships with leading semiconductor companies.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-24">
                  <div className="text-xl font-bold text-gray-900">2023</div>
                </div>
                <div>
                  <p className="text-gray-600">
                    Launched comprehensive DFT solutions and advanced verification methodologies,
                    strengthening our position in the semiconductor industry.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-24">
                  <div className="text-xl font-bold text-gray-900">2024</div>
                </div>
                <div>
                  <p className="text-gray-600">
                    Continuing to innovate and expand our services while maintaining our commitment
                    to excellence in semiconductor design and verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-slideInDown">
              Meet Our Executive Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slideInUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Driven by a shared vision to democratize semiconductor design, our leadership team 
              combines decades of industry experience with innovative thinking.
            </p>
          </div>

          {/* Team Slider */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl team-member-card">
              <div 
                className="flex team-slide"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {executiveTeam.map((member) => (
                  <div key={member.id} className="w-full flex-shrink-0">
                    <div className="flex flex-col lg:flex-row">
                                            {/* Image Section */}
                      <div className="lg:w-1/2 relative animate-slideInLeft" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="aspect-square lg:aspect-[4/5] bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                          {!imageErrors[member.id] ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover team-image"
                              onError={() => handleImageError(member.id)}
                            />
                          ) : (
                            /* Professional placeholder without initials */
                            <div className="absolute inset-0 flex items-center justify-center professional-placeholder">
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center team-scale-in">
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                    </svg>
                                  </div>
                                  <p className="text-sm text-gray-600 font-medium animate-slideInUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>Professional Photo</p>
                                  <p className="text-xs text-gray-500 animate-slideInUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>Coming Soon</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-slideInRight" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                            {member.name}
                          </h3>
                          <p className="text-lg text-blue-600 font-semibold mb-4 animate-slideInRight" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                            {member.title}
                          </p>
                          <p className="text-gray-600 leading-relaxed mb-6 animate-slideInRight" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                            {member.description}
                          </p>
                        </div>

                                                {/* Expertise Tags */}
                        <div className="mb-6 animate-slideInRight" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full expertise-tag animate-scaleIn"
                                style={{ 
                                  animationDelay: `${0.6 + index * 0.1}s`, 
                                  animationFillMode: 'both' 
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                                                                         {/* Contact Links */}
                        <div className="flex gap-4 animate-slideInRight" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 team-contact-link animate-scaleIn"
                            style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </a>
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 team-contact-link animate-scaleIn"
                            style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
                          >
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 team-nav-button z-10"
              aria-label="Previous team member"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 team-nav-button z-10"
              aria-label="Next team member"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {executiveTeam.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full team-indicator ${
                  currentSlide === index 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Team Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="team-stat-enhanced team-section-hover">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-sm text-gray-600">Years Combined Experience</div>
            </div>
            <div className="team-stat-enhanced team-section-hover">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Patents & Publications</div>
            </div>
            <div className="team-stat-enhanced team-section-hover">
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-sm text-gray-600">Successful Projects</div>
            </div>
            <div className="team-stat-enhanced team-section-hover">
              <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
              <div className="text-sm text-gray-600">Industry Leaders</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 