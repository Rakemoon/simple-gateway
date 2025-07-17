"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-neumorphic p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-neumorphic flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Gateway Not Found</h2>
          <p className="text-gray-600 mb-6">
            The payment gateway you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => {
              router.push("/")
            }}
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-2xl shadow-neumorphic"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to OrangeGateway
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
