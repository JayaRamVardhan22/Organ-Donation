import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-teal-400" />
              <span className="ml-2 text-xl font-bold">OrganChain</span>
            </div>
            <p className="mt-2 text-gray-300">
              A blockchain-based organ donation registry that ensures transparency, security, and efficiency in the organ donation process.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-teal-400 transition-colors">Home</a></li>
              <li><a href="/register" className="text-gray-300 hover:text-teal-400 transition-colors">Register</a></li>
              <li><a href="/dashboard" className="text-gray-300 hover:text-teal-400 transition-colors">Dashboard</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-teal-400 transition-colors">About</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="mailto:info@organchain.org" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} OrganChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;