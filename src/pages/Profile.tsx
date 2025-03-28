
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/hooks/use-toast';
import { Wallet, Copy, ExternalLink } from 'lucide-react';

const Profile = () => {
  const { account, chainId, disconnectWallet, isConnected } = useWallet();
  
  // Format address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Get network name based on chainId
  const getNetworkName = (chainIdValue: number | null) => {
    if (!chainIdValue) return 'Unknown Network';
    
    switch (chainIdValue) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Mumbai Testnet';
      case 56:
        return 'Binance Smart Chain';
      case 97:
        return 'BSC Testnet';
      default:
        return `Chain ID: ${chainIdValue}`;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Address copied to clipboard",
    });
  };
  
  const viewOnExplorer = () => {
    if (!account) return;
    
    let explorerUrl = 'https://etherscan.io/address/';
    
    // Adjust URL based on network
    if (chainId === 5) {
      explorerUrl = 'https://goerli.etherscan.io/address/';
    } else if (chainId === 11155111) {
      explorerUrl = 'https://sepolia.etherscan.io/address/';
    } else if (chainId === 137) {
      explorerUrl = 'https://polygonscan.com/address/';
    } else if (chainId === 80001) {
      explorerUrl = 'https://mumbai.polygonscan.com/address/';
    } else if (chainId === 56) {
      explorerUrl = 'https://bscscan.com/address/';
    } else if (chainId === 97) {
      explorerUrl = 'https://testnet.bscscan.com/address/';
    }
    
    window.open(explorerUrl + account, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {isConnected ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Your Profile</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                Manage your wallet and account settings
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card text-card-foreground shadow-md border border-border animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Connected Address</Label>
                    <div className="flex items-center mt-1">
                      <div className="bg-muted px-3 py-2 rounded-lg text-sm font-mono flex-1 border border-border">
                        {account}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(account || '')}
                        className="ml-2"
                      >
                        <Copy size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Network</Label>
                    <div className="bg-muted px-3 py-2 rounded-lg text-sm mt-1 border border-border">
                      {getNetworkName(chainId)}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={viewOnExplorer}
                      className="rounded-full border border-border"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      View on Explorer
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={disconnectWallet}
                      className="rounded-full border border-border"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted p-4 rounded-full mb-4 border border-border">
              <Wallet size={40} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground max-w-md mb-8">
              Please connect your MetaMask wallet to access your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
