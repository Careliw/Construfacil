export interface AverbacaoRow {
  id: string;
  type: 'Construção Nova' | 'Acréscimo';
  areaAnterior: string;
  areaAtual: string;
  valorCalculado?: number; // Tornando opcional, já que o cálculo é feito separadamente
}
