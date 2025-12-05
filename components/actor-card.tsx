"use client"

import { useState } from "react"

interface ActorCardProps {
    name: string
    role: string
    description: string
    emoji: string
    delay?: number
}

export function ActorCard({ name, role, description, emoji, delay = 0 }: ActorCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="p-8 bg-card rounded-lg border-2 border-primary hover:border-accent transition-all hover-lift"
            style={{
                animation: `slideUp 0.6s ease-out ${delay}ms both`,
                boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="text-center">
                {/* Emoji Icon */}
                <div
                    className={`text-6xl mb-4 transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
                    style={{ animation: isHovered ? "float 2s ease-in-out infinite" : "none" }}
                >
                    {emoji}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-primary mb-2">{name}</h3>

                {/* Role */}
                <div
                    className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded mb-4"
                    style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}
                >
                    {role}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{description}</p>
            </div>
        </div>
    )
}
