
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Wallet, Menu, X } from 'lucide-react';

export const Header = () => {
  const { account, connectWallet, disconnectWallet, isConnected, isConnecting } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="w-full py-4 px-6 md:px-8 fixed top-0 left-0 right-0 z-50 subtle-glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <div className="bg-primary text-primary-foreground p-2 rounded-full">
            <Wallet size={20} />
          </div>
          <span className="font-bold text-xl">PayX3.0</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/dashboard" className="font-medium hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/transactions" className="font-medium hover:text-primary transition-colors">Transactions</Link>
          {isConnected && (
            <Link to="/profile" className="font-medium hover:text-primary transition-colors">Profile</Link>
          )}
        </nav>
        
        {/* Wallet Connection Button */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          
          {isConnected ? (
            <div className="flex items-center space-x-3">
              <span className="bg-muted px-3 py-1.5 rounded-full text-sm font-medium">
                {formatAddress(account || '')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="rounded-full"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button 
            className="p-2 rounded-full hover:bg-muted"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 glass p-4 animate-slide-down">
          <nav className="flex flex-col space-y-4 mb-6">
            <Link 
              to="/" 
              className="font-medium p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="font-medium p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/transactions" 
              className="font-medium p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              Transactions
            </Link>
            {isConnected && (
              <Link 
                to="/profile" 
                className="font-medium p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Profile
              </Link>
            )}
          </nav>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {isConnected ? (
              <div className="flex flex-col space-y-3">
                <div className="text-sm font-medium bg-muted inline-block px-3 py-1.5 rounded-full self-start">
                  {formatAddress(account || '')}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    disconnectWallet();
                    closeMenu();
                  }}
                  className="rounded-full w-full"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => {
                  connectWallet();
                  closeMenu();
                }}
                disabled={isConnecting}
                className="rounded-full w-full bg-primary hover:bg-primary/90"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
