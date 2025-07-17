import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export function ProcessingStep() {
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

      <motion.img
        src="/placeholder.svg?height=100&width=100"
        alt="Fox processing payment"
        className="w-24 h-24 mx-auto mb-4"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

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

export function SuccessStep() {
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

      <motion.img
        src="/placeholder.svg?height=100&width=100"
        alt="Happy fox celebrating"
        className="w-24 h-24 mx-auto mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
      />

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
        Thank you for using OrangeGateway. Your payment has been processed
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
          <span className="font-semibold text-green-600">$299.99</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Transaction ID:</span>
          <span className="font-mono text-sm text-gray-800">
            FX-2024-001234
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
        >
          Return to Dashboard
        </Button>
      </motion.div>
    </motion.div>
  );
}
