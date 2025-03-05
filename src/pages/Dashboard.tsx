import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface DonorData {
  name: string;
  age: number;
  bloodType: string;
  organs: string[];
  registrationDate: string;
  status: 'active' | 'pending' | 'inactive';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { account, contract, connectWallet, loading } = useWallet();
  const [donorData, setDonorData] = useState<DonorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorData = async () => {
      if (!account || !contract) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is a donor first
        const isDonorRegistered = await contract.isDonor(account);
        
        if (!isDonorRegistered) {
          setIsLoading(false);
          return;
        }
        
        // Fetch data from blockchain
        const donorInfo = await contract.getDonorInfo(account);
        
        // Also fetch from backend for additional data
        try {
          const response = await fetch(`http://localhost:3001/api/donors/${account}`);
          
          if (response.ok) {
            const backendData = await response.json();
            
            // Combine data from blockchain and backend
            setDonorData({
              name: donorInfo.name || backendData.name,
              age: parseInt(donorInfo.age) || backendData.age,
              bloodType: donorInfo.bloodType || backendData.bloodType,
              organs: donorInfo.organs || backendData.organs,
              registrationDate: new Date(parseInt(donorInfo.timestamp) * 1000).toLocaleDateString() || 
                              new Date(backendData.createdAt).toLocaleDateString(),
              status: backendData.status || 'active',
            });
          } else {
            // If backend fails, still use blockchain data
            setDonorData({
              name: donorInfo.name,
              age: parseInt(donorInfo.age),
              bloodType: donorInfo.bloodType,
              organs: donorInfo.organs,
              registrationDate: new Date(parseInt(donorInfo.timestamp) * 1000).toLocaleDateString(),
              status: donorInfo.isActive ? 'active' : 'inactive',
            });
          }
        } catch (backendErr) {
          console.error('Error fetching from backend:', backendErr);
          // Use blockchain data only
          setDonorData({
            name: donorInfo.name,
            age: parseInt(donorInfo.age),
            bloodType: donorInfo.bloodType,
            organs: donorInfo.organs,
            registrationDate: new Date(parseInt(donorInfo.timestamp) * 1000).toLocaleDateString(),
            status: donorInfo.isActive ? 'active' : 'inactive',
          });
        }
      } catch (err) {
        console.error('Error fetching donor data:', err);
        setError('Failed to load your donor information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonorData();
  }, [account, contract]);

  const handleUpdateDonor = () => {
    navigate('/register');
  };

  const handleRevokeDonation = async () => {
    if (!account || !contract) return;
    
    if (window.confirm('Are you sure you want to revoke your organ donation? This action cannot be undone.')) {
      try {
        const tx = await contract.revokeDonation();
        await tx.wait();
        
        // Also update in backend
        try {
          await fetch(`http://localhost:3001/api/donors/${account}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'inactive' }),
          });
        } catch (backendErr) {
          console.error('Error updating backend:', backendErr);
        }
        
        setDonorData(prev => prev ? { ...prev, status: 'inactive' } : null);
      } catch (err) {
        console.error('Error revoking donation:', err);
        setError('Failed to revoke donation. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your organ donation information</p>
        </div>
        
        {!account ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              Please connect your wallet to view your donor information
            </p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Loading your donor information...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 mb-4">
              {error}
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
              >
                Register as Donor
              </button>
            </div>
          </div>
        ) : donorData ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-700 py-4 px-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Your Donor Profile</h2>
              {getStatusBadge(donorData.status)}
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{donorData.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Age</h3>
                  <p className="mt-1 text-lg text-gray-900">{donorData.age}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Blood Type</h3>
                  <p className="mt-1 text-lg text-gray-900">{donorData.bloodType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                  <p className="mt-1 text-lg text-gray-900">{donorData.registrationDate}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Organs for Donation</h3>
                <div className="flex flex-wrap gap-2">
                  {donorData.organs.map((organ, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                    >
                      {organ}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleUpdateDonor}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Information
                </button>
                
                {donorData.status === 'active' && (
                  <button
                    onClick={handleRevokeDonation}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revoke Donation
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              You are not registered as a donor yet.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              Register as Donor
            </button>
          </div>
        )}
        
        {/* Activity Log Section */}
        {donorData && (
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-700 py-4 px-6">
              <h2 className="text-xl font-semibold text-white">Activity Log</h2>
            </div>
            
            <div className="p-6">
              <div className="border-l-2 border-teal-200 pl-4 space-y-4">
                <div className="relative">
                  <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-teal-500"></div>
                  <div>
                    <p className="text-sm text-gray-500">{donorData.registrationDate}</p>
                    <p className="font-medium">Registered as an organ donor</p>
                  </div>
                </div>
                
                {donorData.status === 'inactive' && (
                  <div className="relative">
                    <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm text-gray-500">Today</p>
                      <p className="font-medium">Donation status changed to inactive</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;