import { CreateStep, createSteps, PaymentGateway } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  LinkIcon,
  QrCode,
  Settings,
  Share2,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const tokenIcons = {
  USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  LISK: "https://lisk.com/wp-content/themes/lisk-web-2024/static/ui/favicon/favicon-96x96.png",
};

export function CreateGatewayFlow({
  createStep,
  setCreateStep,
  gatewayForm,
  setGatewayForm,
  onBack,
  onGenerate,
  currentGateway,
}: {
  createStep: CreateStep;
  setCreateStep: (step: CreateStep) => void;
  gatewayForm: any;
  setGatewayForm: (form: any) => void;
  onBack: () => void;
  onGenerate: () => void;
  currentGateway: PaymentGateway | null;
}) {
  const nextStep = () => {
    const currentIndex = createSteps.indexOf(createStep);
    if (currentIndex < createSteps.length - 1) {
      setCreateStep(createSteps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = createSteps.indexOf(createStep);
    if (currentIndex > 0) {
      setCreateStep(createSteps[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {createStep === "form" && (
        <CreateGatewayForm
          gatewayForm={gatewayForm}
          setGatewayForm={setGatewayForm}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {createStep === "preview" && (
        <CreateGatewayPreview
          gatewayForm={gatewayForm}
          onBack={prevStep}
          onGenerate={onGenerate}
        />
      )}
      {createStep === "generated" && currentGateway && (
        <GeneratedGateway gateway={currentGateway} />
      )}
    </AnimatePresence>
  );
}

export function CreateGatewayForm({
  gatewayForm,
  setGatewayForm,
  onNext,
  onBack,
}: {
  gatewayForm: any;
  setGatewayForm: (form: any) => void;
  onNext: () => void;
  onBack: () => void;
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
          alt="Cute fox creating gateway"
          className="w-20 h-20 mx-auto mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Create Payment Gateway
        </h2>
        <p className="text-gray-600 text-sm">Describe your payment needs</p>
      </div>

      <div className="space-y-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Payment Title
          </Label>
          <Input
            id="title"
            placeholder="e.g., Product Purchase, Service Payment"
            value={gatewayForm.title}
            onChange={(e) =>
              setGatewayForm({ ...gatewayForm, title: e.target.value })
            }
            className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe what this payment is for, any special instructions, or terms..."
            value={gatewayForm.description}
            onChange={(e) =>
              setGatewayForm({ ...gatewayForm, description: e.target.value })
            }
            className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300 min-h-[100px] resize-none"
          />
        </motion.div>

        <div className="flex gap-4">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Amount
            </Label>
            <Input
              id="amount"
              placeholder="299.99"
              value={gatewayForm.amount}
              onChange={(e) =>
                setGatewayForm({ ...gatewayForm, amount: e.target.value })
              }
              className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
            />
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grow"
          >
            <Label
              htmlFor="currency"
              className="text-sm font-medium text-gray-700 mb-2 block w-full"
            >
              Currency
            </Label>
            <Select
              defaultValue="USDC"
              onValueChange={(e) => {
                setGatewayForm({ ...gatewayForm, currency: e });
                (
                  document.getElementById(
                    "muisiki-currency"
                  ) as HTMLImageElement
                ).src = tokenIcons[e as keyof typeof tokenIcons];
              }}
            >
              <SelectTrigger
                id="currency"
                value={gatewayForm.currency}
                className="w-full flex justify-start gap-4 p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300 bg-white"
              >
                <img
                  id="muisiki-currency"
                  src={tokenIcons.USDC}
                  alt="USDC"
                  className="w-4"
                />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-neumorphic-inset">
                <SelectItem
                  value="USDC"
                  leftContent={
                    <img src={tokenIcons.USDC} alt="USDC" className="w-4" />
                  }
                >
                  USDC
                </SelectItem>
                <SelectItem
                  value="ETH"
                  leftContent={
                    <img src={tokenIcons.ETH} alt="ETH" className="w-4" />
                  }
                >
                  ETH
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Label
            htmlFor="recipient"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Recipient Address{" "}
            {gatewayForm.currency === "ETH" ? "(Wallet)" : "(Optional)"}
          </Label>
          <Input
            id="recipient"
            placeholder={
              gatewayForm.currency === "ETH"
                ? "0x..."
                : "your-email@example.com"
            }
            value={gatewayForm.recipientAddress}
            onChange={(e) =>
              setGatewayForm({
                ...gatewayForm,
                recipientAddress: e.target.value,
              })
            }
            className="w-full p-4 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
          />
        </motion.div> */}
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
            disabled={!gatewayForm.title}
            className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-medium py-3 rounded-2xl shadow-neumorphic disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CreateGatewayPreview({
  gatewayForm,
  onBack,
  onGenerate,
}: {
  gatewayForm: PaymentGateway;
  onBack: () => void;
  onGenerate: () => void;
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
          alt="Cute fox previewing gateway"
          className="w-20 h-20 mx-auto mb-4"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Preview Gateway
        </h2>
        <p className="text-gray-600 text-sm">
          Review your payment gateway details
        </p>
      </div>

      <motion.div
        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {gatewayForm.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {gatewayForm.description}
            </p>
          </div>

          {gatewayForm.recipientAddress && (
            <div className="flex justify-between items-center py-2 border-t border-gray-200">
              <span className="text-gray-600">Recipient:</span>
              <span className="font-mono text-sm text-gray-800">
                {gatewayForm.recipientAddress.length > 20
                  ? `${gatewayForm.recipientAddress.slice(
                      0,
                      10
                    )}...${gatewayForm.recipientAddress.slice(-10)}`
                  : gatewayForm.recipientAddress}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-t border-gray-200">
            <span className="text-gray-600">Currency:</span>
            <span className="flex gap-4 items-center">
              <img
                className="size-4"
                src={tokenIcons[gatewayForm.currency]}
                alt={tokenIcons[gatewayForm.currency]}
              />
              <span className="font-medium text-gray-800">
                {gatewayForm.currency}
              </span>
            </span>
          </div>
        </div>
      </motion.div>

      <div className="flex space-x-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full py-3 rounded-2xl shadow-neumorphic border-0 bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-2"
        >
          <Button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
          >
            Generate Gateway
            <Settings className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function GeneratedGateway({ gateway }: { gateway: PaymentGateway }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: gateway.title,
        text: gateway.description,
        url: gateway.link,
      });
    } else {
      copyToClipboard(gateway.link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full shadow-neumorphic flex items-center justify-center"
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
        Gateway Created!
      </motion.h2>

      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        Your payment gateway is ready to use
      </motion.p>

      {/* QR Code */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-center mb-4">
          <QrCode className="w-5 h-5 text-gray-600 mr-2" />
          <span className="font-medium text-gray-800">Scan to Pay</span>
        </div>
        {gateway.qrCode && (
          <img
            src={gateway.qrCode || "/placeholder.svg"}
            alt="Payment QR Code"
            className="w-48 h-48 mx-auto rounded-xl shadow-neumorphic-small"
          />
        )}
      </motion.div>

      {/* Payment Link */}
      <motion.div
        className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Payment Link
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => copyToClipboard(gateway.link)}
              size="sm"
              variant="outline"
              className="rounded-xl shadow-neumorphic-small border-0 bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              onClick={shareLink}
              size="sm"
              className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl shadow-neumorphic-small"
            >
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 font-mono break-all">
          {gateway.link}
        </p>
      </motion.div>

      {/* Gateway Details */}
      <motion.div
        className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Title:</span>
            <span className="font-medium text-gray-800">{gateway.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gateway ID:</span>
            <span className="font-mono text-xs text-gray-800">
              {gateway.id}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Button
          onClick={() => {
            window.location.reload();
          }}
          className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
        >
          Create Another Gateway
        </Button>
      </motion.div>
    </motion.div>
  );
}
