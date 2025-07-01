export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Carregando setores e turnos...</p>
        <p className="text-sm text-muted-foreground">Buscando dados da empresa, isso pode levar alguns segundos</p>
      </div>
    </div>
  )
}
