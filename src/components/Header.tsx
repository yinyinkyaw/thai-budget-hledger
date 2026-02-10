import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  totalBalance: number;
}

export const Header: React.FC<HeaderProps> = ({ totalBalance }) => {
  return (
    <header className="bg-background border-b border-dashed sticky top-0 z-50 h-12">
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between">
          {/* Left: Brand and Balance */}
          <div className="flex items-center space-x-6">
            <h1 className="text-lg font-semibold">FinTrack</h1>
            <div className="flex items-baseline gap-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Balance</p>
              <p className="text-xl font-bold">
                {totalBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} THB
              </p>
            </div>
          </div>

          {/* Right: Wallet Selector and New Button */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-sm">
              <Wallet className="h-3.5 w-3.5" />
              <span>All Wallets</span>
              <svg className="h-3.5 w-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            <Button size="sm" className="gap-1.5 h-8 text-sm bg-foreground hover:bg-foreground/90">
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};