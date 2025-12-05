"use client"

interface VideoEmbedProps {
    url: string
    title: string
    aspectRatio?: "16/9" | "4/3"
}

export function VideoEmbed({ url, title, aspectRatio = "16/9" }: VideoEmbedProps) {
    // Extract video ID and platform
    const getEmbedUrl = (url: string): string | null => {
        // YouTube
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = url.includes("youtu.be")
                ? url.split("youtu.be/")[1]?.split("?")[0]
                : new URLSearchParams(new URL(url).search).get("v")
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null
        }

        // PeerTube / tube-numerique-educatif.apps.education.fr
        if (url.includes("tube-numerique-educatif.apps.education.fr") || url.includes("/w/")) {
            const videoPath = url.split("/w/")[1]
            if (videoPath) {
                const baseUrl = url.split("/w/")[0]
                return `${baseUrl}/videos/embed/${videoPath.split("?")[0]}`
            }
        }

        // video.echirolles.fr (PeerTube instance)
        if (url.includes("video.echirolles.fr")) {
            const videoPath = url.split("/w/")[1]
            if (videoPath) {
                return `https://video.echirolles.fr/videos/embed/${videoPath.split("?")[0]}`
            }
        }

        return null
    }

    const embedUrl = getEmbedUrl(url)

    if (!embedUrl) {
        return (
            <div
                className="p-8 bg-card rounded-lg border-2 border-primary text-center"
                style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.15)" }}
            >
                <p className="text-muted-foreground mb-4">Vidéo non disponible en intégration</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-sm border-2 border-primary rounded hover-lift"
                    style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.2)" }}
                >
                    Voir la vidéo
                </a>
            </div>
        )
    }

    return (
        <div
            className="relative rounded-lg overflow-hidden border-2 border-primary"
            style={{
                aspectRatio: aspectRatio,
                boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
            }}
        >
            <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
            />
        </div>
    )
}
