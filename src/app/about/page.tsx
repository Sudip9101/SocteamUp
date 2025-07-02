'use client';

import { Target, Users, Lightbulb, Rocket, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
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
    </div>
  );
} 