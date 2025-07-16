import React, { createContext, useEffect, useState } from "react";
import {
  web3Enable,
  web3Accounts,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import type { ReactNode } from "react";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export interface WalletContextType {
  // Account state
  account: InjectedAccountWithMeta | null;
  accounts: InjectedAccountWithMeta[];
  isConnected: boolean;
  isConnecting: boolean;

  // Connection methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  selectAccount: (account: InjectedAccountWithMeta) => void;

  // Utilities
  formatAddress: (address: string) => string;
  signer: unknown;

  // Debug info
  availableExtensions: string[];
  error: string | null;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [signer, setSigner] = useState<unknown>(null);
  const [availableExtensions, setAvailableExtensions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check for available extensions on mount
  useEffect(() => {
    const checkExtensions = () => {
      const extensions: string[] = [];

      // Check for common Polkadot wallet extensions
      if ((window as any).injectedWeb3) {
        const injected = (window as any).injectedWeb3;
        extensions.push(...Object.keys(injected));
      }

      // Also check for specific wallet objects
      if ((window as unknown).subwallet) extensions.push("subwallet-direct");
      if ((window as unknown).polkadot) extensions.push("polkadot-direct");
      if ((window as unknown).talisman) extensions.push("talisman-direct");

      setAvailableExtensions(extensions);
      console.log("Available wallet extensions:", extensions);
    };

    // Check immediately
    checkExtensions();

    // Also check after a delay in case extensions load later
    const timer = setTimeout(checkExtensions, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Load saved account from localStorage on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) {
      try {
        const parsedAccount = JSON.parse(savedAccount);
        setAccount(parsedAccount);
        setIsConnected(true);
        // Re-establish signer
        web3FromAddress(parsedAccount.address)
          .then(({ signer }) => {
            setSigner(signer);
          })
          .catch((err) => {
            console.error("Error re-establishing signer:", err);
            // Clear saved account if we can't re-establish connection
            localStorage.removeItem("selectedAccount");
            setAccount(null);
            setIsConnected(false);
          });
      } catch (error) {
        console.error("Error loading saved account:", error);
        localStorage.removeItem("selectedAccount");
      }
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      console.log("Attempting to connect wallet...");

      // First, let's check what's available
      console.log("Window injectedWeb3:", (window as any).injectedWeb3);
      console.log(
        "Available extensions before web3Enable:",
        availableExtensions
      );

      // Enable web3 and get all available extensions
      const extensions = await web3Enable("Gradient App");
      console.log("Extensions returned by web3Enable:", extensions);

      if (extensions.length === 0) {
        const errorMsg = `No Polkadot wallet extensions detected. 
        
Please make sure you have:
1. SubWallet, Polkadot.js, or Talisman installed
2. The extension is enabled in your browser
3. You're using HTTPS (required for wallet extensions)
4. The extension has permission to run on this site

Available extensions detected: ${
          availableExtensions.length > 0
            ? availableExtensions.join(", ")
            : "none"
        }`;

        throw new Error(errorMsg);
      }

      // Get all accounts from all extensions
      console.log("Getting accounts...");
      const allAccounts = await web3Accounts();
      console.log("Accounts found:", allAccounts);

      if (allAccounts.length === 0) {
        throw new Error(
          "No accounts found. Please create an account in your wallet extension and make sure it's unlocked."
        );
      }

      setAccounts(allAccounts);

      // Auto-select first account if none is selected
      if (!account && allAccounts.length > 0) {
        const firstAccount = allAccounts[0];
        setAccount(firstAccount);
        setIsConnected(true);

        // Get signer for the account
        const { signer: accountSigner } = await web3FromAddress(
          firstAccount.address
        );
        setSigner(accountSigner);

        // Save to localStorage
        localStorage.setItem("selectedAccount", JSON.stringify(firstAccount));

        console.log(
          "Successfully connected to:",
          firstAccount.meta.name || firstAccount.address
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect wallet";
      setError(errorMessage);

      // Show a more user-friendly alert
      alert(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setAccounts([]);
    setIsConnected(false);
    setSigner(null);
    setError(null);
    localStorage.removeItem("selectedAccount");
  };

  const selectAccount = async (selectedAccount: InjectedAccountWithMeta) => {
    try {
      setAccount(selectedAccount);
      setIsConnected(true);

      // Get signer for the selected account
      const { signer: accountSigner } = await web3FromAddress(
        selectedAccount.address
      );
      setSigner(accountSigner);

      // Save to localStorage
      localStorage.setItem("selectedAccount", JSON.stringify(selectedAccount));
    } catch (error) {
      console.error("Error selecting account:", error);
      setError("Failed to select account");
    }
  };

  const value: WalletContextType = {
    account,
    accounts,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    selectAccount,
    formatAddress,
    signer,
    availableExtensions,
    error,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
