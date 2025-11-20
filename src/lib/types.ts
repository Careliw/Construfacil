export interface AverbacaoRow {
  id: string;
  numeroConstrucao: string;
  type: 'Construção Nova' | 'Acréscimo';
  areaAnterior: string;
  areaAtual: string;
  valorCalculado?: number;
  valorCalculadoFmt?: string;
}

export interface PrintData {
  rows: AverbacaoRow[];
  cub: string;
  usuarioResponsavel: string;
}

export interface UserConfig {
  name: string;
}
