"use client";

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PrintData } from '@/lib/types';
import { formatCurrency, formatArea } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { ConstrufacilIcon } from './ConstrufacilIcon';

export function PrintContent() {
    const searchParams = useSearchParams();
    const dataString = searchParams.get('data');

    const data: PrintData | null = useMemo(() => {
        if (!dataString) return null;
        try {
            return JSON.parse(dataString);
        } catch (error) {
            console.error("Falha ao analisar dados de impressão:", error);
            return null;
        }
    }, [dataString]);

    if (!data) {
        return (
            <div className="print-container">
                <div className="error-card">
                    <h2 className="text-xl font-bold mb-2">Erro ao Carregar Dados</h2>
                    <p>Não foi possível carregar os dados para impressão. Por favor, feche esta aba e tente novamente a partir da calculadora.</p>
                </div>
            </div>
        );
    }
    
    const cubValue = parseFloat(data.cub.replace(',', '.')) || 0;

    return (
        <>
            <div className="print-actions">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
            </div>

            <div className="print-page">
                <main className="print-main">
                    <div className="calculation-section">
                        <h3 className="section-title">Memória de Cálculo</h3>
                        {data.rows.map((item, index) => {
                             const formula = item.type === "Construção Nova"
                             ? `${formatArea(item.areaAtual)} m² × ${formatCurrency(cubValue, false)}`
                             : `(${formatArea(item.areaAtual)} m² - ${formatArea(item.areaAnterior)} m²) × ${formatCurrency(cubValue, false)}`;

                            return (
                                <div key={item.id} className="calculation-group">
                                    <div className="info-item">
                                        <span className='font-semibold'>Item {index + 1}: {item.numeroConstrucao || 'Sem identificação'}</span>
                                        <span className="font-bold text-lg">{formatCurrency(item.valorCalculado)}</span>
                                    </div>
                                    <div className="info-item-details">
                                        <span>{item.type}</span>
                                        <span className='text-sm text-gray-600'>{formula}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="notes-section">
                        <p className="important-note">
                            Esta memória de cálculo não possui valor legal.
                        </p>
                        <p className="secondary-note">
                            Trata-se apenas de uma ferramenta de auxílio na elaboração de contas. Verifique se o valor do CUB corresponde ao mês vigente.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
