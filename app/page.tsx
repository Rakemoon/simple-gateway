"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  QrCode,
  Copy,
  Share2,
  Coins,
  LinkIcon,
  Settings,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InteractiveBackground } from "@/components/interactive-background";
import { GatewayListFlow } from "@/components/gateway-list"; // Import GatewayListFlow
import { useSound } from "@/hooks/use-sound"; // Import useSound
import { DashboardStep } from "@/components/dashboard-step";
// @ts-expect-error ytta
import QRCode from "qrcode";

import {
  MainStep,
  PaymentGateway,
  PaymentStep,
  CreateStep,
  createSteps,
  paymentSteps,
} from "@/constants";
import { PaymentFlow } from "@/components/payment-flow";
import { CreateGatewayFlow } from "@/components/create-gateway";

export default function FoxyGateway() {
  const [mainStep, setMainStep] = useState<MainStep>("dashboard");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("method");
  const [createStep, setCreateStep] = useState<CreateStep>("form");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [currentGateway, setCurrentGateway] = useState<PaymentGateway | null>(
    null
  );

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    amount: "299.99",
  });

  const [gatewayForm, setGatewayForm] = useState({
    title: "",
    description: "",
    amount: "",
    recipientAddress: "",
    currency: "USD" as "ETH" | "USD",
  });

  // Add new state for gateway management
  const [createdGateways, setCreatedGateways] = useState<PaymentGateway[]>([]);
  const [gatewayStats, setGatewayStats] = useState<
    Record<string, { totalReceived: number; transactionCount: number }>
  >({});

  // Add useEffect to load gateways from localStorage
  useEffect(() => {
    const savedGateways = localStorage.getItem("foxyGateways");
    const savedStats = localStorage.getItem("foxyGatewayStats");

    if (savedGateways) {
      setCreatedGateways(JSON.parse(savedGateways));
    }

    if (savedStats) {
      setGatewayStats(JSON.parse(savedStats));
    }
  }, []);


  const connectWeb3Wallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsWeb3Connected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet!");
    }
  };

  // Update the generatePaymentGateway function to save to localStorage
  const generatePaymentGateway = async () => {
    const id = Math.random().toString(36).substr(2, 9);
    const link = `${window.location.origin}/pay/${id}`; // This will now work with our new route

    let qrCodeDataUrl = "";
    try {
      qrCodeDataUrl = await QRCode.toDataURL(link, {
        width: 200,
        margin: 2,
        color: {
          dark: "#f97316",
          light: "#fff7ed",
        },
      });
    } catch (error) {
      console.error("QR Code generation failed:", error);
    }

    const gateway: PaymentGateway = {
      id,
      title: gatewayForm.title,
      description: gatewayForm.description,
      amount: gatewayForm.amount,
      recipientAddress: gatewayForm.recipientAddress,
      currency: gatewayForm.currency,
      qrCode: qrCodeDataUrl,
      link,
      createdAt: new Date().toISOString(),
    };

    const updatedGateways = [...createdGateways, gateway];
    setCreatedGateways(updatedGateways);
    setCurrentGateway(gateway);

    // Initialize stats for new gateway
    const updatedStats = {
      ...gatewayStats,
      [id]: { totalReceived: 0, transactionCount: 0 },
    };
    setGatewayStats(updatedStats);

    // Save to localStorage
    localStorage.setItem("foxyGateways", JSON.stringify(updatedGateways));
    localStorage.setItem("foxyGatewayStats", JSON.stringify(updatedStats));

    setCreateStep("generated");
  };

  // Add function to simulate payment received (for demo purposes)
  const simulatePaymentReceived = (gatewayId: string, amount: number) => {
    const updatedStats = {
      ...gatewayStats,
      [gatewayId]: {
        totalReceived: (gatewayStats[gatewayId]?.totalReceived || 0) + amount,
        transactionCount: (gatewayStats[gatewayId]?.transactionCount || 0) + 1,
      },
    };
    setGatewayStats(updatedStats);
    localStorage.setItem("foxyGatewayStats", JSON.stringify(updatedStats));
  };

  // Add function to delete gateway
  const deleteGateway = (gatewayId: string) => {
    const updatedGateways = createdGateways.filter((g) => g.id !== gatewayId);
    setCreatedGateways(updatedGateways);

    const updatedStats = { ...gatewayStats };
    delete updatedStats[gatewayId];
    setGatewayStats(updatedStats);

    localStorage.setItem("foxyGateways", JSON.stringify(updatedGateways));
    localStorage.setItem("foxyGatewayStats", JSON.stringify(updatedStats));
  };

  const resetToMain = () => {
    setMainStep("dashboard");
    setPaymentStep("method");
    setCreateStep("form");
    setSelectedMethod("");
    setCurrentGateway(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative">
      {/* Interactive Background */}
      <InteractiveBackground />

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2"
        >
          <div className="w-full justify-center h-max self-center">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative inline-block mb-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full shadow-neumorphic flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetToMain}
                >
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="Foxy mascot"
                    className="w-8 h-8"
                  />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full shadow-neumorphic-small flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                FoxyGateway
              </h1>
              <p className="text-gray-600">Web3 & Traditional Payments</p>
            </motion.div>

            <AnimatePresence>
              {/* Progress Indicator */}
              {mainStep !== "dashboard" && (
                <motion.div
                  className="flex justify-center mt-6 space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  exit={{ opacity: 0 }}
                >
                  {(mainStep === "pay"
                    ? paymentSteps.slice(0, -1)
                    : createSteps
                  ).map((step, index) => {
                    const currentIndex =
                      mainStep === "pay"
                        ? paymentSteps.indexOf(paymentStep)
                        : createSteps.indexOf(createStep);

                    return (
                      <motion.div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          currentIndex >= index
                            ? "bg-orange-400 shadow-neumorphic-small"
                            : "bg-gray-200 shadow-neumorphic-inset"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Card */}
          <motion.div
            className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-3xl shadow-neumorphic p-8 max-w-md"
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AnimatePresence mode="wait">
              {mainStep === "dashboard" && (
                <DashboardStep
                  onPay={() => {
                    setMainStep("pay");
                  }}
                  onCreate={() => {
                    setMainStep("create");
                  }}
                  onViewGateways={() => {
                    setMainStep("gateways");
                  }}
                  isWeb3Connected={isWeb3Connected}
                  walletAddress={walletAddress}
                  onConnectWallet={connectWeb3Wallet}
                  gatewayCount={createdGateways.length}
                  totalFunds={Object.values(gatewayStats).reduce(
                    (sum, stat) => sum + stat.totalReceived,
                    0
                  )}
                />
              )}

              {mainStep === "pay" && (
                <PaymentFlow
                  paymentStep={paymentStep}
                  setPaymentStep={setPaymentStep}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  formData={formData}
                  setFormData={setFormData}
                  onBack={resetToMain}
                  isWeb3Connected={isWeb3Connected}
                  onConnectWallet={connectWeb3Wallet}
                />
              )}

              {mainStep === "create" && (
                <CreateGatewayFlow
                  createStep={createStep}
                  setCreateStep={setCreateStep}
                  gatewayForm={gatewayForm}
                  setGatewayForm={setGatewayForm}
                  onBack={resetToMain}
                  onGenerate={generatePaymentGateway}
                  currentGateway={currentGateway}
                />
              )}

              {/* Update the main step handling to include gateways */}
              {mainStep === "gateways" && (
                <GatewayListFlow
                  gateways={createdGateways}
                  gatewayStats={gatewayStats}
                  onBack={resetToMain}
                  onSimulatePayment={simulatePaymentReceived}
                  onDeleteGateway={deleteGateway}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Update DashboardStep function signature