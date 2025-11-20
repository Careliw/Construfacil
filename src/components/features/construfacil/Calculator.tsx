"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { AverbacaoRow } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

  const calculateAllRows = useCallback(() => {
    const cubValue = parseFloat(cub.replace(',', '.')) || 0;

    setRows(currentRows =>
      currentRows.map(row => {
        const areaAnterior = parseFloat(row.areaAnterior.replace(',', '.')) || 0;
        const areaAtual = parseFloat(row.areaAtual.replace(',', '.')) || 0;
        let valor = 0;
        
        if (cubValue > 0) {
            if (row.type === 'Construção Nova') {
              if (areaAtual > 0) valor = areaAtual * cubValue;
            } else if (row.type === 'Acréscimo') {
              if (areaAtual > areaAnterior) valor = (areaAtual - areaAnterior) * cubValue;
            }
        }
        
        return { ...row, valorCalculado: valor };
      })
    );
  }, [cub]);

  useEffect(() => {
    if (isClient) {
      calculateAllRows();
    }
  }, [cub, rows.map(r => `${r.type}-${r.areaAnterior}-${r.areaAtual}`).join(','), calculateAllRows, isClient]);


  const handleSaveCub = () => {
    const cubValue = parseFloat(cub.replace(',', '.')) || 0;
    if (cubValue <= 0) {
      toast({ title: "Valor Inválido", description: "Por favor, insira um valor de CUB positivo.", variant: "destructive" });
      return;
    }
    localStorage.setItem(CUB_STORAGE_KEY, cub);
    toast({ title: "Sucesso", description: "Valor do CUB salvo no navegador!" });
    calculateAllRows();
  };

  const addRow = () => {
    setRows(prevRows => [...prevRows, { id: Date.now(), type: 'Construção Nova', areaAnterior: '', areaAtual: '', valorCalculado: 0 }]);
  };

  const removeRow = (id: number) => {
    setRows(prevRows => prevRows.filter(row => row.id !== id));
  };
  
  const clearAll = () => {
    setRows([]);
    toast({ title: "Tabela Limpa", description: "Todas as linhas foram removidas." });
  };

  const handleRowChange = (id: number, field: keyof AverbacaoRow, value: string | number) => {
    setRows(prevRows => prevRows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleCopyValue = (value: number) => {
    navigator.clipboard.writeText(value.toFixed(2));
    toast({ title: "Copiado!", description: `Valor R$ ${value.toFixed(2)} copiado para a área de transferência.` });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!isClient) return null;

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
            <Button onClick={clearAll} variant="destructive">
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
                {rows.length > 0 ? rows.map(row => (
                  <TableRow key={row.id} className="hover:bg-[#E3F2FD]">
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
                        onChange={(e) => handleRowChange(row.id, 'areaAnterior', e.target.value)}
                        disabled={row.type !== 'Acréscimo'}
                        placeholder="0,00"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={row.areaAtual}
                        onChange={(e) => handleRowChange(row.id, 'areaAtual', e.target.value)}
                        placeholder="0,00"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-lg">{formatCurrency(row.valorCalculado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                         <Button size="icon" variant="ghost" onClick={() => handleCopyValue(row.valorCalculado)} className="text-orange-500 hover:text-orange-600 hover:bg-orange-100">
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
