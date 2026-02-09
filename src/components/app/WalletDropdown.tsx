"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Check, Plus, Wallet } from "lucide-react";
import type { Wallet as WalletType } from "@/lib/types";

interface WalletDropdownProps {
  wallets: WalletType[];
  selectedWalletId: string | null;
  onSelect: (walletId: string | null) => void;
  onAddWallet: (name: string) => void;
}

export function WalletDropdown({
  wallets,
  selectedWalletId,
  onSelect,
  onAddWallet,
}: WalletDropdownProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  function handleAddWallet(e: React.FormEvent) {
    e.preventDefault();
    if (!newWalletName.trim()) return;
    onAddWallet(newWalletName.trim());
    setNewWalletName("");
    setDialogOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-sm font-normal bg-transparent"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {selectedWallet ? selectedWallet.name : "All Wallets"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Wallets
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSelect(null)}>
            <span className="flex-1">All Wallets</span>
            {selectedWalletId === null && (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </DropdownMenuItem>
          {wallets.map((wallet) => (
            <DropdownMenuItem
              key={wallet.id}
              onClick={() => onSelect(wallet.id)}
            >
              <span className="flex-1">{wallet.name}</span>
              {selectedWalletId === wallet.id && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            <span>Add Wallet</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Add Wallet
            </DialogTitle>
            <DialogDescription className="text-sm">
              Create a new wallet to organize your transactions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWallet} className="grid gap-4 pt-2">
            <div className="grid gap-1.5">
              <Label
                htmlFor="wallet-name"
                className="text-xs font-medium text-muted-foreground"
              >
                Wallet Name
              </Label>
              <Input
                id="wallet-name"
                placeholder="e.g. Savings Account"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                required
                className="h-9"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
