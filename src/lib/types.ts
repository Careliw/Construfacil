export interface AverbacaoRow {
  id: string;
  numeroConstrucao: string;
  type: 'Construção Nova' | 'Acréscimo';
  areaAnterior: string;
  areaAtual: string;
  valorCalculado?: number;
}

export interface PrintData {
  rows: AverbacaoRow[];
  cub: string;
}

export interface UserConfig {
  name: string;
}
