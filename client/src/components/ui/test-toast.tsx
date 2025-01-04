import React from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function TestToast() {
  const { toast } = useToast()

  const showToast = () => {
    toast({
      title: "Test Toast",
      description: "Test du système de notifications",
      variant: "default",
    })
  }

  return (
    <Button onClick={showToast} variant="outline">
      Tester les notifications
    </Button>
  )
}