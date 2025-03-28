
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { ArrowUpRight, QrCode, Scan, X } from 'lucide-react';
import QrReader from 'react-qr-scanner';

export const SendReceiveCard = () => {
  const { account, sendTransaction, isConnected } = useWallet();
  
  // Send form state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // QR Scanner state
  const [showScanner, setShowScanner] = useState(false);
  
  // Validation
  const isValidAddress = recipient ? ethers.utils.isAddress(recipient) : false;
  const isValidAmount = amount ? !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 : false;
  const canSend = isValidAddress && isValidAmount && !isSending;
  
  // Handle send transaction
  const handleSend = async () => {
    if (!canSend || !isConnected) return;
    
    setIsSending(true);
    try {
      const txHash = await sendTransaction(recipient, amount);
      if (txHash) {
        toast({
          title: "Transaction sent",
          description: "Your transaction has been sent and is being processed",
        });
        // Reset form
        setRecipient('');
        setAmount('');
      }
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Failed to send transaction. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle QR code scan
  const handleScan = (data) => {
    if (data) {
      try {
        // Parse the scanned data
        const scannedData = data.text || data;
        
        // Check if it's a valid Ethereum address or payment URI
        if (ethers.utils.isAddress(scannedData)) {
          // If it's a valid Ethereum address, use it directly
          setRecipient(scannedData);
          setShowScanner(false);
          toast({
            title: "Address scanned",
            description: "Ethereum address detected from QR code",
          });
        } else if (scannedData.startsWith('ethereum:')) {
          // Handle ethereum URI format (ethereum:0x123...?value=0.1)
          const addressMatch = scannedData.match(/ethereum:([0-9a-fA-F]{40})/);
          if (addressMatch && addressMatch[1]) {
            const ethAddress = '0x' + addressMatch[1];
            if (ethers.utils.isAddress(ethAddress)) {
              setRecipient(ethAddress);
              
              // Check for amount in the URI
              const valueMatch = scannedData.match(/value=([0-9.]+)/);
              if (valueMatch && valueMatch[1]) {
                setAmount(valueMatch[1]);
              }
              
              setShowScanner(false);
              toast({
                title: "Payment details scanned",
                description: "Address and amount detected from QR code",
              });
            }
          }
        } else {
          toast({
            title: "Invalid QR code",
            description: "The scanned QR code doesn't contain a valid Ethereum address",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("QR scan error:", error);
        toast({
          title: "Scan failed",
          description: "Unable to process the QR code",
          variant: "destructive",
        });
      }
    }
  };

  const handleScanError = (error) => {
    console.error("QR scan error:", error);
    toast({
      title: "Scan error",
      description: "Error accessing camera or scanning QR code",
      variant: "destructive",
    });
  };
  
  return (
    <Card className="crypto-card overflow-hidden">
      <CardContent className="p-0">
        {isConnected ? (
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="w-full rounded-none grid grid-cols-2">
              <TabsTrigger value="send" className="rounded-none data-[state=active]:bg-crypto-blue/10">
                <ArrowUpRight size={16} className="mr-1" />
                Send
              </TabsTrigger>
              <TabsTrigger value="receive" className="rounded-none data-[state=active]:bg-crypto-blue/10">
                <QrCode size={16} className="mr-1" />
                Receive
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="send" className="p-6 space-y-4">
              {showScanner ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm"
                      onClick={() => setShowScanner(false)}
                    >
                      <X size={18} />
                    </Button>
                    <QrReader
                      delay={300}
                      style={{ width: '100%' }}
                      onError={handleScanError}
                      onScan={handleScan}
                      facingMode="environment"
                      constraints={{
                        video: {
                          facingMode: 'environment'
                        }
                      }}
                    />
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      Position the QR code within the frame
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowScanner(false)}
                  >
                    Cancel Scan
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2" 
                        onClick={() => setShowScanner(true)}
                      >
                        <Scan size={14} className="mr-1" />
                        Scan QR
                      </Button>
                    </div>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className={`input-field ${
                        recipient && !isValidAddress ? 'border-red-300 focus:ring-red-200' : ''
                      }`}
                    />
                    {recipient && !isValidAddress && (
                      <p className="text-xs text-red-500">Please enter a valid Ethereum address</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (ETH)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`input-field ${
                        amount && !isValidAmount ? 'border-red-300 focus:ring-red-200' : ''
                      }`}
                    />
                    {amount && !isValidAmount && (
                      <p className="text-xs text-red-500">Please enter a valid amount</p>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleSend}
                    disabled={!canSend}
                    className={`w-full rounded-full ${
                      !canSend ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSending ? 'Sending...' : 'Send ETH'}
                  </Button>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="receive" className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={account || ''}
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Your Wallet Address</p>
                  <p className="font-mono text-xs bg-[var(--brand-accent )] p-2 rounded break-all select-all">
                    {account}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(account || '');
                    toast({
                      title: "Address copied",
                      description: "Wallet address copied to clipboard",
                    });
                  }}
                  className="rounded-full"
                >
                  Copy Address
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 mb-2">Connect your wallet to send or receive ETH</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
