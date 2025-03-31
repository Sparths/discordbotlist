import React from "react"
import { Check, HelpCircle, Info, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface Bot {
  id: number
  name: string
  category: string
  description: string
  features: Record<string, boolean | "partial" | string>
}

interface FeatureComparisonTableProps {
  bots: Bot[]
  featureCategories?: Record<string, string[]>
}

export function FeatureComparisonTable({ bots, featureCategories }: FeatureComparisonTableProps) {
  // If no feature categories are provided, extract all unique features from bots
  const allFeatures = featureCategories
    ? Object.values(featureCategories).flat()
    : [...new Set(bots.flatMap((bot) => Object.keys(bot.features)))]

  // Group features by category if categories are provided
  const renderFeaturesByCategory = () => {
    if (!featureCategories) {
      return (
        <>
          {allFeatures.map((feature) => (
            <TableRow key={feature}>
              <TableCell className="font-medium">{feature}</TableCell>
              {bots.map((bot) => (
                <TableCell key={bot.id} className="text-center">
                  {renderFeatureStatus(bot.features[feature])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      )
    }

    return Object.entries(featureCategories).map(([category, features]) => (
      <React.Fragment key={category}>
        <TableRow className="bg-muted/50">
          <TableCell colSpan={bots.length + 1} className="font-bold">
            {category}
          </TableCell>
        </TableRow>
        {features.map((feature) => (
          <TableRow key={feature}>
            <TableCell className="font-medium">{feature}</TableCell>
            {bots.map((bot) => (
              <TableCell key={bot.id} className="text-center">
                {renderFeatureStatus(bot.features[feature])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </React.Fragment>
    ))
  }

  // Render different statuses for features
  const renderFeatureStatus = (status: boolean | "partial" | string | undefined) => {
    if (status === true) {
      return <Check className="mx-auto h-5 w-5 text-green-500" />
    } else if (status === false) {
      return <X className="mx-auto h-5 w-5 text-red-500" />
    } else if (status === "partial") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                  Partial
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>This feature is partially supported or has limitations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else if (typeof status === "string" && status !== "partial") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex justify-center">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex justify-center">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Information not available</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
  }

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Features</TableHead>
            {bots.map((bot) => (
              <TableHead key={bot.id} className="text-center min-w-[150px]">
                <div className="flex flex-col items-center space-y-2">
                  <div className="font-bold">{bot.name}</div>
                  <Badge>{bot.category}</Badge>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b bg-muted/50">
            <TableCell className="font-medium">Description</TableCell>
            {bots.map((bot) => (
              <TableCell key={bot.id} className="text-center text-sm">
                {bot.description}
              </TableCell>
            ))}
          </TableRow>
          {renderFeaturesByCategory()}
        </TableBody>
      </Table>
    </div>
  )
}

