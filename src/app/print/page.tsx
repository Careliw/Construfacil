"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PrintData } from '@/lib/types';
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
                {data.rows.filter(row => (row.valorCalculado ?? 0) > 0).map(row => (
                    <div key={row.id} className="card calculation-card">
                        <div className="card-header">
                            <h3 className="card-title">Averbação — Construção Nº: {row.numeroConstrucao || 'Não informado'}</h3>
                        </div>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="label">Tipo de Averbação</span>
                                <span className="value">{row.type}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Área Anterior</span>
                                <span className="value">{row.areaAnterior || '0,00'} m²</span>
                            </div>
                             <div className="detail-item">
                                <span className="label">Área Atual</span>
                                <span className="value">{row.areaAtual} m²</span>
                            </div>
                        </div>
                        <div className="calculation-details">
                            <div className="detail-item">
                                <span className="label">CUB Aplicado</span>
                                <span className="value">R$ {data.cub}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Fórmula Aplicada</span>
                                <code className="value formula">
                                    {row.type === 'Construção Nova' 
                                        ? `Área Atual × CUB`
                                        : `(Área Atual - Área Anterior) × CUB`
                                    }
                                </code>
                            </div>
                            <div className="detail-item result">
                                <span className="label">Valor Calculado</span>
                                <span className="value"><strong>{row.valorCalculadoFmt}</strong></span>
                            </div>
                        </div>
                    </div>
                ))}
                
                <div className="card-note">
                    <h4 className="note-title">Observações Importantes</h4>
                    <ul className="note-list">
                        <li>O cálculo acima não possui valor legal. Trata-se apenas de uma ferramenta de auxílio na elaboração de contas.</li>
                        <li>Verifique se o valor do CUB está atualizado, correspondendo ao mês vigente.</li>
                    </ul>
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
