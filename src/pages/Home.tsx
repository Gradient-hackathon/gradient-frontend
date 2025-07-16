import { useWallet } from "../hooks/useWallet";

export default function Home() {
  const { account, isConnected, formatAddress } = useWallet();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
        Welcome to Gradient
      </h1>

      <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
          Your Polkadot-powered application is ready!
        </p>

        {isConnected && account ? (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-primary">
              🎉 Wallet Connected!
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Account Name:</span>{" "}
                {account.meta.name || "Unnamed Account"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                <code className="bg-secondary px-2 py-1 rounded text-sm">
                  {formatAddress(account.address)}
                </code>
              </p>
              <p>
                <span className="font-medium">Wallet:</span>{" "}
                <span className="capitalize">{account.meta.source}</span>
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              This account information is available throughout your entire app!
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              Connect your Polkadot wallet to get started
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-2">
              Multi-Wallet Support
            </h3>
            <p className="text-sm text-muted-foreground">
              Supports Polkadot.js, Talisman, SubWallet, and other
              Polkadot-compatible wallets
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-2">Global State</h3>
            <p className="text-sm text-muted-foreground">
              Account information is available across all components in your app
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-2">
              Persistent Connection
            </h3>
            <p className="text-sm text-muted-foreground">
              Your wallet connection persists across browser sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
