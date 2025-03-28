
import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { TransactionCard } from './TransactionCard';

export const TransactionsList = ({ limit }: { limit?: number }) => {
  const { getTransactionHistory, account } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const txs = await getTransactionHistory();
        // Add userAddress to each transaction
        const formattedTxs = txs.map(tx => ({
          ...tx,
          userAddress: account
        }));
        console.log('Loaded transactions:', formattedTxs); // Debug log
        setTransactions(formattedTxs);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
      }
    };
    
    if (account) {
      loadTransactions();
    }
  }, [getTransactionHistory, account]);

  // Filter transactions
  const filteredTransactions = transactions
    .filter(tx => {
      if (filter === 'all') return true;
      if (filter === 'send') return tx.from.toLowerCase() === account?.toLowerCase();
      return tx.to.toLowerCase() === account?.toLowerCase();
    })
    .slice(0, limit);

  return (
    <div>
      {!limit && (
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 dark:bg-muted/30'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'send' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 dark:bg-muted/30'
            }`}
            onClick={() => setFilter('send')}
          >
            Sent
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'receive' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 dark:bg-muted/30'
            }`}
            onClick={() => setFilter('receive')}
          >
            Received
          </button>
        </div>
      )}
      
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard key={`${transaction.hash}-${index}`} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-6 bg-muted rounded-lg dark:bg-muted/30">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};
