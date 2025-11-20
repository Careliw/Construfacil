
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { AverbacaoRow, PrintData } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Plus, Trash2, X, Copy, AlertCircle, Printer, Layers } from 'lucide-react';

const CUB_STORAGE_KEY = 'construfacil_cub';

export function Calculator() {
  const [cub, setCub] = useState('');
  const [rows, setRows] = useState<AverbacaoRow[]>([]);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCub = localStorage.getItem(CUB_STORAGE_KEY);
    if (savedCub) {
      setCub(savedCub);
    }
    if (rows.length === 0) {
      addRow();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cubValue = useMemo(() => parseFloat(cub.replace(',', '.')) || 0, [cub]);

  const calculatedRows = useMemo(() => {
    if (cubValue <= 0) return rows.map(row => ({ ...row, valorCalculado: 0 }));

    return rows.map(row => {
      const areaAnterior = parseFloat(row.areaAnterior.replace(',', '.')) || 0;
      const areaAtual = parseFloat(row.areaAtual.replace(',', '.')) || 0;
      let valor = 0;
      
      if (row.type === 'Construção Nova') {
        if (areaAtual > 0) valor = areaAtual * cubValue;
      } else if (row.type === 'Acréscimo') {
        if (areaAtual > areaAnterior) valor = (areaAtual - areaAnterior) * cubValue;
      }
      
      return { ...row, valorCalculado: valor };
    });
  }, [rows, cubValue]);

  const handleSaveCub = () => {
    if (cubValue <= 0) {
      toast({ title: "Valor Inválido", description: "Por favor, insira um valor de CUB positivo.", variant: "destructive" });
      return;
    }
    localStorage.setItem(CUB_STORAGE_KEY, cub);
    toast({ title: "Sucesso", description: "Valor do CUB salvo no navegador!" });
  };

  const addRow = () => {
    setRows(prevRows => [...prevRows, { id: crypto.randomUUID(), numeroConstrucao: '', type: 'Construção Nova', areaAnterior: '', areaAtual: '' }]);
  };

  const removeRow = (id: string) => {
    setRows(prevRows => prevRows.filter(row => row.id !== id));
  };
  
  const clearAll = () => {
    if (rows.length > 0) {
      setRows([]);
      addRow();
      toast({ title: "Tabela Limpa", description: "Todas as linhas foram removidas." });
    }
  };

  const handleRowChange = (id: string, field: keyof Omit<AverbacaoRow, 'id' | 'valorCalculado'>, value: string) => {
    setRows(prevRows => prevRows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleCopyValue = (value: number) => {
    navigator.clipboard.writeText(value.toFixed(2));
    toast({ title: "Copiado!", description: `Valor R$ ${value.toFixed(2)} copiado para a área de transferência.` });
  };
  
  const handleDuplicateRow = (sourceRowId: string) => {
    const sourceRowIndex = rows.findIndex(row => row.id === sourceRowId);
    if (sourceRowIndex === -1) return;

    const sourceRow = rows[sourceRowIndex];
    
    const newRow: AverbacaoRow = {
      id: crypto.randomUUID(),
      numeroConstrucao: '',
      type: sourceRow.type,
      areaAnterior: sourceRow.areaAnterior,
      areaAtual: sourceRow.areaAtual,
    };

    const newRows = [
      ...rows.slice(0, sourceRowIndex + 1),
      newRow,
      ...rows.slice(sourceRowIndex + 1),
    ];
    
    setRows(newRows);
    toast({ title: "Linha Duplicada", description: "Uma nova linha foi criada com as áreas da linha original." });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const sanitizeAreaInput = (value: string) => {
    let clean = value.replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    const match = clean.match(/^(\d{0,5})(,(\d{0,3}))?/);
    if (match) {
      return match[0];
    }
    return '';
  };
  
  const sanitizeNumeroConstrucao = (value: string) => {
    return value.replace(/[^A-Za-z0-9\/-]/g, '');
  };

  const handleOpenPrint = () => {
    const totalCalculado = calculatedRows.reduce((acc, row) => acc + (row.valorCalculado || 0), 0);
    if (cubValue <= 0) {
      toast({ title: "Impressão Bloqueada", description: "Salve um valor de CUB válido para poder imprimir.", variant: "destructive" });
      return;
    }
    if (totalCalculado <= 0) {
      toast({ title: "Impressão Bloqueada", description: "É preciso ter ao menos um cálculo com valor maior que zero para imprimir.", variant: "destructive" });
      return;
    }

    const data: PrintData = {
      rows: calculatedRows.map(row => ({
        ...row,
        valorCalculadoFmt: formatCurrency(row.valorCalculado || 0)
      })),
      cub,
    };
    
    const params = new URLSearchParams();
    params.set('data', JSON.stringify(data));
    window.open(`/print?${params.toString()}`, "_blank");
  };

  if (!isClient) {
    return (
        <div className="space-y-8 animate-pulse">
            <Card><CardHeader><div className="h-8 bg-muted rounded w-1/2"></div></CardHeader><CardContent><div className="h-10 bg-muted rounded w-1/3"></div></CardContent></Card>
            <Card><CardHeader><div className="h-8 bg-muted rounded w-1/2"></div></CardHeader><CardContent><div className="h-10 bg-muted rounded w-1/3"></div></CardContent></Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-2 border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle>Valor do CUB (Custo Unitário Básico)</CardTitle>
          <CardDescription>Defina o CUB para os cálculos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:w-auto flex-grow">
              <div className="flex items-center gap-2">
                <Label htmlFor="cub-input">Valor do CUB (R$)</Label>
                <a
                  href="https://www.sinduscon-rio.com.br/wp/servicos/custo-unitario-basico/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  title="Ir para Sinduscon"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-external-link"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
              <Input
                id="cub-input"
                type="text"
                value={cub}
                onChange={(e) => setCub(sanitizeAreaInput(e.target.value))}
                placeholder="Ex: 2500,50"
                className="text-lg"
              />
            </div>
            <Button onClick={handleSaveCub} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Salvar CUB
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-border/70 shadow-lg">
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>Lançamento de Averbações</CardTitle>
            <CardDescription>Adicione, remova e preencha as informações de cada averbação.</CardDescription>
          </div>
          <Button onClick={handleOpenPrint} variant="outline" className="shrink-0">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Cálculo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={addRow}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Linha
            </Button>
            <Button onClick={clearAll} variant="destructive" disabled={rows.length === 0}>
              <X className="mr-2 h-4 w-4" />
              Limpar Tudo
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead className="min-w-[150px]">Nº da Construção</TableHead>
                  <TableHead className="min-w-[200px]">Tipo</TableHead>
                  <TableHead>Área Anterior (m²)</TableHead>
                  <TableHead>Área Atual (m²)</TableHead>
                  <TableHead>Valor Calculado (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculatedRows.length > 0 ? calculatedRows.map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Input
                        type="text"
                        value={row.numeroConstrucao}
                        onChange={(e) => {
                          const value = sanitizeNumeroConstrucao(e.target.value);
                          handleRowChange(row.id, 'numeroConstrucao', value);
                        }}
                        placeholder="Ex: 12-A"
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={row.type} onValueChange={(value) => handleRowChange(row.id, 'type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Construção Nova">Construção Nova</SelectItem>
                          <SelectItem value="Acréscimo">Acréscimo</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={row.areaAnterior}
                        onChange={(e) => {
                          const value = sanitizeAreaInput(e.target.value);
                          handleRowChange(row.id, 'areaAnterior', value);
                        }}
                        disabled={row.type !== 'Acréscimo'}
                        placeholder="0,000"
                        maxLength={9}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={row.areaAtual}
                        onChange={(e) => {
                          const value = sanitizeAreaInput(e.target.value);
                          handleRowChange(row.id, 'areaAtual', value);
                        }}
                        placeholder="0,000"
                        maxLength={9}
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-lg">{formatCurrency(row.valorCalculado || 0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleDuplicateRow(row.id)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100" title="Duplicar linha abaixo">
                          <Layers className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleCopyValue(row.valorCalculado || 0)} className="text-accent hover:text-accent-foreground hover:bg-accent/90" title="Copiar valor">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => removeRow(row.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90" title="Remover linha">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Nenhuma linha adicionada. Clique em "Adicionar Linha".</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="dashboard-note flex items-start gap-4">
        <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
        <div>
            <h4 className="font-bold">Observações Importantes</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>O cálculo acima não possui valor legal. Trata-se apenas de uma ferramenta de auxílio na elaboração de contas.</li>
                <li>Verifique se o valor do CUB está atualizado, correspondendo ao mês vigente.</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
