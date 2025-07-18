"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Coins,
  AlertCircle,
  Home,
  Share2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractiveBackground } from "@/components/interactive-background";
import { AppTitle } from "@/components/app-title";
import { formatNumberWithDot } from "@/lib/utils";
import { PaymentGateway } from "@/constants";
import { tokenIcons } from "@/components/create-gateway";
import Link from "next/link";

const paymentSteps = ["details", "form", "processing", "success"] as const;
type PaymentStep = (typeof paymentSteps)[number];

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const gatewayId = params.id as string;

  const [gateway, setGateway] = useState<PaymentGateway | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<PaymentStep>("details");
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    amount: "",
  });

  // Load gateway data from localStorage
  useEffect(() => {
    const loadGateway = () => {
      try {
        const savedGateways = localStorage.getItem("OrangeGateways");
        if (savedGateways) {
          const gateways: PaymentGateway[] = JSON.parse(savedGateways);
          const foundGateway = gateways.find((g) => g.id === gatewayId);
          setGateway(foundGateway || null);
        }
      } catch (error) {
        console.error("Error loading gateway:", error);
      } finally {
        setLoading(false);
      }
    };

    if (gatewayId) {
      loadGateway();
    }
  }, [gatewayId]);

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

  const nextStep = () => {
    const currentIndex = paymentSteps.indexOf(currentStep);
    if (currentIndex < paymentSteps.length - 1) {
      setCurrentStep(paymentSteps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = paymentSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(paymentSteps[currentIndex - 1]);
    }
  };

  const handlePayment = () => {
    setCurrentStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      // Update gateway stats
      try {
        const savedStats = localStorage.getItem("OrangeGatewayStats");
        if (savedStats && gateway) {
          const stats = JSON.parse(savedStats);
          const updatedStats = {
            ...stats,
            [gateway.id]: {
              totalReceived:
                (stats[gateway.id]?.totalReceived || 0) +
                parseAmount(formData.amount),
              transactionCount: (stats[gateway.id]?.transactionCount || 0) + 1,
            },
          };
          localStorage.setItem(
            "OrangeGatewayStats",
            JSON.stringify(updatedStats)
          );
        }
      } catch (error) {
        console.error("Error updating stats:", error);
      }

      setCurrentStep("success");
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareGateway = () => {
    if (gateway) {
      if (navigator.share) {
        navigator.share({
          title: gateway.title,
          text: gateway.description,
          url: gateway.link,
        });
      } else {
        copyToClipboard(gateway.link);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative">
        <InteractiveBackground />
        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full shadow-neumorphic flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-gray-600">Loading payment gateway...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!gateway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative">
        <InteractiveBackground />
        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-3xl shadow-neumorphic p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-neumorphic flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Gateway Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The payment gateway you're looking for doesn't exist or has been
                removed.
              </p>
              <Button
                onClick={() => {
                  router.push("/");
                }}
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to OrangeGateway
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <InteractiveBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen flex grow z-10 absolute justify-center items-center gap-8"
      >
        {/* Header */}
        <div className="self-center h-max">
          <AppTitle />
        </div>

        {/* Main Card */}
        <motion.div
          className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-3xl shadow-neumorphic p-8 max-w-md grow"
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="wait">
            {currentStep === "details" && (
              <PaymentDetailsView
                gateway={gateway}
                onNext={nextStep}
                onShare={shareGateway}
                onCopy={copyToClipboard}
              />
            )}
            {currentStep === "form" && (
              <PaymentFormStep
                formData={formData}
                setFormData={setFormData}
                onBack={prevStep}
                onNext={handlePayment}
                gateway={gateway}
              />
            )}
            {currentStep === "processing" && <ProcessingStep />}
            {currentStep === "success" && (
              <SuccessStep formData={formData} gateway={gateway} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

function PaymentDetailsView({
  gateway,
  onNext,
  onShare,
  onCopy,
}: {
  gateway: PaymentGateway;
  onNext: () => void;
  onShare: () => void;
  onCopy: (text: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <motion.img
          src="/orange-mascot.png"
          alt="Cute fox with payment"
          className="w-20 h-20 mx-auto mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Payment Request
        </h2>
        <p className="text-gray-600 text-sm">
          Review the payment details below
        </p>
      </div>

      {/* Payment Details */}
      <motion.div
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {gateway.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{gateway.description}</p>
          </div>

          {gateway.recipientAddress && (
            <div className="flex justify-between items-center py-2 border-t border-gray-200">
              <span className="text-gray-600">Recipient:</span>
              <span className="font-mono text-sm text-gray-800">
                {gateway.recipientAddress.length > 20
                  ? `${gateway.recipientAddress.slice(
                      0,
                      10
                    )}...${gateway.recipientAddress.slice(-10)}`
                  : gateway.recipientAddress}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-t border-gray-200">
            <span className="text-gray-600">Currency:</span>
            <span className="font-medium text-gray-800">
              {gateway.currency}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-t border-gray-200">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium text-gray-800">
              {new Date(gateway.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Share Options */}
      <motion.div
        className="flex space-x-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={() => onCopy(gateway.link)}
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl shadow-neumorphic border-0 bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover"
        >
          <Copy className="w-3 h-3 mr-2" />
          Copy Link
        </Button>
        <Button
          onClick={onShare}
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl shadow-neumorphic border-0 bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover"
        >
          <Share2 className="w-3 h-3 mr-2" />
          Share
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
        >
          Proceed to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

const parseAmount = (am: string) => parseInt(am.replaceAll(",", ""), 10);

function PaymentFormStep({
  formData,
  setFormData,
  onBack,
  onNext,
  gateway,
}: {
  formData: any;
  setFormData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
  gateway: PaymentGateway;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <motion.img
          src="/orange-mascot.png"
          alt={"Cute fox with crypto"}
          className="w-20 h-20 mx-auto mb-4"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Web3 Payment
        </h2>
        <p className="text-gray-600 text-sm">Confirm your crypto payment"</p>
      </div>

      <div className="space-y-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label
            htmlFor="amount"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Amount
          </Label>
          <div className="relative flex gap-4">
            <img
              src={tokenIcons[gateway.currency]}
              className="size-10"
              alt={gateway.currency}
            />
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => {
                let amount = parseAmount(e.target.value);
                amount = isNaN(amount) ? 0 : amount;
                setFormData({
                  ...formData,
                  amount: formatNumberWithDot(amount),
                });
              }}
              className="w-full rounded-2xl shadow-neumorphic-inset bg-gradient-to-r from-green-50 to-emerald-50 border-0 !text-2xl font-semibold text-center text-green-600"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 shadow-neumorphic-inset">
            <div className="flex items-center space-x-3 mb-3">
              <Coins className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-800">
                Web3 Payment Details
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-medium">Lisk Sepolia</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total:</span>
                <div className="flex gap-2 items-center">
                  <span className="font-medium">{formData.amount}</span>
                  <span>{gateway.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex space-x-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex-1"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full py-3 rounded-2xl shadow-neumorphic border-0 bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex-2"
        >
          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
          >
            Confirm Transaction
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProcessingStep() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-400 rounded-full shadow-neumorphic flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </motion.div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Processing Payment
      </h2>
      <p className="text-gray-600">
        Please wait while we securely process your payment...
      </p>

      <motion.div
        className="mt-6 flex justify-center space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-orange-400 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function SuccessStep({
  gateway,
  formData,
}: {
  gateway: PaymentGateway;
  formData: any;
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-neumorphic flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, delay: 0.4 }}
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
      </motion.div>

      <motion.h2
        className="text-xl font-semibold text-gray-800 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Payment Successful!
      </motion.h2>

      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        Thank you for your payment. Your transaction has been processed
        successfully.
      </motion.p>

      <motion.div
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount Paid:</span>
          <span className="font-semibold text-green-600">
            {formData.amount} {gateway.currency}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Payment for:</span>
          <span className="font-medium text-gray-800">{gateway.title}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Transaction ID:</span>
          <span className="font-mono text-sm text-gray-800">
            FX-{gateway.id.toUpperCase()}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          asChild
          className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
        >
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Go to OrangeGateway
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
