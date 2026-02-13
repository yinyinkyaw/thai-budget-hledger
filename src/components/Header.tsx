import React from "react";
import { Wallet, Plus, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  totalBalance: number;
}

export const Header: React.FC<HeaderProps> = ({ totalBalance }) => {
  return (
    <header className="bg-background border-b sticky top-0 z-50 h-auto md:h-14 py-3 md:py-0">
      <div
        className="px-4 md:px-6 h-full"
        style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between h-full gap-3 md:gap-0">
          {/* Left: Brand and Balance */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
            <div className="flex flex-col items-baseline">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Total Balance
              </p>
              <p className="text-xl md:text-2xl font-bold">
                $
                {totalBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Right: Wallet Selector and New Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 md:h-9 text-xs md:text-sm border-gray-200 flex-1 md:flex-none justify-center"
            >
              <Wallet className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">All Wallets</span>
              <span className="sm:hidden">Wallets</span>
              <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 opacity-50" />
            </Button>
            <Button
              size="sm"
              className="gap-1.5 h-8 md:h-9 text-xs md:text-sm bg-foreground hover:bg-foreground/90"
            >
              <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>New</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
