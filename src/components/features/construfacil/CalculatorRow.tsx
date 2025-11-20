"use client";

import React, { memo } from 'react';
import type { AverbacaoRow } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Copy, Layers } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { sanitizeNumericInput, sanitizeAlphanumeric } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CalculatorRowProps {
  row: AverbacaoRow;
  onRowChange: (id: string, field: keyof Omit<AverbacaoRow, 'id' | 'valorCalculado'>, value: string) => void;
  onRemoveRow: (id: string) => void;
  onDuplicateRow: (id: string) => void;
  isRemoveDisabled: boolean;
}

const formatCurrency = (value: number = 0) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const CalculatorRow: React.FC<CalculatorRowProps> = memo(({ row, onRowChange, onRemoveRow, onDuplicateRow, isRemoveDisabled }) => {
  const { toast } = useToast();

  const handleCopyValue = (value: number) => {
    if (!value || value === 0) {
      toast({ title: "Nada para copiar", description: "O valor calculado é zero.", variant: 'default' });
      return;
    }
    navigator.clipboard.writeText(value.toFixed(2).replace('.', ','));
    toast({ title: "Valor Copiado!", description: `${formatCurrency(value)} copiado para a área de transferência.` });
  };

  const handleAreaChange = (field: 'areaAnterior' | 'areaAtual', value: string) => {
    const sanitized = sanitizeNumericInput(value, 5, 3);
    onRowChange(row.id, field, sanitized);
  };
  
  const handleNumeroConstrucaoChange = (value: string) => {
    const sanitized = sanitizeAlphanumeric(value);
    onRowChange(row.id, 'numeroConstrucao', sanitized);
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Input
          type="text"
          value={row.numeroConstrucao}
          onChange={(e) => handleNumeroConstrucaoChange(e.target.value)}
          placeholder="Ex: Casa 01, Bloco A"
        />
      </TableCell>
      <TableCell>
        <Select value={row.type} onValueChange={(value) => onRowChange(row.id, 'type', value)}>
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
          onChange={(e) => handleAreaChange('areaAnterior', e.target.value)}
          disabled={row.type !== 'Acréscimo'}
          placeholder="0,000"
          className="text-right"
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={row.areaAtual}
          onChange={(e) => handleAreaChange('areaAtual', e.target.value)}
          placeholder="0,000"
          className="text-right"
        />
      </TableCell>
      <TableCell className="font-semibold text-lg text-right">{formatCurrency(row.valorCalculado)}</TableCell>
      <TableCell className="text-right">
        <TooltipProvider>
          <div className="flex justify-end items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={() => onDuplicateRow(row.id)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                    <Layers className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicar linha</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={() => handleCopyValue(row.valorCalculado || 0)} className="text-accent hover:text-accent-foreground hover:bg-accent/90">
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar valor</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={() => onRemoveRow(row.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90" disabled={isRemoveDisabled}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remover linha</p>
                </TooltipContent>
              </Tooltip>
          </div>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
});

CalculatorRow.displayName = 'CalculatorRow';
