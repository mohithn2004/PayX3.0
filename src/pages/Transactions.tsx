
import { TransactionsList } from '@/components/TransactionsList';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet } from 'lucide-react';

const Transactions = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {isConnected ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Transaction History</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                View and manage all your transactions
              </p>
            </div>
            
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border animate-fade-in" style={{ animationDelay: '200ms' }}>
              <TransactionsList />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted p-4 rounded-full mb-4 border border-border">
              <Wallet size={40} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground max-w-md mb-8">
              Please connect your MetaMask wallet to access your transaction history.
            </p>
            <Button 
              size="lg" 
              onClick={connectWallet}
              className="rounded-full"
            >
              Connect MetaMask
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
