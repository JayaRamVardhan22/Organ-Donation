import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Clock, Heart, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-teal-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">About OrganChain</h1>
            <p className="text-xl">
              A revolutionary blockchain-based platform transforming the organ donation ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At OrganChain, we're on a mission to revolutionize the organ donation process by leveraging blockchain technology to create a transparent, secure, and efficient system.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                We aim to save more lives by reducing waiting times, eliminating inefficiencies, and building trust in the organ donation ecosystem.
              </p>
              <p className="text-lg text-gray-600">
                By connecting donors, recipients, and healthcare providers on a decentralized platform, we're creating a future where organ donation is more accessible, equitable, and effective.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="Medical professionals in a hospital" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How OrganChain Works</h2>
            <p className="mt-4 text-xl text-gray-600">Our blockchain solution simplifies and secures the organ donation process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Registration</h3>
              <p className="text-gray-600">
                Donors register on our platform, providing their medical information and consent. This data is securely stored on the blockchain.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Verification</h3>
              <p className="text-gray-600">
                Medical professionals verify donor information and eligibility. Smart contracts ensure all verifications are transparent and immutable.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Matching</h3>
              <p className="text-gray-600">
                When organs become available, our system automatically matches them with compatible recipients based on medical criteria and urgency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Benefits of Blockchain in Organ Donation</h2>
            <p className="mt-4 text-xl text-gray-600">Why blockchain technology is transforming organ donation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Enhanced Security</h3>
                <p className="mt-2 text-gray-600">
                  Blockchain's immutable ledger ensures that donor and recipient data cannot be tampered with, reducing fraud and errors.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Transparency</h3>
                <p className="mt-2 text-gray-600">
                  All stakeholders have visibility into the donation process, building trust and accountability in the system.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Efficiency</h3>
                <p className="mt-2 text-gray-600">
                  Smart contracts automate matching and verification processes, reducing administrative overhead and waiting times.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                  <Heart className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Improved Outcomes</h3>
                <p className="mt-2 text-gray-600">
                  By optimizing the donation process, more organs reach recipients in time, leading to better medical outcomes and more lives saved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-xl text-gray-600">A dedicated group of professionals committed to transforming organ donation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="Team member" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Dr. Michael Chen</h3>
                <p className="text-gray-500 mb-3">Founder & Medical Director</p>
                <p className="text-gray-600">
                  Transplant surgeon with over 15 years of experience, passionate about improving organ donation systems.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="Team member" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
                <p className="text-gray-500 mb-3">CTO & Blockchain Architect</p>
                <p className="text-gray-600">
                  Blockchain expert with a background in healthcare IT, leading our technical development.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                alt="Team member" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">David Rodriguez</h3>
                <p className="text-gray-500 mb-3">Operations Director</p>
                <p className="text-gray-600">
                  Former hospital administrator with expertise in healthcare logistics and patient advocacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Be part of the revolution in organ donation. Register as a donor today and help save lives.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-8 py-4 bg-white text-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors"
          >
            Become a Donor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;