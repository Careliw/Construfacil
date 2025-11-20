"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function AjudaPage() {
  return (
    <>
      <style jsx global>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .dashboard-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .card-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          display: block;
          margin-bottom: 0.5rem;
        }
        .card-wide {
           grid-column: 1 / -1;
        }
        .dashboard-card-content h3 {
            font-size: 2.25rem;
            font-weight: 700;
            line-height: 1.1;
            color: hsl(var(--primary));
        }
         .dashboard-card-content p {
            font-size: 0.9rem;
            color: hsl(var(--muted-foreground));
         }
         .dashboard-card-content ul {
            list-style: none;
            padding: 0;
         }
         .dashboard-card-content ul li {
            padding: 0.25rem 0;
            font-size: 0.95rem;
            color: hsl(var(--foreground));
            display: flex;
            align-items: center;
         }
         .dashboard-card-content ul li::before {
            content: '✔';
            color: hsl(var(--primary));
            margin-right: 0.5rem;
            font-weight: bold;
         }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-headline">Central de Ajuda</h1>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a Calculadora
            </Link>
          </Button>
        </header>

        <section id="ajuda-dashboard" className="py-4">
            <h2 className="text-2xl font-semibold mb-6">Demonstração do Dashboard</h2>

            <div className="dashboard-grid">
                <Card>
                    <CardContent className="pt-6 dashboard-card-content">
                        <span className="card-label">→ (1) Valor do CUB</span>
                        <h3>R$ 2.580,40</h3>
                        <p>Valor base para cálculos</p>
                    </CardContent>
                </Card>

                <Card>
                     <CardContent className="pt-6 dashboard-card-content">
                        <span className="card-label">→ (2) Total Calculado</span>
                        <h3>R$ 245.138,00</h3>
                        <p>Soma de todas as averbações</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 dashboard-card-content">
                        <span className="card-label">→ (3) Linhas Adicionadas</span>
                        <h3>5</h3>
                        <p>Total de obras na tabela</p>
                    </CardContent>
                </Card>

                <Card className="card-wide">
                    <CardContent className="pt-6 dashboard-card-content">
                        <span className="card-label">→ (4) Detalhes da Averbação</span>
                        <p className="text-sm text-muted-foreground mb-4">Abaixo uma simulação da tabela de cálculo, onde cada linha representa uma obra.</p>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Área Anterior</TableHead>
                                <TableHead>Área Atual</TableHead>
                                <TableHead>Valor Calculado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Acréscimo</TableCell>
                                    <TableCell>120,00 m²</TableCell>
                                    <TableCell>155,50 m²</TableCell>
                                    <TableCell>R$ 91.604,20</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Construção Nova</TableCell>
                                    <TableCell>0,00 m²</TableCell>
                                    <TableCell>60,00 m²</TableCell>
                                    <TableCell>R$ 154.824,00</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </section>

      </div>
    </>
  );
}