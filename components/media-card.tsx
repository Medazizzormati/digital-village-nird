"use client"

import { ExternalLink, Play, FileText } from "lucide-react"
import { useState } from "react"
import { VideoModal } from "./video-modal"

interface MediaCardProps {
    title: string
    description: string
    url: string
    type: "video" | "article"
    duration?: string
    thumbnail?: string
    source?: string
}

export function MediaCard({ title, description, url, type, duration, thumbnail, source }: MediaCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isVideoOpen, setIsVideoOpen] = useState(false)

    const handleClick = (e: React.MouseEvent) => {
        if (type === "video") {
            e.preventDefault()
            setIsVideoOpen(true)
        }
        // For articles, let the default link behavior work
    }

    return (
        <>
            <a
                href={url}
                onClick={handleClick}
                className="group block p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex flex-col gap-4">
                    {/* Thumbnail or Icon */}
                    <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10">
                        {thumbnail ? (
                            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                {type === "video" ? (
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 transition-all">
                                        <Play className="w-8 h-8 text-primary ml-1" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText className="w-8 h-8 text-cyan-400" />
                                    </div>
                                )}
                            </div>
                        )}
                        {duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
                                {duration}
                            </div>
                        )}
                        
                        {/* Play overlay for videos */}
                        {type === "video" && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                                    <Play className="w-6 h-6 text-black ml-1" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                                type === "video" 
                                    ? "bg-primary/20 text-primary" 
                                    : "bg-cyan-500/20 text-cyan-400"
                            }`}>
                                {type === "video" ? "Vidéo" : "Article"}
                            </span>
                            {source && <span className="text-xs text-gray-500 font-medium">{source}</span>}
                        </div>
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
                    </div>

                    {/* Link indicator */}
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        <span>{type === "video" ? "Regarder" : "Lire l'article"}</span>
                        {type === "video" ? (
                            <Play className={`w-4 h-4 transition-transform ${isHovered ? "scale-110" : ""}`} />
                        ) : (
                            <ExternalLink className={`w-4 h-4 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
                        )}
                    </div>
                </div>
            </a>

            {/* Video Modal */}
            {type === "video" && (
                <VideoModal
                    isOpen={isVideoOpen}
                    onClose={() => setIsVideoOpen(false)}
                    url={url}
                    title={title}
                />
            )}
        </>
    )
}
