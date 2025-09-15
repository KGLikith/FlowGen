"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CreditCard, TrendingUp, Calendar, Check } from "lucide-react"
import { useState } from "react"

const creditPackages = [
  {
    id: "small",
    name: "Small Pack",
    credits: 1000,
    price: 9.99,
    popular: false,
  },
  {
    id: "medium",
    name: "Medium Pack",
    credits: 5000,
    price: 39.99,
    popular: true,
  },
  {
    id: "large",
    name: "Large Pack",
    credits: 10000,
    price: 69.99,
    popular: false,
  },
]

const consumptionData = [
  { month: "Oct 1", successful: 120, failed: 15 },
  { month: "Oct 5", successful: 95, failed: 8 },
  { month: "Oct 10", successful: 140, failed: 12 },
  { month: "Oct 15", successful: 180, failed: 20 },
  { month: "Oct 20", successful: 160, failed: 18 },
  { month: "Oct 25", successful: 200, failed: 25 },
  { month: "Oct 30", successful: 175, failed: 22 },
  { month: "Nov 1", successful: 190, failed: 15 },
]

const transactions = [
  {
    id: 1,
    date: "2024-10-15",
    description: "Medium Pack - 5,000 credits",
    amount: 39.99,
    status: "completed",
    credits: 5000,
  },
  {
    id: 2,
    date: "2024-09-20",
    description: "Small Pack - 1,000 credits",
    amount: 9.99,
    status: "completed",
    credits: 1000,
  },
  {
    id: 3,
    date: "2024-09-01",
    description: "Large Pack - 10,000 credits",
    amount: 69.99,
    status: "completed",
    credits: 10000,
  },
]

const chartConfig = {
  successful: {
    label: "Successful Process Credits",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Failed Process Credits",
    color: "hsl(var(--chart-2))",
  },
}

export default function BillingPage() {
  const [selectedPackage, setSelectedPackage] = useState("medium")

  return (
    <DashboardLayout credits={{ current: 649, total: 1000 }}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Billing</h1>
          <p className="text-muted-foreground">Manage your credits and billing information</p>
        </div>

        {/* Available Credits */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <div className="w-full h-full bg-primary rounded-full transform translate-x-8 -translate-y-8" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Available Credits
            </CardTitle>
            <CardDescription>When your credit balance reaches zero, your workflows will stop working</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-4">649</div>
            <div className="text-sm text-muted-foreground">Credits remaining from your current balance</div>
          </CardContent>
        </Card>

        {/* Purchase Credits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Purchase Credits
            </CardTitle>
            <CardDescription>Select the number of credits you want to purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
              <div className="space-y-3">
                {creditPackages.map((pkg) => (
                  <div key={pkg.id} className="relative">
                    <Label
                      htmlFor={pkg.id}
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={pkg.id} id={pkg.id} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{pkg.name}</span>
                            {pkg.popular && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">{pkg.credits.toLocaleString()} credits</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${pkg.price}</div>
                        <div className="text-xs text-muted-foreground">
                          ${((pkg.price / pkg.credits) * 1000).toFixed(2)}/1k credits
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Purchase credits
            </Button>
          </CardContent>
        </Card>

        {/* Credits Consumed Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Credits consumed
            </CardTitle>
            <CardDescription>Daily credit consumption in the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="successful" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="failed" stackId="a" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent credit purchases and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${transaction.amount}</div>
                    <div className="text-sm text-muted-foreground">+{transaction.credits.toLocaleString()} credits</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
