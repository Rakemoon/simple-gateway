"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Search,
  Copy,
  Share2,
  Trash2,
  DollarSign,
  TrendingUp,
  Calendar,
  QrCode,
  Coins,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSound } from "@/hooks/use-sound" // Import useSound

interface PaymentGateway {
  id: string
  title: string
  description: string
  amount: string
  recipientAddress: string
  currency: "ETH" | "USD"
  qrCode: string
  link: string
  createdAt: string
}

interface GatewayStats {
  totalReceived: number
  transactionCount: number
}

export function GatewayListFlow({
  gateways,
  gatewayStats,
  onBack,
  onSimulatePayment,
  onDeleteGateway,
}: {
  gateways: PaymentGateway[]
  gatewayStats: Record<string, GatewayStats>
  onBack: () => void
  onSimulatePayment: (gatewayId: string, amount: number) => void
  onDeleteGateway: (gatewayId: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null)
  const [showQRCode, setShowQRCode] = useState<string | null>(null)

  // Initialize sounds
  const playClickSound = useSound("/sounds/click.mp3", 0.3)
  const playQrCodeSound = useSound("/sounds/qr-code.mp3", 0.4)
  const playDeleteSound = useSound("/sounds/delete.mp3", 0.5)

  const filteredGateways = gateways.filter(
    (gateway) =>
      gateway.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gateway.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalFunds = Object.values(gatewayStats).reduce((sum, stat) => sum + stat.totalReceived, 0)
  const totalTransactions = Object.values(gatewayStats).reduce((sum, stat) => sum + stat.transactionCount, 0)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    playClickSound() // Play sound on copy
  }

  const shareLink = (gateway: PaymentGateway) => {
    if (navigator.share) {
      navigator.share({
        title: gateway.title,
        text: gateway.description,
        url: gateway.link,
      })
    } else {
      copyToClipboard(gateway.link)
    }
    playClickSound() // Play sound on share
  }

  if (selectedGateway) {
    return (
      <GatewayDetails
        gateway={selectedGateway}
        stats={gatewayStats[selectedGateway.id] || { totalReceived: 0, transactionCount: 0 }}
        onBack={() => {
          setSelectedGateway(null)
          playClickSound() // Play sound on back
        }}
        onSimulatePayment={onSimulatePayment}
        onDelete={onDeleteGateway}
        onShare={shareLink}
        onCopy={copyToClipboard}
        playClickSound={playClickSound} // Pass down click sound
        playDeleteSound={playDeleteSound} // Pass down delete sound
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => {
              onBack()
              playClickSound() // Play sound on back
            }}
            variant="outline"
            size="sm"
            className="rounded-xl shadow-neumorphic border-0 bg-white hover:shadow-neumorphic-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">My Gateways</h2>
            <p className="text-sm text-gray-600">{gateways.length} payment gateways</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 shadow-neumorphic-inset">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-neumorphic-small flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Received</p>
              <p className="text-lg font-semibold text-green-600">${totalFunds.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-neumorphic-inset">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-neumorphic-small flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-lg font-semibold text-blue-600">{totalTransactions}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search gateways..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-2xl shadow-neumorphic-inset border-0 focus:shadow-neumorphic-focus transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Gateway List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredGateways.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <motion.img
                src="/placeholder.svg?height=100&width=100"
                alt="No gateways fox"
                className="w-20 h-20 mx-auto mb-4 opacity-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              <p className="text-gray-500">
                {searchTerm ? "No gateways match your search" : "No gateways created yet"}
              </p>
            </motion.div>
          ) : (
            filteredGateways.map((gateway, index) => (
              <motion.div
                key={gateway.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedGateway(gateway)
                  playClickSound() // Play sound on gateway click
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-xl shadow-neumorphic-small flex items-center justify-center ${
                          gateway.currency === "ETH"
                            ? "bg-gradient-to-br from-purple-400 to-purple-500"
                            : "bg-gradient-to-br from-green-400 to-emerald-500"
                        }`}
                      >
                        {gateway.currency === "ETH" ? (
                          <Coins className="w-5 h-5 text-white" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{gateway.title}</h3>
                        <p className="text-sm text-gray-500">
                          {gateway.currency === "ETH" ? `${gateway.amount} ETH` : `$${gateway.amount}`}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{gateway.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(gateway.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{gatewayStats[gateway.id]?.transactionCount || 0} payments</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          ${(gatewayStats[gateway.id]?.totalReceived || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">received</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowQRCode(gateway.id)
                        playQrCodeSound() // Play sound on QR code button click
                      }}
                      size="sm"
                      variant="outline"
                      className="rounded-xl shadow-neumorphic-small border-0 bg-white hover:shadow-neumorphic-hover"
                    >
                      <QrCode className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        shareLink(gateway)
                      }}
                      size="sm"
                      variant="outline"
                      className="rounded-xl shadow-neumorphic-small border-0 bg-white hover:shadow-neumorphic-hover"
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowQRCode(null)
              playClickSound() // Play sound on modal close
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-neumorphic max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-4">Payment QR Code</h3>
                {gateways.find((g) => g.id === showQRCode)?.qrCode && (
                  <img
                    src={gateways.find((g) => g.id === showQRCode)?.qrCode || "/placeholder.svg"}
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto rounded-xl shadow-neumorphic-small mb-4"
                  />
                )}
                <Button
                  onClick={() => {
                    setShowQRCode(null)
                    playClickSound() // Play sound on close button
                  }}
                  className="w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl shadow-neumorphic"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function GatewayDetails({
  gateway,
  stats,
  onBack,
  onSimulatePayment,
  onDelete,
  onShare,
  onCopy,
  playClickSound, // Receive sound props
  playDeleteSound, // Receive sound props
}: {
  gateway: PaymentGateway
  stats: GatewayStats
  onBack: () => void
  onSimulatePayment: (gatewayId: string, amount: number) => void
  onDelete: (gatewayId: string) => void
  onShare: (gateway: PaymentGateway) => void
  onCopy: (text: string) => void
  playClickSound: () => void
  playDeleteSound: () => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="rounded-xl shadow-neumorphic border-0 bg-white hover:shadow-neumorphic-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Gateway Details</h2>
            <p className="text-sm text-gray-600">{gateway.title}</p>
          </div>
        </div>
      </div>

      {/* Gateway Info */}
      <motion.div
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start space-x-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl shadow-neumorphic-small flex items-center justify-center ${
              gateway.currency === "ETH"
                ? "bg-gradient-to-br from-purple-400 to-purple-500"
                : "bg-gradient-to-br from-green-400 to-emerald-500"
            }`}
          >
            {gateway.currency === "ETH" ? (
              <Coins className="w-6 h-6 text-white" />
            ) : (
              <CreditCard className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">{gateway.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{gateway.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Amount:</span>
            <p className="font-semibold text-green-600">
              {gateway.currency === "ETH" ? `${gateway.amount} ETH` : `$${gateway.amount}`}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <p className="font-medium text-gray-800">{new Date(gateway.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Gateway ID:</span>
            <p className="font-mono text-xs text-gray-800 break-all">{gateway.id}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 shadow-neumorphic-inset">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-neumorphic-small flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Received</p>
              <p className="text-lg font-semibold text-green-600">${stats.totalReceived.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-neumorphic-inset">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-neumorphic-small flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payments</p>
              <p className="text-lg font-semibold text-blue-600">{stats.transactionCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Code */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-neumorphic-inset mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="w-5 h-5 text-gray-600 mr-2" />
            <span className="font-medium text-gray-800">Payment QR Code</span>
          </div>
          {gateway.qrCode && (
            <img
              src={gateway.qrCode || "/placeholder.svg"}
              alt="Payment QR Code"
              className="w-48 h-48 mx-auto rounded-xl shadow-neumorphic-small"
            />
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              onCopy(gateway.link)
              playClickSound() // Play sound on copy
            }}
            variant="outline"
            className="py-3 rounded-2xl shadow-neumorphic border-0 bg-white hover:shadow-neumorphic-hover transition-all duration-300"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            onClick={() => {
              onShare(gateway)
              playClickSound() // Play sound on share
            }}
            variant="outline"
            className="py-3 rounded-2xl shadow-neumorphic border-0 bg-white hover:shadow-neumorphic-hover transition-all duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Demo Actions */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 shadow-neumorphic-inset">
          <p className="text-sm text-gray-600 mb-3">Demo Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => {
                onSimulatePayment(gateway.id, Number.parseFloat(gateway.amount))
                playClickSound() // Play sound on simulate payment
              }}
              size="sm"
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl shadow-neumorphic-small"
            >
              Simulate Payment
            </Button>
            <Button
              onClick={() => {
                setShowDeleteConfirm(true)
                playClickSound() // Play sound on delete button
              }}
              size="sm"
              variant="outline"
              className="rounded-xl shadow-neumorphic-small border-0 bg-white hover:shadow-neumorphic-hover text-red-600"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowDeleteConfirm(false)
              playClickSound() // Play sound on modal close
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-neumorphic max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-neumorphic flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Delete Gateway?</h3>
                <p className="text-gray-600 text-sm mb-6">
                  This action cannot be undone. The gateway and all its data will be permanently deleted.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      playClickSound() // Play sound on cancel
                    }}
                    variant="outline"
                    className="flex-1 rounded-2xl shadow-neumorphic border-0 bg-white hover:shadow-neumorphic-hover"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onDelete(gateway.id)
                      onBack()
                      playDeleteSound() // Play sound on confirm delete
                    }}
                    className="flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl shadow-neumorphic"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
