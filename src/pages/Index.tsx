
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Link } from 'react-router-dom';
import { Wallet, ArrowRight, Send, QrCode, RefreshCw } from 'lucide-react';

const Index = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="px-6 md:px-8 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            The Future of Digital Payments <br className="hidden md:block" />
            with <span className="text-crypto-blue">PayX3.0</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Send and receive crypto payments instantly with our secure, UPI-like experience.
            Connect your MetaMask wallet to get started.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isConnected ? (
              <Link to="/dashboard">
                <Button size="lg" className="rounded-full shadow-sm transition-all duration-300 hover:shadow-md text-base px-8">
                  Go to Dashboard
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={connectWallet}
                className="rounded-full shadow-sm transition-all duration-300 hover:shadow-md text-base px-8"
              >
                Connect Wallet
                <Wallet size={18} className="ml-2" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
            <div className="p-3 rounded-full bg-crypto-blue/10 mb-4">
              <Send size={24} className="text-crypto-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Transfers</h3>
            <p className="text-muted-foreground">
              Send cryptocurrency to anyone, anywhere in the world with just a few clicks.
            </p>
          </div>
          
          <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
            <div className="p-3 rounded-full bg-crypto-blue/10 mb-4">
              <QrCode size={24} className="text-crypto-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">QR Code Payments</h3>
            <p className="text-muted-foreground">
              Generate and scan QR codes for quick and easy crypto payments, just like UPI.
            </p>
          </div>
          
          <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
            <div className="p-3 rounded-full bg-crypto-blue/10 mb-4">
              <RefreshCw size={24} className="text-crypto-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Track your transactions in real-time with instant notifications and status updates.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="p-8 md:p-10 lg:p-16 max-w-7xl mx-auto mt-16">
        <div className="relative overflow-hidden rounded-3xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-crypto-blue to-crypto-purple opacity-90"></div>
          <div className="relative py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between text-white z-10">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Modern Payments?</h2>
              <p className="text-white/80 max-w-lg">
                Join thousands of users already enjoying the simplicity and security of PayX3.0
              </p>
            </div>
            <div>
              <Button 
                size="lg" 
                onClick={isConnected ? undefined : connectWallet}
                className="bg-white text-crypto-blue hover:bg-white/90 rounded-full shadow-sm text-base px-8"
              >
                {isConnected ? (
                  <Link to="/dashboard" className="flex items-center">
                    Get Started
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                ) : (
                  <>
                    Connect Wallet
                    <Wallet size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-6 md:px-8 pt-20 max-w-7xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © 2023 CryptoUPI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
