"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { AverbacaoRow } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Plus, Trash2, X, Copy } from 'lucide-react';

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
    setRows(prevRows => [...prevRows, { id: crypto.randomUUID(), type: 'Construção Nova', areaAnterior: '', areaAtual: '' }]);
  };

  const removeRow = (id: string) => {
    setRows(prevRows => prevRows.filter(row => row.id !== id));
  };
  
  const clearAll = () => {
    if (rows.length > 0) {
      setRows([]);
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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const sanitizeAreaInput = (value: string) => {
    // remove caracteres inválidos
    let clean = value.replace(/[^0-9,]/g, '');

    // impedir mais de uma vírgula
    clean = clean.replace(/(,.*),/g, '$1');

    // limitar a parte decimal a no máximo 3 dígitos
    clean = clean.replace(/^(\d+),(.*)$/g, (match, intPart, decPart) => {
      return intPart + ',' + decPart.substring(0, 3);
    });

    return clean;
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
      <Card>
        <CardHeader>
          <CardTitle>1. Valor do CUB (Custo Unitário Básico)</CardTitle>
          <CardDescription>Insira o valor do CUB para o mês vigente e salve para usar nos cálculos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:w-auto flex-grow">
              <Label htmlFor="cub-input">Valor do CUB (R$)</Label>
              <Input
                id="cub-input"
                type="text"
                value={cub}
                onChange={(e) => setCub(e.target.value)}
                placeholder="Ex: 2500,50"
                className="text-lg"
              />
            </div>
            <Button onClick={handleSaveCub} className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#43A047] text-white">
              <Save className="mr-2 h-4 w-4" />
              Salvar CUB
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Lançamento de Averbações</CardTitle>
          <CardDescription>Adicione, remova e preencha as informações de cada averbação.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={addRow} className="bg-[#2196F3] hover:bg-[#1E88E5] text-white">
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
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[200px]">Tipo</TableHead>
                  <TableHead>Área Anterior (m²)</TableHead>
                  <TableHead>Área Atual (m²)</TableHead>
                  <TableHead>Valor Calculado (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculatedRows.length > 0 ? calculatedRows.map((row, index) => (
                  <TableRow key={`${row.id}-${index}`} className="hover:bg-accent/50">
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
                        placeholder="0,00"
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
                        placeholder="0,00"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-lg">{formatCurrency(row.valorCalculado || 0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                         <Button size="icon" variant="ghost" onClick={() => handleCopyValue(row.valorCalculado || 0)} className="text-orange-500 hover:text-orange-600 hover:bg-orange-100">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => removeRow(row.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Nenhuma linha adicionada. Clique em "Adicionar Linha".</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• O cálculo acima não possui valor legal. Trata-se apenas de uma ferramenta de auxílio na elaboração de contas.</p>
            <p>• Verifique se o valor do CUB está atualizado correspondendo ao mês vigente.</p>
        </CardContent>
      </Card>
    </div>
  );
}
