"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PrintData } from '@/lib/types';
import { AlertCircle, Building, PlusSquare } from 'lucide-react';
import './print.css';

function PrintContent() {
    const searchParams = useSearchParams();
    const dataString = searchParams.get('data');
    
    let data: PrintData | null = null;
    try {
        if (dataString) {
            data = JSON.parse(dataString);
        }
    } catch (error) {
        console.error("Failed to parse print data:", error);
    }

    if (!data) {
        return (
            <div className="container">
                <div className="card error-card">
                    <h2 className="card-title">Erro ao Carregar Dados</h2>
                    <p>Não foi possível carregar os dados para impressão. Por favor, tente novamente a partir da calculadora.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container">
            <header className="header">
                <h1 className="title">ConstruFacil — Confirmação de Cálculo</h1>
            </header>

            <main>
                <div className="card summary-card">
                    <h2 className="card-title">Resumo do Cálculo</h2>
                    <div className="summary-grid">
                        <div>
                            <span>Valor do CUB Utilizado:</span>
                            <strong>R$ {data.cub}</strong>
                        </div>
                        <div className="total-value">
                            <span>Valor Total Calculado:</span>
                            <strong>{data.totalCalculadoFmt}</strong>
                        </div>
                    </div>
                </div>

                <div className="card details-card">
                    <h2 className="card-title">Detalhes das Averbações</h2>
                    {data.rows.filter(row => (row.valorCalculado ?? 0) > 0).map(row => (
                        <div key={row.id} className="detail-item">
                            <div className="item-header">
                                {row.type === 'Construção Nova' ? <Building className="icon"/> : <PlusSquare className="icon" />}
                                <h3>{row.type}</h3>
                            </div>
                            <div className="item-grid">
                                <div><span>Área Anterior:</span> {row.areaAnterior || '0,00'} m²</div>
                                <div><span>Área Atual:</span> {row.areaAtual} m²</div>
                                <div><span>Valor Calculado:</span> <strong>{row.valorCalculadoFmt}</strong></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card formula-card">
                    <h2 className="card-title">Fórmulas Aplicadas</h2>
                    <div className="formula-item">
                        <h4>Construção Nova</h4>
                        <p><code>Área Atual × Valor do CUB</code></p>
                    </div>
                    <div className="formula-item">
                        <h4>Acréscimo</h4>
                        <p><code>(Área Atual - Área Anterior) × Valor do CUB</code></p>
                    </div>
                </div>

                <div className="card-note">
                     <AlertCircle className="icon" />
                    <div>
                        <h4 className="note-title">Observações Importantes</h4>
                        <ul className="note-list">
                            <li>O cálculo acima não possui valor legal. Trata-se apenas de uma ferramenta de auxílio na elaboração de contas.</li>
                            <li>Verifique se o valor do CUB está atualizado, correspondendo ao mês vigente.</li>
                        </ul>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>Desenvolvido por Wesley Careli</p>
            </footer>
        </div>
    );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PrintContent />
    </Suspense>
  );
}
