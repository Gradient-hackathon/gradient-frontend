import { useWallet } from "../hooks/useWallet";

export default function About() {
  const { account, isConnected } = useWallet();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">About Gradient</h1>

      <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
          This is a demonstration of how wallet state is available across
          different pages.
        </p>

        {isConnected && account ? (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-primary font-medium">
              ✅ Wallet connected: {account.meta.name || "Unnamed Account"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              The same wallet information is accessible on every page!
            </p>
          </div>
        ) : (
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-muted-foreground">
              No wallet connected. Connect your wallet from the navbar to see it
              here too!
            </p>
          </div>
        )}

        <div className="prose max-w-none">
          <h2>Features</h2>
          <ul>
            <li>React Context-based wallet state management</li>
            <li>Support for multiple Polkadot wallets</li>
            <li>Persistent wallet connections</li>
            <li>Account switching functionality</li>
            <li>Global accessibility across all components</li>
          </ul>

          <h2>How to Use in Your Components</h2>
          <p>Import and use the wallet hook in any component:</p>
          <pre className="bg-secondary p-4 rounded text-sm overflow-x-auto">
            {`import { useWallet } from '../hooks/useWallet';

function MyComponent() {
  const { account, isConnected, signer } = useWallet();
  
  if (isConnected && account) {
    // Use account.address, account.meta.name, etc.
    // Use signer for transactions
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
