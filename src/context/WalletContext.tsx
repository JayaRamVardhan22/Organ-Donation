import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';

// Temporary ABI until we compile the contract
const OrganDonationRegistryABI = [
  "function registerDonor(string memory _name, uint8 _age, string memory _bloodType, string[] memory _organs, string memory _medicalHistory)",
  "function revokeDonation()",
  "function getDonorInfo(address donorAddress) view returns (string memory name, uint8 age, string memory bloodType, string[] memory organs, string memory medicalHistory, uint256 timestamp, bool isActive)",
  "function isDonor(address) view returns (bool)"
];

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  contract: any | null;
  loading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  connectWallet: async () => {},
  contract: null,
  loading: false,
  error: null,
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          
          // Connect to the smart contract
          const signer = await provider.getSigner();
          const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
          
          if (contractAddress) {
            const organDonationContract = new ethers.Contract(
              contractAddress,
              OrganDonationRegistryABI,
              signer
            );
            setContract(organDonationContract);
          } else {
            setError("Contract address not found in environment variables");
          }
        }
      } else {
        setError("Ethereum wallet not detected. Please install MetaMask.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            // Connect to the smart contract
            const signer = await provider.getSigner();
            const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
            
            if (contractAddress) {
              const organDonationContract = new ethers.Contract(
                contractAddress,
                OrganDonationRegistryABI,
                signer
              );
              setContract(organDonationContract);
            }
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ account, connectWallet, contract, loading, error }}>
      {children}
    </WalletContext.Provider>
  );
};