"use client"

import { useRef, useEffect, useCallback } from "react"

export function useSound(src: string, volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(src)
      audioRef.current.volume = volume
      audioRef.current.load() // Preload the audio
    }
  }, [src, volume])

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0 // Reset to start for quick re-play
      audioRef.current.play().catch((error) => console.error("Error playing sound:", error))
    }
  }, [])

  return play
}
