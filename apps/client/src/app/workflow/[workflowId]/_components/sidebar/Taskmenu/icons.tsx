import { ActionKey, TaskParamType, TriggerKey } from "@/gql/graphql"
import {
  Globe,
  FileText,
  Type,
  MousePointerClick,
  Hourglass,
  WebhookIcon,
  Rocket,
  BrainCircuit,
  Braces,
  PlusSquare,
  Link2,
  ScrollText,
  LayoutDashboard,
} from "lucide-react"
import type React from "react"


export function getTaskIcon(taskKey?: string) {
  const key = (taskKey || "").toUpperCase() as ActionKey | TriggerKey

  const map: Record<ActionKey | TriggerKey, React.ReactNode> = {
    LAUNCH_BROWSER: <Globe size={14} className="text-orange-400" />,
    PAGE_TO_HTML: <FileText size={14} className="text-orange-400" />,
    EXTRACT_TEXT_FROM_ELEMENT: <Type size={14} className="text-orange-400" />,
    FILL_INPUT: <LayoutDashboard size={14} className="text-orange-400" />,
    CLICK_ELEMENT: <MousePointerClick size={14} className="text-orange-400" />,
    WAIT_FOR_ELEMENT: <Hourglass size={14} className="text-orange-400" />,
    WEBHOOK: <WebhookIcon size={14} className="text-orange-400" />,
    TRIGGER_WEBHOOK: <Rocket size={14} className="text-orange-400" />,
    EXTRACT_DATA_WITH_AI: <BrainCircuit size={14} className="text-orange-400" />,
    READ_PROPERTY_FROM_JSON: <Braces size={14} className="text-orange-400" />,
    ADD_PROPERTY_TO_JSON: <PlusSquare size={14} className="text-orange-400" />,
    NAVIGATE_URL: <Link2 size={14} className="text-orange-400" />,
    SCROLL_TO_ELEMENT: <ScrollText size={14} className="text-orange-400" />,
  }

  return map[key] ?? <Globe size={14} className="text-orange-400" />
}
