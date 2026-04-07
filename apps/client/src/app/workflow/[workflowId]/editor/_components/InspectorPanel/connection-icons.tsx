import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Props = {
  provider: "DISCORD" | "GOOGLE_DOCS" | "NOTION" | "SLACK"
  className?: string
}

const labelMap: Record<Props["provider"], string> = {
  DISCORD: "Discord",
  GOOGLE_DOCS: "Google Docs",
  NOTION: "Notion",
  SLACK: "Slack",
}

const initialsMap: Record<Props["provider"], string> = {
  DISCORD: "Di",
  GOOGLE_DOCS: "Gd",
  NOTION: "N",
  SLACK: "S",
}

export function ConnectionIcon({ provider, className }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <Avatar className="h-5 w-5">
        <AvatarFallback className="text-[10px]">{initialsMap[provider]}</AvatarFallback>
      </Avatar>
      <span className="text-xs text-muted-foreground">{labelMap[provider]}</span>
    </div>
  )
}

export function connectionLabel(provider: Props["provider"]) {
  return labelMap[provider]
}
