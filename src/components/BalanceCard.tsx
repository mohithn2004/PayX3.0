
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardContent } from '@/components/ui/card';

export const BalanceCard = () => {
  const { balance, isConnected, chainId } = useWallet();
  

  const formattedBalance = parseFloat(balance || '0').toFixed(4);

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
  

  const getUsdValue = () => {
    const ethPrice = 2500; 
    return (parseFloat(balance || '0') * ethPrice).toFixed(2);
  };
  
  return (
    <Card className="crypto-card overflow-hidden">
      <CardContent className="p-0">
        {isConnected ? (
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full cool-gradient-2 rounded-xl" />
            
            <div className="relative p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Current Balance</p>
              <h2 className="text-3xl font-semibold tracking-tight mb-1">{formattedBalance} ETH</h2>
              <p className="text-sm text-muted-foreground">${getUsdValue()} USD</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-medium text-muted-foreground">NETWORK</p>
                <p className="text-sm font-medium">{getNetworkName(chainId)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">Connect your wallet to view balance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
