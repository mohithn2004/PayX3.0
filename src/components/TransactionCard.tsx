
import { useState } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { TransactionDetailsDialog } from './TransactionDetailsDialog';
import { Button } from './ui/button';

export interface Transaction {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  completed: boolean;
  hash: string;
  userAddress: string;
}

export const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isSent = transaction.from.toLowerCase() === transaction.userAddress.toLowerCase();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      <div className="p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isSent ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
              {isSent ? (
                <ArrowUpRight className="w-5 h-5 text-red-500" />
              ) : (
                <ArrowDownLeft className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {isSent ? `To: ${formatAddress(transaction.to)}` : `From: ${formatAddress(transaction.from)}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(Number(transaction.timestamp) * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">
                {isSent ? '-' : '+'}{formatEther(transaction.amount)} ETH
              </p>
              <p className={`text-sm ${transaction.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                {transaction.completed ? 'Completed' : 'Pending'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              Details
            </Button>
          </div>
        </div>
      </div>

      <TransactionDetailsDialog
        transaction={transaction}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
};
