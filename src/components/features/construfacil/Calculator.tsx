"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { AverbacaoRow, PrintData } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Plus, Trash2, Printer, Link as LinkIcon, AlertCircle, Copy, Layers } from 'lucide-react';
import { CalculatorRow } from './CalculatorRow';
import { sanitizeNumericInput } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CUB_STORAGE_KEY = 'construfacil_cub';
const ROWS_STORAGE_KEY = 'construfacil_rows';

const createNewRow = (): AverbacaoRow => ({
    id: crypto.randomUUID(),
    numeroConstrucao: '',
    type: 'Construção Nova',
    areaAnterior: '',
    areaAtual: '',
});

export function Calculator() {
  const [cub, setCub] = useState('');
  const [rows, setRows] = useState<AverbacaoRow[]>([]);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedCub = localStorage.getItem(CUB_STORAGE_KEY);
      if (savedCub) setCub(savedCub);
      
      const savedRows = localStorage.getItem(ROWS_STORAGE_KEY);
      if (savedRows) {
        const parsedRows = JSON.parse(savedRows);
        if (Array.isArray(parsedRows) && parsedRows.length > 0) {
          setRows(parsedRows);
        } else {
          setRows([createNewRow()]);
        }
      } else {
        setRows([createNewRow()]);
      }
    } catch (error) {
      console.error("Falha ao carregar dados do localStorage", error);
      setRows([createNewRow()]);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(ROWS_STORAGE_KEY, JSON.stringify(rows));
      } catch (error) {
        console.error("Falha ao salvar dados no localStorage", error);
      }
    }
  }, [rows, isClient]);

  const cubValue = useMemo(() => {
    if (!cub) return 0;
    return parseFloat(cub.replace(',', '.')) || 0;
  }, [cub]);

  const calculatedRows = useMemo(() => {
    if (cubValue <= 0) return rows.map(row => ({ ...row, valorCalculado: 0 }));

    return rows.map(row => {
      const areaAnterior = parseFloat(row.areaAnterior.replace(',', '.')) || 0;
      const areaAtual = parseFloat(row.areaAtual.replace(',', '.')) || 0;
      let valor = 0;
      
      if (row.type === 'Construção Nova' && areaAtual > 0) {
        valor = areaAtual * cubValue;
      } else if (row.type === 'Acréscimo' && areaAtual > areaAnterior) {
        valor = (areaAtual - areaAnterior) * cubValue;
      }
      
      return { ...row, valorCalculado: valor };
    });
  }, [rows, cubValue]);

  const handleSaveCub = useCallback(() => {
    if (cubValue <= 0) {
      toast({ title: "Valor Inválido", description: "Por favor, insira um valor de CUB positivo.", variant: "destructive" });
      return;
    }
    localStorage.setItem(CUB_STORAGE_KEY, cub);
    toast({ title: "Sucesso", description: `CUB de R$ ${cub} salvo no navegador!` });
  }, [cub, cubValue, toast]);

  const addRow = useCallback(() => {
    setRows(prevRows => [...prevRows, createNewRow()]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows(prevRows => {
      if (prevRows.length <= 1) {
        toast({ title: "Ação bloqueada", description: "É necessário manter pelo menos uma linha.", variant: "destructive" });
        return prevRows;
      }
      return prevRows.filter(row => row.id !== id);
    });
  }, [toast]);
  
  const clearAll = useCallback(() => {
    setRows([createNewRow()]);
    toast({ title: "Tabela Limpa", description: "Todas as linhas foram removidas e uma nova foi adicionada." });
  }, [toast]);

  const handleRowChange = useCallback((id: string, field: keyof Omit<AverbacaoRow, 'id' | 'valorCalculado'>, value: string) => {
    setRows(prevRows => prevRows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  }, []);

  const handleDuplicateRow = useCallback((sourceRowId: string) => {
    const sourceRowIndex = rows.findIndex(row => row.id === sourceRowId);
    if (sourceRowIndex === -1) return;

    const sourceRow = rows[sourceRowIndex];
    
    const newRow: AverbacaoRow = {
      ...createNewRow(),
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
    toast({ title: "Linha Duplicada", description: "Uma nova linha foi criada abaixo com os mesmos dados de área." });
  }, [rows, toast]);

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
      rows: calculatedRows.filter(row => (row.valorCalculado ?? 0) > 0),
      cub,
    };
    
    const params = new URLSearchParams();
    params.set('data', JSON.stringify(data));
    window.open(`/print?${params.toString()}`, "_blank");
  };

  const handleCubInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeNumericInput(e.target.value, 5, 2);
    setCub(sanitizedValue);
  };

  if (!isClient) {
    return (
        <div className="space-y-8 animate-pulse p-4 md:p-0">
            <Card><CardHeader><div className="h-8 bg-muted rounded w-1/2"></div></CardHeader><CardContent><div className="h-10 bg-muted rounded w-1/3 mt-6"></div></CardContent></Card>
            <Card><CardHeader><div className="h-8 bg-muted rounded w-1/2"></div></CardHeader><CardContent><div className="h-40 bg-muted rounded w-full mt-6"></div></CardContent></Card>
        </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="border-2 border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle>Valor do CUB (Custo Unitário Básico)</CardTitle>
          <CardDescription>Defina o CUB para os cálculos. O valor ficará salvo no seu navegador.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:w-auto flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="cub-input">Valor do CUB (R$)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href="https://sinduscon.org.br/cub/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Consultar CUB no site do Sinduscon"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Consultar site do Sinduscon</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="cub-input"
                type="text"
                value={cub}
                onChange={handleCubInputChange}
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
        <CardHeader className='flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <CardTitle>Lançamento de Averbações</CardTitle>
            <CardDescription>Adicione, preencha e calcule as informações de cada averbação.</CardDescription>
          </div>
          <Button onClick={handleOpenPrint} variant="outline" className="shrink-0 w-full md:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Cálculo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Button onClick={addRow} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Linha
            </Button>
            <Button onClick={clearAll} variant="destructive" className="w-full sm:w-auto" disabled={rows.length <= 1 && rows.every(r => !r.numeroConstrucao && !r.areaAnterior && !r.areaAtual)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Tabela
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead className="w-[180px]">Nº da Construção</TableHead>
                  <TableHead className="w-[200px]">Tipo de Averbação</TableHead>
                  <TableHead className="w-[150px]">Área Anterior (m²)</TableHead>
                  <TableHead className="w-[150px]">Área Atual (m²)</TableHead>
                  <TableHead className="w-[180px]">Valor Calculado (R$)</TableHead>
                  <TableHead className="text-right w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculatedRows.length > 0 ? calculatedRows.map((row) => (
                  <CalculatorRow
                    key={row.id}
                    row={row}
                    onRowChange={handleRowChange}
                    onRemoveRow={removeRow}
                    onDuplicateRow={handleDuplicateRow}
                    isRemoveDisabled={calculatedRows.length <= 1}
                  />
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

      <div className="important-note flex items-start gap-3 md:gap-4">
        <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
        <div>
            <h4 className="font-bold">Observações Importantes</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>O cálculo acima não possui valor legal. Trata-se apenas de uma ferramenta de auxílio na elaboração de contas.</li>
                <li>Verifique se o valor do CUB está atualizado, correspondendo ao mês vigente da finalização da obra.</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
