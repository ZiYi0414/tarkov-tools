"use client"

interface CharacterTabProps {
    character: {
        id: number
        name: string
        image: string
    }
    isActive: boolean
    onClick: () => void
}

export default function CharacterTab({ character, isActive, onClick }: CharacterTabProps) {
    const isAllTab = character.id === 0

    return (
        <button
            onClick={onClick}
            className={`
        relative flex flex-col items-center px-6 py-4 transition-all rounded-t-2xl
        ${isActive
                    ? "bg-zinc-950 border-x border-t border-zinc-600 -mb-px"
                    : "bg-zinc-800/30 border border-transparent hover:bg-zinc-800/50 hover:border-zinc-700/50"
                }
      `}
        >
            {isAllTab ? (
                <div
                    className={`
            flex h-20 w-20 items-center justify-center rounded-2xl border text-lg font-medium transition-all
            ${isActive ? "border-zinc-500 bg-zinc-900 text-zinc-100" : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"}
          `}
                >
                    全部
                </div>
            ) : (
                <div
                    className={`
            relative h-20 w-20 overflow-hidden rounded-2xl border transition-all
            ${isActive ? "border-zinc-500" : "border-zinc-700 hover:border-zinc-600"}
          `}
                >
                    <img
                        src={character.image || "/placeholder.svg?height=80&width=80"}
                        alt={character.name}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
        </button>
    )
}
