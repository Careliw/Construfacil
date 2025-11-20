export interface AverbacaoRow {
  id: string;
  type: 'Construção Nova' | 'Acréscimo';
  areaAnterior: string;
  areaAtual: string;
  valorCalculado?: number;
  valorCalculadoFmt?: string;
}

export interface PrintData {
  rows: AverbacaoRow[];
  cub: string;
  totalCalculadoFmt: string;
}
