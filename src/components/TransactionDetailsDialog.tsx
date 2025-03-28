import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatEther } from "ethers/lib/utils";
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Transaction } from "./TransactionCard";

interface TransactionDetailsDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailsDialog = ({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {transaction.from.toLowerCase() === transaction.userAddress.toLowerCase() ? (
                <ArrowUpRight className="w-8 h-8 text-red-500" />
              ) : (
                <ArrowDownLeft className="w-8 h-8 text-green-500" />
              )}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatEther(transaction.amount)} ETH</p>
              <p className="text-sm text-muted-foreground">
                {transaction.from.toLowerCase() === transaction.userAddress.toLowerCase() ? 'Sent' : 'Received'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">From</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">{formatAddress(transaction.from)}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">To</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">{formatAddress(transaction.to)}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Date</p>
              <p className="text-sm">{formatDate(transaction.timestamp)}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <p className="text-sm">
                {transaction.completed ? (
                  <span className="text-green-500">Completed</span>
                ) : (
                  <span className="text-yellow-500">Pending</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <a
              href={`https://etherscan.io/tx/${transaction.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline"
            >
              View on Etherscan
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};