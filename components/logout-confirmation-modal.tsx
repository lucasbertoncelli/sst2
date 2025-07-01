"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutConfirmationModal({ isOpen, onClose, onConfirm }: LogoutConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-500" />
            Confirmar Saída
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja sair do sistema? Você será redirecionado para a página de login.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
