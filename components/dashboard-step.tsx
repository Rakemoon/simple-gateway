import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, DollarSign, LinkIcon, Plus, Settings } from "lucide-react";

export function DashboardStep({
  onPay,
  onCreate,
  onViewGateways,
  isWeb3Connected,
  walletAddress,
  onConnectWallet,
  gatewayCount,
  totalFunds,
}: {
  onPay: () => void;
  onCreate: () => void;
  onViewGateways: () => void;
  isWeb3Connected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  gatewayCount: number;
  totalFunds: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <motion.img
          src="/orange-mascot.png"
          alt="Orange dashboard"
          className="w-24 h-24 mx-auto mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome to OrangeGateway
        </h2>
        <p className="text-gray-600 text-sm">Choose your action below</p>
      </div>

      {/* Web3 Connection Status */}
      <motion.div
        className={`mb-6 p-4 rounded-2xl ${
          isWeb3Connected
            ? "bg-gradient-to-r from-green-50 to-emerald-50 shadow-neumorphic-inset"
            : "bg-gradient-to-r from-orange-50 to-amber-50 shadow-neumorphic"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isWeb3Connected ? "bg-green-400" : "bg-orange-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {isWeb3Connected ? "Web3 Connected" : "Web3 Wallet"}
            </span>
          </div>
          {!isWeb3Connected ? (
            <Button
              onClick={onConnectWallet}
              size="sm"
              className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white rounded-xl shadow-neumorphic-small"
            >
              Connect
            </Button>
          ) : (
            <span className="text-xs text-gray-500 font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-4 mb-6">
        {/* <motion.button
          className="w-full p-6 rounded-2xl shadow-neumorphic bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover transition-all duration-300"
          onClick={onPay}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-neumorphic-small flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-800 text-lg">Make Payment</h3>
              <p className="text-sm text-gray-500">Pay with card or Web3 wallet</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.button> */}

        <motion.button
          className="w-full p-6 rounded-2xl shadow-neumorphic bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover transition-all duration-300"
          onClick={onCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 shadow-neumorphic-small flex items-center justify-center">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-800 text-lg">
                Create Gateway
              </h3>
              <p className="text-sm text-gray-500">
                Generate payment link with QR code
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.button>

        <motion.button
          className="w-full p-6 rounded-2xl shadow-neumorphic bg-white/80 backdrop-blur-sm hover:shadow-neumorphic-hover transition-all duration-300"
          onClick={onViewGateways}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-neumorphic-small flex items-center justify-center">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-800 text-lg">
                My Gateways
              </h3>
              <p className="text-sm text-gray-500">
                {gatewayCount} gateways • ${totalFunds.toFixed(2)} received
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.button>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-4 rounded-2xl shadow-neumorphic bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-2">
            <LinkIcon className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-gray-700">Gateways</span>
          </div>
          <p className="text-2xl font-semibold text-gray-800">{gatewayCount}</p>
        </div>

        <div className="p-4 rounded-2xl shadow-neumorphic bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              Total Funds
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            ${totalFunds.toFixed(2)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
