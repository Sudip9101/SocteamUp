'use client';

import { Mail, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Executive Team Data
const executiveTeam = [
  {
    id: 1,
    name: 'Dr Kunwar Singh',
    title: 'Co-Founder & Chief Executive Officer',
    image: '/team/kunwar-singh.jpg',
    description: `Dr. Singh brings over 15 years of experience in semiconductor design and holds international patents with more than 25 publications in high-performance VLSI design. Previously led R&D teams at major semiconductor companies, spearheading breakthrough innovations in advanced node technologies.

    His expertise spans across digital design, verification methodologies, and DFT implementation. Dr. Singh has successfully managed complex SoC projects from conception to silicon, establishing SoCTeamup as a leader in semiconductor design services. He holds a PhD in Electronics and Communication Engineering and has been instrumental in developing next-generation IP solutions for the industry.

    Under his leadership, SoCTeamup has grown from a startup to a trusted partner for global semiconductor companies, maintaining a focus on quality, innovation, and customer success.`,
    linkedin: 'https://www.linkedin.com/in/ksdelhi/',
    email: 'Kunwar.Singh@socteamup.com',
    expertise: ['Strategic Leadership', 'IC Design', 'R&D Management', 'Digital Design', 'DFT Implementation']
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    title: 'Chief Technology Officer',
    image: '/team/michael-rodriguez.jpg',
    description: `Michael has 18+ years in ASIC design and verification, with deep expertise in advanced node technologies. He has successfully delivered 20+ complex SoC projects to production, ranging from automotive to high-performance computing applications.

    Before joining SoCTeamup, Michael held senior technical roles at leading semiconductor companies where he architected and implemented cutting-edge design flows for 7nm and 5nm technologies. His experience spans across digital design, physical implementation, and advanced verification methodologies.

    Michael is passionate about innovation and leads our technical vision, ensuring that SoCTeamup stays at the forefront of semiconductor technology evolution. He holds multiple patents in low-power design and high-speed circuit implementation.`,
    linkedin: 'https://linkedin.com/in/michael-rodriguez-cto',
    email: 'michael.rodriguez@socteamup.com',
    expertise: ['ASIC Design', 'SoC Architecture', 'Advanced Node Technologies', 'Physical Implementation', 'Low-Power Design']
  },
  {
    id: 3,
    name: 'Dr. James Liu',
    title: 'VP of Engineering',
    image: '/team/james-liu.jpg',
    description: `Dr. Liu specializes in analog/mixed-signal design and physical implementation with a PhD in Electrical Engineering from Stanford, focusing on high-speed circuit design. He brings over 14 years of experience in developing complex mixed-signal solutions for communication and computing applications.

    His expertise includes high-speed interface design, power management circuits, and advanced packaging solutions. Dr. Liu has been instrumental in establishing our analog and mixed-signal design capabilities, working closely with clients to deliver innovative solutions for challenging design requirements.

    Prior to SoCTeamup, he worked at leading analog semiconductor companies where he developed award-winning products that are now industry standards. His research has been published in top-tier journals and conferences.`,
    linkedin: 'https://linkedin.com/in/james-liu-vp',
    email: 'james.liu@socteamup.com',
    expertise: ['Analog Design', 'Mixed-Signal', 'Physical Implementation', 'High-Speed Circuits', 'Power Management']
  },
  {
    id: 4,
    name: 'Emily Watson',
    title: 'Chief Operating Officer',
    image: '/team/emily-watson.jpg',
    description: `Emily brings operational excellence with 12+ years in semiconductor manufacturing and supply chain management. She holds an MBA from Wharton with a focus on technology operations and has been instrumental in scaling SoCTeamup's operations globally.

    Her experience spans across project management, quality assurance, and strategic planning. Emily has successfully implemented operational frameworks that ensure on-time delivery and exceptional quality in all our projects. She has a proven track record of building high-performing teams and optimizing processes for maximum efficiency.

    Before joining SoCTeamup, Emily held senior operational roles at Fortune 500 technology companies where she managed multi-million dollar projects and led cross-functional teams across different time zones and cultures.`,
    linkedin: 'https://linkedin.com/in/emily-watson-coo',
    email: 'emily.watson@socteamup.com',
    expertise: ['Operations Management', 'Supply Chain', 'Manufacturing', 'Project Management', 'Quality Assurance']
  },
  {
    id: 5,
    name: 'Dr. Alex Kumar',
    title: 'VP of Research & Development',
    image: '/team/alex-kumar.jpg',
    description: `Dr. Kumar leads our research initiatives in next-generation semiconductor technologies. Former principal scientist at Intel with expertise in quantum computing and AI chips, he brings cutting-edge research capabilities to SoCTeamup.

    His research focuses on emerging technologies including neuromorphic computing, quantum-classical interfaces, and AI accelerator architectures. Dr. Kumar has published extensively in top-tier conferences and holds multiple patents in novel computing paradigms.

    Under his leadership, our R&D team explores breakthrough technologies that will shape the future of semiconductor design. He collaborates closely with leading universities and research institutions to stay at the forefront of technological innovation.`,
    linkedin: 'https://linkedin.com/in/alex-kumar-research',
    email: 'alex.kumar@socteamup.com',
    expertise: ['Quantum Computing', 'AI Chips', 'Research Leadership', 'Neuromorphic Computing', 'Innovation Strategy']
  },
  {
    id: 6,
    name: 'Lisa Zhang',
    title: 'Chief Financial Officer',
    image: '/team/lisa-zhang.jpg',
    description: `Lisa oversees financial strategy and investor relations with 14+ years in tech finance. As a CPA, she was previously CFO at two successful semiconductor startups that achieved IPO, bringing invaluable experience in scaling technology companies.

    Her expertise includes financial planning, risk management, and strategic partnerships. Lisa has been instrumental in securing funding for SoCTeamup's growth initiatives and establishing financial frameworks that support our expansion goals.

    She has a proven track record of building robust financial operations and has guided companies through critical growth phases. Lisa's strategic financial leadership ensures SoCTeamup maintains strong fiscal health while investing in future growth opportunities.`,
    linkedin: 'https://linkedin.com/in/lisa-zhang-cfo',
    email: 'lisa.zhang@socteamup.com',
    expertise: ['Financial Strategy', 'Investor Relations', 'IPO Experience', 'Risk Management', 'Strategic Partnerships']
  }
];

export default function ExecutiveTeamPage() {
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  const handleImageError = (memberId: number) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern Corporate Style */}
      <section className="relative h-[70vh] bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent">
          <svg className="absolute right-0 top-0 h-full w-1/2 text-blue-500/10" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 50,100 0,100"></polygon>
          </svg>
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="text-sm font-medium text-blue-400 mb-4 tracking-wide uppercase">
                COMPANY
              </div>
              <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
                Leadership
              </h1>
              <div className="h-1 w-24 bg-blue-500 mb-8"></div>
              <h2 className="text-3xl font-light text-gray-200 mb-6">
                A Pattern of Preemptive Innovation
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                You can tell a lot about a company by the people who lead it — their skills, their stories and their standards. 
                Our business is foundational technology. These leaders are the foundation we build on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Profiles Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {executiveTeam.map((member, index) => (
            <div key={member.id} className={`mb-24 ${index !== executiveTeam.length - 1 ? 'border-b border-gray-200 pb-24' : ''}`}>
              <div className={`flex flex-col lg:flex-row gap-12 lg:gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Profile Image */}
                <div className="lg:w-1/3 flex-shrink-0">
                  <div className="relative">
                    <div className="w-80 h-80 mx-auto lg:mx-0 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                      {!imageErrors[member.id] ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={320}
                          height={320}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(member.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="lg:w-2/3 flex flex-col justify-center">
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      {member.name}
                    </h2>
                    <h3 className="text-xl font-medium text-blue-600 mb-6">
                      {member.title}
                    </h3>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    {member.description.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed mb-6 text-lg">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>

                  {/* Expertise Tags */}
                  <div className="mt-8 mb-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                      Key Expertise
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {member.expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="flex gap-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <Linkedin className="w-5 h-5" />
                      LinkedIn
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium"
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership by Numbers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our executive team brings together decades of experience and proven track records
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-sm text-gray-600 font-medium">Years Combined Experience</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-gray-600 font-medium">Patents & Publications</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-sm text-gray-600 font-medium">Successful Projects</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
              <div className="text-sm text-gray-600 font-medium">Industry Leaders</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 