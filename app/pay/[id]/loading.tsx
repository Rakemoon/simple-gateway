export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full shadow-neumorphic flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full opacity-50" />
        </div>
        <p className="text-gray-600">Loading payment gateway...</p>
      </div>
    </div>
  )
}
