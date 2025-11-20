"use client";

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PrintData } from '@/lib/types';
import { formatCurrency, formatArea } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Building, Printer } from 'lucide-react';

export function PrintContent() {
    const searchParams = useSearchParams();
    const dataString = searchParams.get('data');
    const currentDate = new Date().toLocaleDateString('pt-BR');

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
    const totalGeral = data.rows.reduce((acc, row) => acc + (row.valorCalculado || 0), 0);

    return (
        <>
            <div className="print-actions">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
            </div>

            <div className="print-page">
                <header className="print-header">
                    <div className="logo-title">
                        <Building className="logo-icon" />
                        <div className="title-group">
                            <h1 className="main-title">ConstruFacil</h1>
                            <h2 className="subtitle">Calculadora de Averbação</h2>
                        </div>
                    </div>
                    <div className="report-title">
                        <h3>Memória de Cálculo</h3>
                    </div>
                </header>

                <main className="print-main">
                    <div className="info-item">
                        <span>CUB (Custo Unitário Básico) utilizado:</span>
                        <span>{formatCurrency(cubValue)}</span>
                    </div>
                    
                    <div className="separator-full"></div>

                    {data.rows.map((item, index) => {
                         const formula = item.type === "Construção Nova"
                         ? `${formatArea(item.areaAtual)} m² × ${formatCurrency(cubValue)}`
                         : `(${formatArea(item.areaAtual)} m² - ${formatArea(item.areaAnterior)} m²) × ${formatCurrency(cubValue)}`;

                        return (
                            <div key={item.id} className="calculation-group">
                                <div className="info-item">
                                    <span className='font-semibold'>Item {index + 1}: {item.numeroConstrucao || 'Sem identificação'}</span>
                                </div>
                                <div className="info-item">
                                    <span>Tipo de averbação:</span>
                                    <span>{item.type}</span>
                                </div>
                                {item.type === 'Acréscimo' && (
                                    <div className="info-item">
                                        <span>Área anterior:</span>
                                        <span>{formatArea(item.areaAnterior)} m²</span>
                                    </div>
                                )}
                                <div className="info-item">
                                    <span>Área atual:</span>
                                    <span>{formatArea(item.areaAtual)} m²</span>
                                </div>
                                <div className="info-item">
                                    <span>Fórmula do cálculo:</span>
                                    <span className='text-sm text-gray-600'>{formula}</span>
                                </div>

                                <div className="separator-partial"></div>

                                <div className="info-item result-item">
                                    <span>Valor do item:</span>
                                    <span className="font-bold">{formatCurrency(item.valorCalculado)}</span>
                                </div>
                                {index < data.rows.length - 1 && <div className="separator-full-dashed"></div>}
                            </div>
                        );
                    })}

                    <div className="separator-full"></div>

                    <div className="total-section">
                        <div className="info-item total-item">
                            <span>Total Geral:</span>
                            <span className="font-bold text-lg">{formatCurrency(totalGeral)}</span>
                        </div>
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

                <footer className="print-footer">
                    <span>Calculado em: {currentDate}</span>
                </footer>
            </div>
        </>
    );
}