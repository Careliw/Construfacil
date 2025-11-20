"use client";

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PrintData } from '@/lib/types';
import { formatCurrency, formatArea } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

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

            <div className="print-container">
                <header>ConstruFacil — Confirmação de Cálculo</header>

                <div className="info-grid">
                  <div className="cub-info">
                      <strong>CUB Utilizado:</strong> {formatCurrency(cubValue)}
                  </div>
                </div>

                <table className="print-table">
                    <thead>
                        <tr>
                            <th className='col-construcao'>Nº da Construção</th>
                            <th className='col-tipo'>Tipo de Averbação</th>
                            <th className='col-area'>Área Anterior (m²)</th>
                            <th className='col-area'>Área Atual (m²)</th>
                            <th className="col-formula">Fórmula do Cálculo</th>
                            <th className='col-valor'>Valor (R$)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map(item => {
                            const formula = item.type === "Construção Nova"
                              ? `${formatArea(item.areaAtual)} × ${formatCurrency(cubValue, false)}`
                              : `(${formatArea(item.areaAtual)} - ${formatArea(item.areaAnterior)}) × ${formatCurrency(cubValue, false)}`;

                            return (
                                <tr key={item.id}>
                                    <td>{item.numeroConstrucao || '-'}</td>
                                    <td>{item.type}</td>
                                    <td className='text-right'>{formatArea(item.areaAnterior)}</td>
                                    <td className='text-right'>{formatArea(item.areaAtual)}</td>
                                    <td className="formula-col">{formula}</td>
                                    <td className='text-right font-semibold'>{formatCurrency(item.valorCalculado)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                <div className="card-note">
                    <h4 className="note-title">Observações Importantes</h4>
                    <ul className="note-list">
                        <li>Este cálculo não possui valor legal e serve apenas como uma ferramenta de auxílio.</li>
                        <li>Confira se o valor do CUB corresponde ao mês de conclusão da obra.</li>
                    </ul>
                </div>
                
                <footer className="print-footer">
                    <div className="w-full border-t border-border/50 max-w-xs mx-auto mb-4"></div>
                    <div>Desenvolvido por Wesley Careli · v1.1.0</div>
                    <div className="text-xs text-muted-foreground/80">Todos os direitos reservados.</div>
                </footer>
            </div>
        </>
    );
}
