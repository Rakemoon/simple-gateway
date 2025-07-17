import { motion } from "framer-motion";
import Image from "next/image";

export function AppTitle() {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative inline-block mb-4">
        <motion.div
          className="flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/orange-mascot.png"
            alt="Orange mascot"
            width={200}
            height={200}
          />
        </motion.div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Orange Gateway</h1>
      <p className="text-gray-600">Web3 & Traditional Payments</p>
    </motion.div>
  );
}
