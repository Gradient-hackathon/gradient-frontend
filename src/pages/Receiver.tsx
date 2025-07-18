import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { Button } from "@/components/ui/button";
import { mockData } from "@/utilts/mockData";

interface VerificationResult {
  isVerified: boolean;
  address: string;
  amount: number;
  merkleRoot: string;
  proof: string[];
  leafIndex: number;
}

export default function Receiver() {
  const { account, isConnected, formatAddress } = useWallet();
  const [addressToVerify, setAddressToVerify] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [hasVerified, setHasVerified] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const generateMockProof = (): string[] => {
    // Generate mock merkle proof hashes
    return [
      `0x${Math.random().toString(16).substring(2, 66)}`,
      `0x${Math.random().toString(16).substring(2, 66)}`,
      `0x${Math.random().toString(16).substring(2, 66)}`,
    ];
  };

  const handleVerification = async () => {
    const addressToCheck = addressToVerify || account?.address || "";

    if (!addressToCheck.trim()) {
      alert("Please enter a wallet address to verify");
      return;
    }

    setIsVerifying(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock verification - check if address exists in our employee list
    const employee = mockData.find(
      (emp) => emp.walletAddress === addressToCheck
    );
    const isVerified = !!employee;

    const result: VerificationResult = {
      isVerified,
      address: addressToCheck,
      amount: employee?.amount || 0,
      merkleRoot:
        "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
      proof: generateMockProof(),
      leafIndex: mockData.findIndex(
        (emp) => emp.walletAddress === addressToCheck
      ),
    };

    setVerificationResult(result);
    setHasVerified(true);
    setIsVerifying(false);
  };

  const handleUseConnectedWallet = () => {
    if (account?.address) {
      setAddressToVerify(account.address);
    }
  };

  const handleClaim = () => {
    setShowClaimModal(true);
  };

  if (!isConnected) {
    return (
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Salary Verification
        </h1>
        <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Please connect your wallet to verify your salary inclusion in the
            merkle tree
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
        Salary Verification
      </h1>

      <div className="space-y-6">
        <p className="text-lg text-muted-foreground">
          Verify your inclusion in the salary merkle tree and check your
          allocated amount
        </p>

        {/* Verification Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            🔍 Merkle Proof Verification
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Wallet Address to Verify
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addressToVerify}
                  onChange={(e) => setAddressToVerify(e.target.value)}
                  placeholder="Enter Polkadot wallet address"
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
                {account?.address && (
                  <button
                    onClick={handleUseConnectedWallet}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Connected Wallet
                  </button>
                )}
              </div>
              {account?.address && (
                <p className="text-sm text-muted-foreground mt-1">
                  Connected:{" "}
                  <code className="bg-secondary px-1 rounded text-xs">
                    {formatAddress(account.address)}
                  </code>
                </p>
              )}
            </div>

            <Button
              onClick={handleVerification}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {isVerifying ? "Verifying..." : "🔐 Verify Merkle Proof"}
            </Button>
          </div>
        </div>

        {/* Verification Results */}
        {hasVerified && verificationResult && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-primary mb-4">
              📋 Verification Results
            </h3>

            <div
              className={`border rounded-lg p-4 mb-4 ${
                verificationResult.isVerified
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-red-500 bg-red-50 dark:bg-red-950"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {verificationResult.isVerified ? "✅" : "❌"}
                  </span>
                  <h4
                    className={`font-bold text-lg ${
                      verificationResult.isVerified
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {verificationResult.isVerified
                      ? "Verification Successful!"
                      : "Address Not Found"}
                  </h4>
                </div>
                {verificationResult.isVerified && (
                  <button
                    onClick={handleClaim}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Claim
                  </button>
                )}
              </div>
              <p
                className={`${
                  verificationResult.isVerified
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {verificationResult.isVerified
                  ? `Your wallet is included in the salary tree with an allocation of $${verificationResult.amount.toFixed(
                      2
                    )} USDC`
                  : "Your wallet address was not found in the current salary allocation tree"}
              </p>
            </div>

            {verificationResult.isVerified && (
              <>
                {/* Salary Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <h4 className="font-medium text-primary mb-2">
                      Your Wallet
                    </h4>
                    <code className="bg-secondary px-2 py-1 rounded text-sm break-all">
                      {formatAddress(verificationResult.address)}
                    </code>
                  </div>
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <h4 className="font-medium text-primary mb-2">
                      Allocated Amount
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      ${verificationResult.amount.toFixed(2)} USDC
                    </p>
                  </div>
                </div>

                {/* Merkle Proof Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-primary">
                    🌳 Merkle Proof Details
                  </h4>

                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Merkle Root:</span>
                        <code className="block bg-secondary px-2 py-1 rounded text-xs mt-1 break-all">
                          {verificationResult.merkleRoot}
                        </code>
                      </div>

                      <div>
                        <span className="font-medium">Leaf Index:</span>
                        <span className="ml-2 bg-secondary px-2 py-1 rounded text-sm">
                          {verificationResult.leafIndex}
                        </span>
                      </div>

                      <div>
                        <span className="font-medium">Proof Path:</span>
                        <div className="mt-2 space-y-1">
                          {verificationResult.proof.map((hash, index) => (
                            <code
                              key={index}
                              className="block bg-secondary px-2 py-1 rounded text-xs break-all"
                            >
                              {index}: {hash}
                            </code>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Information Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-primary mb-4">ℹ️ How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">
                Merkle Tree Verification
              </h4>
              <p className="text-sm text-muted-foreground">
                Your wallet address and salary amount are hashed and included in
                a merkle tree. The verification process proves your inclusion
                without revealing other employees' data.
              </p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">
                Privacy & Security
              </h4>
              <p className="text-sm text-muted-foreground">
                Only the merkle root is stored on-chain. Individual salaries
                remain private while still being verifiable through
                cryptographic proofs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4 relative">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  🚀 Processing Claim
                </h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Transferring tokens to you...
                </p>
                <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Transaction Details:
                  </p>
                  <div className="text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Recipient:</span>
                      <span className="text-sm font-semibold">
                        {verificationResult &&
                          formatAddress(verificationResult.address)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Amount:</span>
                      <span className="text-sm font-semibold">
                        ${verificationResult?.amount.toFixed(2)} USDC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <span className="text-sm font-semibold text-green-600">
                        Processing...RECEIVED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="cursor-pointer bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
