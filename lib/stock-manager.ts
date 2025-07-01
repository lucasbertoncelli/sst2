import type { EstoqueEPI, EntregaEPI, EPI } from "@/types"
import { mockEPIs } from "@/lib/mock-data"

export class StockManager {
  private static instance: StockManager
  private estoqueData: EstoqueEPI[] = []
  private entregaData: EntregaEPI[] = []
  private episData: EPI[] = mockEPIs

  static getInstance(): StockManager {
    if (!StockManager.instance) {
      StockManager.instance = new StockManager()
    }
    return StockManager.instance
  }

  setEstoqueData(data: EstoqueEPI[]) {
    this.estoqueData = data
  }

  setEntregaData(data: EntregaEPI[]) {
    this.entregaData = data
  }

  setEPIsData(data: EPI[]) {
    this.episData = data
  }

  getEstoqueData(): EstoqueEPI[] {
    return this.estoqueData
  }

  getEntregaData(): EntregaEPI[] {
    return this.entregaData
  }

  getEPIsData(): EPI[] {
    return this.episData
  }

  // Hook: After creating a new EPI delivery, decrease stock
  afterCreateEntregaEPI(newEntrega: EntregaEPI): EstoqueEPI[] {
    const updatedEstoque = this.estoqueData.map((estoque) => {
      if (estoque.epiId === newEntrega.epiId) {
        return {
          ...estoque,
          quantidade: Math.max(0, estoque.quantidade - 1), // Prevent negative stock
        }
      }
      return estoque
    })

    // Also update the EPI data directly
    this.episData = this.episData.map((epi) => {
      if (epi.id === newEntrega.epiId) {
        return {
          ...epi,
          quantidade: Math.max(0, epi.quantidade - 1),
        }
      }
      return epi
    })

    this.estoqueData = updatedEstoque
    return updatedEstoque
  }

  // Check if EPI is available in stock
  isEPIAvailable(epiId: string): boolean {
    const epi = this.episData.find((e) => e.id === epiId)
    return epi ? epi.quantidade > 0 : false
  }

  // Get available quantity for an EPI
  getAvailableQuantity(epiId: string): number {
    const epi = this.episData.find((e) => e.id === epiId)
    return epi ? epi.quantidade : 0
  }

  // Update EPI quantity directly
  updateEPIQuantity(epiId: string, newQuantity: number): void {
    this.episData = this.episData.map((epi) => {
      if (epi.id === epiId) {
        return {
          ...epi,
          quantidade: Math.max(0, newQuantity),
        }
      }
      return epi
    })

    // Also update estoque data if it exists
    this.estoqueData = this.estoqueData.map((estoque) => {
      if (estoque.epiId === epiId) {
        return {
          ...estoque,
          quantidade: Math.max(0, newQuantity),
        }
      }
      return estoque
    })
  }
}
