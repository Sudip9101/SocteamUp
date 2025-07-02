'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Use local API endpoint for development, AWS Lambda for production
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = apiUrl ? `${apiUrl}/api/contact` : '/api/contact';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      // Success
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      // Reset error message after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-teal-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-primary-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Have questions about SoCTeamup? Want to learn more about our semiconductor solutions? 
              We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Let's Start a Conversation
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're interested in our semiconductor design services, need technical support, or want to explore 
                partnership opportunities, our team is here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Mail className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                    <p className="text-gray-600">contact@socteamup.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Phone className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+91 120 XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                    <p className="text-gray-600">
                      2nd Floor, PS-1D, Sector 29,<br />
                      Arun Vihar, Noida,<br />
                      Uttar Pradesh 201303, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50">
                    <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Thank you for your message! We'll get back to you within 24 hours.
                    </span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
                    <XCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">Error sending message: </span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us on the Map</h2>
            <p className="text-lg text-gray-600">
              Located in the heart of Noida's tech hub, we're easily accessible and ready to meet with you.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
            <div className="aspect-w-16 aspect-h-9 h-96 lg:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.2923499945355!2d77.38205507452738!3d28.575006884254474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sSector%2029%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1704720000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SoCTeamup Office Location - Sector 29, Noida"
                className="w-full h-full"
              />
            </div>
            
            {/* Address Card Overlay */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <h4 className="font-semibold text-gray-900 mb-2">SoCTeamup Office</h4>
              <p className="text-sm text-gray-600">
                2nd Floor, PS-1D, Sector 29,<br />
                Arun Vihar, Noida,<br />
                Uttar Pradesh 201303, India
              </p>
            </div>
          </div>
          
          {/* Direction Button */}
          <div className="text-center mt-8">
            <a
              href="https://www.google.com/maps/dir//Sector+29,+Noida,+Uttar+Pradesh/@28.575006884254474,77.38205507452738,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <MapPin className="mr-2" size={20} />
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 