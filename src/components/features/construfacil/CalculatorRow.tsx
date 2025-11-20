"use client";

import React, { memo } from 'react';
import type { AverbacaoRow } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Copy, Layers } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CalculatorRowProps {
  row: AverbacaoRow;
  onRowChange: (id: string, field: keyof Omit<AverbacaoRow, 'id' | 'valorCalculado'>, value: string) => void;
  onRemoveRow: (id: string) => void;
  onDuplicateRow: (id: string) => void;
  isRemoveDisabled: boolean;
}

const sanitizeAreaInput = (value: string) => {
    let clean = value.replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    const match = clean.match(/^(\d{0,5})(,(\d{0,3}))?/);
    return match ? match[0] : '';
};
  
const sanitizeNumeroConstrucao = (value: string) => {
    return value.replace(/[^A-Za-z0-9\/-]/g, '');
};

const formatCurrency = (value: number = 0) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const CalculatorRow: React.FC<CalculatorRowProps> = memo(({ row, onRowChange, onRemoveRow, onDuplicateRow, isRemoveDisabled }) => {
  const { toast } = useToast();

  const handleCopyValue = (value: number) => {
    navigator.clipboard.writeText(value.toFixed(2));
    toast({ title: "Copiado!", description: `${formatCurrency(value)} copiado para a área de transferência.` });
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Input
          type="text"
          value={row.numeroConstrucao}
          onChange={(e) => onRowChange(row.id, 'numeroConstrucao', sanitizeNumeroConstrucao(e.target.value))}
          placeholder="Ex: 12-A"
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
          onChange={(e) => onRowChange(row.id, 'areaAnterior', sanitizeAreaInput(e.target.value))}
          disabled={row.type !== 'Acréscimo'}
          placeholder="0,000"
          maxLength={9}
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={row.areaAtual}
          onChange={(e) => onRowChange(row.id, 'areaAtual', sanitizeAreaInput(e.target.value))}
          placeholder="0,000"
          maxLength={9}
        />
      </TableCell>
      <TableCell className="font-semibold text-lg">{formatCurrency(row.valorCalculado)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => onDuplicateRow(row.id)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100" title="Duplicar linha abaixo">
            <Layers className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleCopyValue(row.valorCalculado || 0)} className="text-accent hover:text-accent-foreground hover:bg-accent/90" title="Copiar valor">
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onRemoveRow(row.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90" title="Remover linha" disabled={isRemoveDisabled}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

CalculatorRow.displayName = 'CalculatorRow';
