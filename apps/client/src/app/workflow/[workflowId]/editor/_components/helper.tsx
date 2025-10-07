import { User, Workflow } from "@/gql/graphql";
import { WorkflowIcon, History, Settings, Clock } from "lucide-react"
import FlowEditor from "./flowEditor";
import TaskMenu from "@/app/workflow/[workflowId]/_components/sidebar/Taskmenu/taskMenu";
import HistoryPanel from "@/app/workflow/[workflowId]/_components/sidebar/executions/HistoryPanel";
import SettingsPanel from "@/app/workflow/[workflowId]/_components/sidebar/settings/SettingsPanel";
import SchedularPanel from "@/app/workflow/[workflowId]/_components/sidebar/schedular/SchedularPanel";

export type ActivePanel = "task" | "history" | "settings" | "schedule" | null;
export const sidebarItems = [
  {
    id: "task",
    icon: <WorkflowIcon className="size-5" />,
    tooltip: "Actions / Trigger"
  },
  {
    id: "history",
    icon: <History className="size-5" />,
    tooltip: "Execution History"
  },
  {
    id: "schedule",
    icon: <Clock className="size-5" />,
    tooltip: "Schedule"
  },
  {
    id: "settings",
    icon: <Settings className="size-5" />,
    tooltip: "Settings"
  },

]

const panelComponents: Record<Exclude<ActivePanel, null>, React.ComponentType<{ onClose: () => void}>> = {
  task: TaskMenu,
  history: HistoryPanel, 
  settings: SettingsPanel,
  schedule: SchedularPanel,
};

export default function EditorLayout({
  activePanel,
  setActivePanel,
  currentUser,
}: {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  currentUser: User;
}) {
  const Panel = activePanel ? panelComponents[activePanel] : null;

  return (
    <div className="flex h-full">
      {Panel && (
        <div className="w-[280px] max-w-sm border-r shrink-0">
          <Panel onClose={() => setActivePanel(null)}  />
        </div>
      )}
      <div className="flex-1 ">
        <FlowEditor currentUser={currentUser} />
      </div>
    </div>
  );
}