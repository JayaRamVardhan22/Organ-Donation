import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

type OrganType = 'heart' | 'kidney' | 'liver' | 'lungs' | 'pancreas' | 'corneas';

interface DonorFormData {
  name: string;
  age: string;
  bloodType: string;
  email: string;
  phone: string;
  organs: OrganType[];
  medicalHistory: string;
  emergencyContact: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { account, contract, connectWallet, loading, error } = useWallet();
  const [formData, setFormData] = useState<DonorFormData>({
    name: '',
    age: '',
    bloodType: '',
    email: '',
    phone: '',
    organs: [],
    medicalHistory: '',
    emergencyContact: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const organOptions: { value: OrganType; label: string }[] = [
    { value: 'heart', label: 'Heart' },
    { value: 'kidney', label: 'Kidney' },
    { value: 'liver', label: 'Liver' },
    { value: 'lungs', label: 'Lungs' },
    { value: 'pancreas', label: 'Pancreas' },
    { value: 'corneas', label: 'Corneas' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOrganChange = (organ: OrganType) => {
    setFormData(prev => {
      if (prev.organs.includes(organ)) {
        return { ...prev, organs: prev.organs.filter(o => o !== organ) };
      } else {
        return { ...prev, organs: [...prev.organs, organ] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    // Validate form
    if (!formData.name || !formData.age || !formData.bloodType || !formData.email) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    if (formData.organs.length === 0) {
      setFormError('Please select at least one organ for donation');
      return;
    }
    
    if (!account) {
      setFormError('Please connect your wallet first');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the smart contract to register the donor
      if (contract) {
        const tx = await contract.registerDonor(
          formData.name,
          parseInt(formData.age),
          formData.bloodType,
          formData.organs,
          formData.medicalHistory || 'None'
        );
        
        await tx.wait();
        
        // Also send data to backend
        try {
          const response = await fetch('http://localhost:3001/api/donors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              walletAddress: account,
              age: parseInt(formData.age),
            }),
          });
          
          if (!response.ok) {
            console.warn('Failed to register with backend, but blockchain registration was successful');
          }
        } catch (backendErr) {
          console.warn('Backend error, but blockchain registration was successful:', backendErr);
        }
        
        setFormSuccess('Registration successful! Thank you for becoming an organ donor.');
        
        // Reset form
        setFormData({
          name: '',
          age: '',
          bloodType: '',
          email: '',
          phone: '',
          organs: [],
          medicalHistory: '',
          emergencyContact: '',
        });
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        throw new Error('Contract not initialized');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setFormError('Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Register as an Organ Donor</h1>
            <p className="text-teal-100 mt-1">
              Your decision today could save lives tomorrow
            </p>
          </div>
          
          <div className="p-8">
            {!account ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Please connect your wallet to register as a donor
                </p>
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {formError}
                  </div>
                )}
                
                {formSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                    {formSuccess}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="18"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type *
                    </label>
                    <select
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select Blood Type</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organs for Donation *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {organOptions.map(organ => (
                      <div key={organ.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`organ-${organ.value}`}
                          checked={formData.organs.includes(organ.value)}
                          onChange={() => handleOrganChange(organ.value)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`organ-${organ.value}`} className="ml-2 text-gray-700">
                          {organ.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Please list any significant medical conditions or previous surgeries"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Name and phone number"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-600">
                      By submitting this form, you consent to register as an organ donor. Your information will be securely stored on the blockchain and will only be accessed by authorized medical professionals when needed.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-300"
                  >
                    {isSubmitting ? 'Registering...' : 'Register as Donor'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;