import { PaymentStep, paymentSteps } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import { ProcessingStep, SuccessStep } from "./payment-steps";
import { ArrowLeft, ArrowRight, Coins, CreditCard, Smartphone, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const paymentMethods = [
  {
    id: "card",
    label: "Credit Card",
    icon: CreditCard,
    color: "from-blue-400 to-blue-500",
    available: true,
  },
  {
    id: "mobile",
    label: "Mobile Pay",
    icon: Smartphone,
    color: "from-green-400 to-green-500",
    available: true,
  },
  {
    id: "web3",
    label: "Web3 Wallet",
    icon: Coins,
    color: "from-purple-400 to-purple-500",
    available: true,
  },
  {
    id: "wallet",
    label: "Digital Wallet",
    icon: Wallet,
    color: "from-orange-400 to-orange-500",
    available: true,
  },
];

export function PaymentFlow({
  paymentStep,
  setPaymentStep,
  selectedMethod,
  setSelectedMethod,
  formData,
  setFormData,
  onBack,
  isWeb3Connected,
  onConnectWallet,
}: {
  paymentStep: PaymentStep;
  setPaymentStep: (step: PaymentStep) => void;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  formData: any;
  setFormData: (data: any) => void;
  onBack: () => void;
  isWeb3Connected: boolean;
  onConnectWallet: () => void;
}) {
  const nextStep = () => {
    const currentIndex = paymentSteps.indexOf(paymentStep);
    if (currentIndex < paymentSteps.length - 1) {
      setPaymentStep(paymentSteps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = paymentSteps.indexOf(paymentStep);
    if (currentIndex > 0) {
      setPaymentStep(paymentSteps[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const handlePayment = () => {
    setPaymentStep("processing");
    setTimeout(() => {
      setPaymentStep("success");
    }, 3000);
  };

  return (
    <AnimatePresence mode="wait">
      {paymentStep === "method" && (
        <PaymentMethodStep
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          onNext={nextStep}
          onBack={prevStep}
          isWeb3Connected={isWeb3Connected}
          onConnectWallet={onConnectWallet}
        />
      )}
      {paymentStep === "details" && (
        <PaymentDetailsStep
          formData={formData}
          setFormData={setFormData}
          onBack={prevStep}
          onNext={handlePayment}
          selectedMethod={selectedMethod}
        />
      )}
      {paymentStep === "processing" && <ProcessingStep />}
      {paymentStep === "success" && <SuccessStep />}
    </AnimatePresence>
  );
}

function PaymentMethodStep({
  selectedMethod,
  setSelectedMethod,
  onNext,
  onBack,
  isWeb3Connected,
  onConnectWallet,
}: {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
  isWeb3Connected: boolean;
  onConnectWallet: () => void;
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
          src="/placeholder.svg?height=80&width=80"
          alt="Cute fox choosing payment"
          className="w-20 h-20 mx-auto mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Choose Payment Method
        </h2>
        <p className="text-gray-600 text-sm">
          Select your preferred way to pay
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            className={`w-full p-4 rounded-2xl transition-all duration-300 ${
              selectedMethod === method.id
                ? "shadow-neumorphic-inset bg-gradient-to-r from-orange-100 to-amber-100"
                : method.available
                ? "shadow-neumorphic bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover"
                : "shadow-neumorphic-inset bg-gray-100 opacity-60 cursor-not-allowed"
            }`}
            onClick={() => {
              if (method.available) {
                setSelectedMethod(method.id);
              } else if (method.id === "web3") {
                onConnectWallet();
              }
            }}
            whileHover={method.available ? { scale: 1.02 } : {}}
            whileTap={method.available ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay:
                method.id === "card"
                  ? 0.1
                  : method.id === "mobile"
                  ? 0.2
                  : method.id === "web3"
                  ? 0.3
                  : 0.4,
            }}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} shadow-neumorphic-small flex items-center justify-center`}
              >
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-800">{method.label}</h3>
                <p className="text-sm text-gray-500">
                  {method.id === "web3" && !isWeb3Connected
                    ? "Connect wallet first"
                    : "Fast & Secure"}
                </p>
              </div>
              <motion.div
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? "border-orange-400 bg-orange-400"
                    : "border-gray-300"
                }`}
                animate={{ scale: selectedMethod === method.id ? 1.2 : 1 }}
              >
                {selectedMethod === method.id && (
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full mx-auto mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex space-x-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
          transition={{ delay: 0.6 }}
          className="flex-2"
        >
          <Button
            onClick={onNext}
            disabled={!selectedMethod}
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PaymentDetailsStep({
  formData,
  setFormData,
  onBack,
  onNext,
  selectedMethod,
}: {
  formData: any;
  setFormData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
  selectedMethod: string;
}) {
  const isWeb3Payment = selectedMethod === "web3";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <motion.img
          src="/placeholder.svg?height=80&width=80"
          alt={
            isWeb3Payment ? "Cute fox with crypto" : "Cute fox with credit card"
          }
          className="w-20 h-20 mx-auto mb-4"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {isWeb3Payment ? "Web3 Payment" : "Payment Details"}
        </h2>
        <p className="text-gray-600 text-sm">
          {isWeb3Payment
            ? "Confirm your crypto payment"
            : "Enter your card information securely"}
        </p>
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
          <div className="relative">
            <Input
              id="amount"
              value={
                isWeb3Payment ? `${formData.amount} ETH` : `$${formData.amount}`
              }
              readOnly
              className="w-full p-4 rounded-2xl shadow-neumorphic-inset bg-gradient-to-r from-green-50 to-emerald-50 border-0 text-lg font-semibold text-center text-green-600"
            />
          </div>
        </motion.div>

        {isWeb3Payment ? (
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
                  <span className="font-medium">Ethereum Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Fee:</span>
                  <span className="font-medium">~0.002 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold text-purple-600">
                    {(Number.parseFloat(formData.amount) + 0.002).toFixed(3)}{" "}
                    ETH
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label
                htmlFor="cardNumber"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Card Number
              </Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
                className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label
                  htmlFor="expiry"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label
                  htmlFor="cvv"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  CVV
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) =>
                    setFormData({ ...formData, cvv: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Cardholder Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) =>
                  setFormData({ ...formData, cardholderName: e.target.value })
                }
                className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
              />
            </motion.div>
          </>
        )}
      </div>

      <div className="flex space-x-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
          transition={{ delay: 0.7 }}
          className="flex-2"
        >
          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
          >
            {isWeb3Payment ? "Confirm Transaction" : "Pay Now"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
