"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, ExternalLink, Settings, Trash2, Loader, Loader2 } from "lucide-react"
import { useCreateCredential, useDeleteCredential, useGetCredentials } from "@/hooks/user"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import React from "react"
import DeleteCredDialog from "./deleteCredDialog"
import { Credential } from "@/gql/graphql"
import CreateCredDialog from "./createCredentialDialog"

const integrations = [
  {
    id: 1,
    name: "Slack",
    description: "Connect your Slack workspace for automated messaging",
    status: "connected",
    icon: "💬",
    color: "bg-purple-500",
  },
  {
    id: 2,
    name: "Google Sheets",
    description: "Sync data with your Google Sheets automatically",
    status: "connected",
    icon: "📊",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Zapier",
    description: "Connect with thousands of apps through Zapier",
    status: "available",
    icon: "⚡",
    color: "bg-orange-500",
  },
  {
    id: 4,
    name: "Discord",
    description: "Automate Discord server management and notifications",
    status: "available",
    icon: "🎮",
    color: "bg-indigo-500",
  },
]

export default function IntegrationsPage() {
  const { credentials, isLoading } = useGetCredentials()
  console.log(credentials)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Integrations</h1>
        <p className="text-muted-foreground">Connect your favorite apps and services to automate your workflows</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">Credentials</CardTitle>
              <CardDescription className="text-sm">
                Manage credentials used by your workflows and integrations
              </CardDescription>
            </div>
            <CreateCredDialog creds={credentials as Credential[]}  />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full w-full">
                <Loader2 />
              </div>
            ) : credentials && credentials.length > 0 ? (
              <ul className="divide-y rounded-md border bg-card">
                {credentials.map((cred: { id: string; name: string }) => (
                  <li key={cred.id} className="flex items-center justify-between py-2 px-3">
                    <span className="text-sm font-medium">{cred.name}</span>
                    <DeleteCredDialog cred={cred as Credential} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No credentials yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="relative overflow-hidden hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground text-xl">{integration.icon}</div>
                <Badge variant={integration.status === "connected" ? "secondary" : "secondary"} className="text-xs">
                  {integration.status === "connected" ? "Connected" : "Available"}
                </Badge>
              </div>
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <CardDescription className="text-sm">{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {integration.status === "connected" ? (
                  <>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    <Plug className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Popular Integrations</CardTitle>
          <CardDescription className="text-sm">Most commonly used integrations by our users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Gmail", "Notion", "Trello", "Airtable"].map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">
                  {name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
