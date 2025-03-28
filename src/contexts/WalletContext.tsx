import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';
import { getTransactionContract } from '../contracts/TransactionContract';

// Types
// Update the WalletContextType interface
type WalletContextType = {
  account: string | null;
  balance: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (to: string, amount: string) => Promise<string | null>;
  getTransactionHistory: () => Promise<any[]>; // Add this line
};

// Props type
interface WalletProviderProps {
  children: ReactNode;
}

// Default values
// Make sure to include getTransactionHistory in the default context
const defaultContext: WalletContextType = {
  account: null,
  balance: '0',
  chainId: null,
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  sendTransaction: async () => null,
  getTransactionHistory: async () => [], // Add this line
};

// Create context
const WalletContext = createContext<WalletContextType>(defaultContext);

// Provider component
export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Get wallet balance
  const getBalance = async (address: string) => {
    if (!isMetaMaskInstalled()) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask browser extension to use this app",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      
      if (accounts.length > 0) {
        const walletBalance = await getBalance(accounts[0]);
        setAccount(accounts[0]);
        setBalance(walletBalance || '0');
        setChainId(network.chainId);
        
        toast({
          title: "Wallet connected",
          description: "Your MetaMask wallet has been connected successfully",
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Send transaction
  // Update the sendTransaction function
  const sendTransaction = async (to: string, amount: string): Promise<string | null> => {
      if (!isMetaMaskInstalled() || !account) return null;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = getTransactionContract(provider);
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        
        // Send transaction through the contract
        const tx = await contractWithSigner.sendTransaction(to, {
          value: ethers.utils.parseEther(amount)
        });
        
        await tx.wait(); // Wait for transaction to be mined
        
        // Update balance after transaction
        const newBalance = await getBalance(account);
        setBalance(newBalance || '0');
        
        toast({
          title: "Transaction sent",
          description: "Your transaction has been sent to the network",
        });
        
        return tx.hash;
      } catch (error) {
        console.error('Error sending transaction:', error);
        toast({
          title: "Transaction failed",
          description: "Failed to send transaction. Please try again.",
          variant: "destructive",
        });
        return null;
      }
  };
  
  // Add new function to get transaction history
  const getTransactionHistory = async () => {
      if (!isMetaMaskInstalled() || !account) return [];
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = getTransactionContract(provider);
        const transactions = await contract.getTransactions();
        return transactions;
      } catch (error) {
        console.error('Error getting transactions:', error);
        return [];
      }
  };

  // Update the context value
  const value = {
    account,
    balance,
    chainId,
    isConnected: !!account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    getTransactionHistory,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

// Custom hook
export const useWallet = () => useContext(WalletContext);
