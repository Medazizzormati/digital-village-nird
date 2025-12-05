"use client"

import { X, Play, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    url: string
    title: string
}

// Extract video ID from various video URLs
function getEmbedUrl(url: string): { embedUrl: string | null; type: string } {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
        return {
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`,
            type: "youtube"
        }
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
        return {
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
            type: "vimeo"
        }
    }

    // PeerTube / Tube éducatif
    if (url.includes("tube-numerique-educatif") || url.includes("peertube")) {
        // Try to extract the video ID from PeerTube URLs
        const peertubeRegex = /\/w\/([a-zA-Z0-9_-]+)/
        const peertubeMatch = url.match(peertubeRegex)
        if (peertubeMatch) {
            const baseUrl = url.split("/w/")[0]
            return {
                embedUrl: `${baseUrl}/videos/embed/${peertubeMatch[1]}?autoplay=1`,
                type: "peertube"
            }
        }
    }

    // Echirolles video
    if (url.includes("video.echirolles.fr")) {
        const echirollesRegex = /\/w\/([a-zA-Z0-9_-]+)/
        const echirollesMatch = url.match(echirollesRegex)
        if (echirollesMatch) {
            return {
                embedUrl: `https://video.echirolles.fr/videos/embed/${echirollesMatch[1]}?autoplay=1`,
                type: "peertube"
            }
        }
    }

    // If no embed URL can be extracted, return null
    return { embedUrl: null, type: "unknown" }
}

export function VideoModal({ isOpen, onClose, url, title }: VideoModalProps) {
    const [loaded, setLoaded] = useState(false)
    const { embedUrl, type } = getEmbedUrl(url)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
            setLoaded(false)
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Modal Content */}
            <div 
                className="relative w-full max-w-5xl z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Title */}
                <h3 className="text-white font-bold text-lg mb-4 truncate pr-12">{title}</h3>

                {/* Video Container */}
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-white/10">
                    {embedUrl ? (
                        <>
                            {/* Loading State */}
                            {!loaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                            <Play className="w-8 h-8 text-primary ml-1" />
                                        </div>
                                        <p className="text-gray-400 text-sm">Chargement de la vidéo...</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Video iframe */}
                            <iframe
                                src={embedUrl}
                                title={title}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                onLoad={() => setLoaded(true)}
                            />
                        </>
                    ) : (
                        /* Fallback for unsupported video sources */
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Play className="w-10 h-10 text-white/50 ml-1" />
                            </div>
                            <p className="text-white font-medium mb-2">Lecture intégrée non disponible</p>
                            <p className="text-gray-400 text-sm mb-6">
                                Cette vidéo ne peut pas être lue directement sur le site.
                            </p>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                Ouvrir sur le site source
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                    )}
                </div>

                {/* Video Info */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-400 text-sm capitalize">{type === "youtube" ? "YouTube" : type === "vimeo" ? "Vimeo" : type === "peertube" ? "PeerTube" : "Vidéo"}</span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                        Ouvrir dans un nouvel onglet
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    )
}

