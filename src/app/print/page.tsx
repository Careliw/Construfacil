"use client";

import React, { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PrintData } from '@/lib/types';
import './print.css';

function PrintContent() {
    const searchParams = useSearchParams();
    const dataString = searchParams.get('data');
    const printAreaRef = useRef<HTMLDivElement>(null);
    
    let data: PrintData | null = null;
    try {
        if (dataString) {
            data = JSON.parse(dataString);
        }
    } catch (error) {
        console.error("Failed to parse print data:", error);
    }

    useEffect(() => {
        if (data && printAreaRef.current) {
            const cubValueEl = document.getElementById("cubValue");
            if (cubValueEl) {
                cubValueEl.textContent = parseFloat(data.cub.replace(',', '.')).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
            }

            const tbody = document.getElementById("tabelaAverbacoes");
            if (tbody) {
                tbody.innerHTML = "";
                
                data.rows
                  .filter(row => (row.valorCalculado ?? 0) > 0)
                  .forEach(item => {
                    const tr = document.createElement("tr");

                    const cub = parseFloat(data.cub.replace(',', '.'));
                    const areaAnterior = parseFloat(item.areaAnterior.replace(',', '.')) || 0;
                    const areaAtual = parseFloat(item.areaAtual.replace(',', '.')) || 0;

                    const formula = item.type === "Construção Nova"
                      ? `${item.areaAtual} × ${cub.toLocaleString("pt-BR")}`
                      : `(${item.areaAtual} - ${item.areaAnterior}) × ${cub.toLocaleString("pt-BR")}`;
                    
                    const valor = item.valorCalculado || 0;

                    tr.innerHTML = `
                      <td>${item.numeroConstrucao}</td>
                      <td>${item.type}</td>
                      <td>${areaAnterior.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</td>
                      <td>${areaAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</td>
                      <td class="formula">${formula}</td>
                      <td><strong>R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></td>
                    `;

                    tbody.appendChild(tr);
                  });
            }
        }
    }, [data]);

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
        <>
            <button id="btnPrint" onClick={() => window.print()} className="print-button">
              🖨️ Imprimir Cálculo
            </button>

            <div className="print-container" id="printArea" ref={printAreaRef}>
                <header>ConstruFacil — Confirmação de Cálculo</header>

                <div className="cub-info">
                    <strong>CUB Utilizado:</strong> R$ <span id="cubValue"></span>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Construção Nº</th>
                            <th>Tipo de Averbação</th>
                            <th>Área Anterior (m²)</th>
                            <th>Área Atual (m²)</th>
                            <th>Fórmula</th>
                            <th>Valor (R$)</th>
                        </tr>
                    </thead>
                    <tbody id="tabelaAverbacoes"></tbody>
                </table>
                
                <div className="card-note">
                    <h4 className="note-title">Observações Importantes</h4>
                    <ul className="note-list">
                        <li>O cálculo acima não possui valor legal. Trata-se apenas de uma ferramenta de auxílio na elaboração de contas.</li>
                        <li>Verifique se o valor do CUB está atualizado, correspondendo ao mês vigente.</li>
                    </ul>
                </div>

                <footer>Desenvolvido por Wesley Careli</footer>
            </div>
        </>
    );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PrintContent />
    </Suspense>
  );
}
