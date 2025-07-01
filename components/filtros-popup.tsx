"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FiltrosPopupProps {
  onApplyFilters: (filters: any) => void
  isOpen: boolean
  onClose: () => void
}

export function FiltrosPopup({ onApplyFilters, isOpen, onClose }: FiltrosPopupProps) {
  const [selectedYear, setSelectedYear] = useState("2023")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedTipoAtestado, setSelectedTipoAtestado] = useState("")
  const [selectedNome, setSelectedNome] = useState("")

  const anos = ["2021", "2022", "2023"]
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]
  const setores = ["Grv - ADM", "Grv - DDI", "Grv - DFR", "Grv - FTE", "Grv - GVB", "Grv - NKT", "Grv - SGT"]
  const tiposAtestado = [
    "ATESTADO EXTERNO INTEGRAL",
    "ATESTADO EXTERNO PARCIAL",
    "ATESTADO INTERNO INTEGRAL",
    "DENTISTA EXTERNO INTEGRAL",
    "DENTISTA EXTERNO PARCIAL",
  ]
  const nomesFuncionarios = [
    "ADEMIR AIROLDI",
    "ADILSON DE OLIVEIRA",
    "AIRTON SALVADOR",
    "ALEX OLIVEIRA",
    "ALEX SANDRO",
    "ANA MARIA OSTROSKI",
    "ANA PAULA RODRIGUES",
    "CARLOS ROBERTO P.",
    "CARLOS ROBERTO V.",
  ]

  const handleApplyFilters = () => {
    onApplyFilters({
      year: selectedYear,
      month: selectedMonth,
      sector: selectedSector,
      tipoAtestado: selectedTipoAtestado,
      nome: selectedNome,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Filtros</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">Selecione os filtros para visualizar os dados</p>

          <div className="space-y-6">
            {/* Ano */}
            <div>
              <h3 className="font-medium mb-2">Ano</h3>
              <div className="grid grid-cols-3 gap-2">
                {anos.map((ano) => (
                  <button
                    key={ano}
                    className={`py-2 px-4 text-center rounded border ${
                      selectedYear === ano ? "bg-blue-800 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedYear(ano)}
                  >
                    {ano}
                  </button>
                ))}
              </div>
            </div>

            {/* Mês */}
            <div>
              <h3 className="font-medium mb-2">Mês</h3>
              <div className="grid grid-cols-3 gap-2">
                {meses.map((mes) => (
                  <button
                    key={mes}
                    className={`py-2 px-4 text-center rounded border ${
                      selectedMonth === mes ? "bg-blue-800 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedMonth(mes)}
                  >
                    {mes.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Setor */}
            <div>
              <h3 className="font-medium mb-2">Setor</h3>
              <div className="space-y-2">
                {setores.map((setor) => (
                  <button
                    key={setor}
                    className={`py-2 px-4 w-full text-left rounded border ${
                      selectedSector === setor ? "bg-blue-800 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedSector(setor)}
                  >
                    {setor}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo Atestado */}
            <div>
              <h3 className="font-medium mb-2">Tipo Atestado</h3>
              <div className="space-y-2">
                {tiposAtestado.map((tipo) => (
                  <button
                    key={tipo}
                    className={`py-2 px-4 w-full text-left rounded border ${
                      selectedTipoAtestado === tipo ? "bg-blue-800 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedTipoAtestado(tipo)}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            {/* Nome do Funcionário */}
            <div>
              <h3 className="font-medium mb-2">Nome do Funcionário</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nomesFuncionarios.map((nome) => (
                  <button
                    key={nome}
                    className={`py-2 px-4 w-full text-left rounded border ${
                      selectedNome === nome ? "bg-blue-800 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedNome(nome)}
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white" onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
