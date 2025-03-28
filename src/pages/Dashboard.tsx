
import { BalanceCard } from '@/components/BalanceCard';
import { SendReceiveCard } from '@/components/SendReceiveCard';
import { TransactionsList } from '@/components/TransactionsList';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Link } from 'react-router-dom';
import { Clock, Wallet } from 'lucide-react';

const Dashboard = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {isConnected ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Dashboard</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                Manage your crypto assets and transactions
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="opacity-0 animate-slide-up" style={{ animationDelay: '200ms', opacity: 1 }}>
                <BalanceCard />
              </div>
              <div className="opacity-0 animate-slide-up" style={{ animationDelay: '300ms', opacity: 1 }}>
                <SendReceiveCard />
              </div>
            </div>
            
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: '400ms', opacity: 1 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <Link to="/transactions">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border">
                <TransactionsList limit={3} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted p-4 rounded-full mb-4 border border-border">
              <Wallet size={40} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground max-w-md mb-8">
              Please connect your MetaMask wallet to access your dashboard and manage your crypto assets.
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

export default Dashboard;
