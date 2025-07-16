import { useState } from "react";
import { Button } from "./ui/button";
import { useWallet } from "../hooks/useWallet";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export default function WalletButton() {
  const {
    account,
    accounts,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    selectAccount,
    formatAddress,
    availableExtensions,
    error,
  } = useWallet();

  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const handleConnectClick = async () => {
    if (isConnected) {
      setShowAccountSelector(!showAccountSelector);
    } else {
      await connectWallet();
    }
  };

  const handleAccountSelect = (selectedAccount: InjectedAccountWithMeta) => {
    selectAccount(selectedAccount);
    setShowAccountSelector(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowAccountSelector(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="bg-background cursor-pointer text-foreground hover:bg-secondary"
        onClick={handleConnectClick}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Connecting...
          </span>
        ) : isConnected && account ? (
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {account.meta.name || formatAddress(account.address)}
          </span>
        ) : (
          "Connect Wallet"
        )}
      </Button>

      {/* Debug Info Button */}
      {!isConnected && (
        <button
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="absolute -bottom-8 right-0 text-xs text-muted-foreground hover:text-foreground"
        >
          Debug Info
        </button>
      )}

      {/* Debug Info Panel */}
      {showDebugInfo && (
        <div className="absolute top-full right-0 mt-10 bg-background border border-border rounded-lg shadow-lg p-4 min-w-80 z-50 text-sm">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <div className="space-y-2">
            <div>
              <strong>Available Extensions:</strong>
              <div className="text-muted-foreground">
                {availableExtensions.length > 0
                  ? availableExtensions.join(", ")
                  : "None detected"}
              </div>
            </div>
            <div>
              <strong>Current URL Protocol:</strong>
              <div className="text-muted-foreground">
                {window.location.protocol}
              </div>
            </div>
            <div>
              <strong>Window.injectedWeb3:</strong>
              <div className="text-muted-foreground">
                {(window as unknown).injectedWeb3 ? "Present" : "Not found"}
              </div>
            </div>
            {error && (
              <div>
                <strong>Last Error:</strong>
                <div className="text-destructive text-xs mt-1 max-h-24 overflow-y-auto">
                  {error}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowDebugInfo(false)}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
      )}

      {/* Account Selector Dropdown */}
      {showAccountSelector && isConnected && (
        <div className="absolute top-full right-0 mt-2 bg-background border border-border rounded-lg shadow-lg p-2 min-w-64 z-50">
          <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
            Select Account
          </div>

          {accounts.map((acc, index) => (
            <button
              key={index}
              onClick={() => handleAccountSelect(acc)}
              className={`w-full text-left p-2 rounded hover:bg-secondary transition-colors ${
                account?.address === acc.address
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
            >
              <div className="font-medium">
                {acc.meta.name || "Unnamed Account"}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatAddress(acc.address)}
              </div>
              {acc.meta.source && (
                <div className="text-xs text-muted-foreground capitalize">
                  {acc.meta.source}
                </div>
              )}
            </button>
          ))}

          <hr className="my-2 border-border" />

          <button
            onClick={handleDisconnect}
            className="w-full text-left p-2 rounded hover:bg-destructive/10 text-destructive transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      )}

      {/* Click outside overlay */}
      {(showAccountSelector || showDebugInfo) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowAccountSelector(false);
            setShowDebugInfo(false);
          }}
        />
      )}
    </div>
  );
}
