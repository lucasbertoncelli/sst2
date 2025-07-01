"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type React from "react"

interface ModalProps {
  trigger: React.ReactNode
  title: string
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Modal({ trigger, title, children, open, onOpenChange }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
