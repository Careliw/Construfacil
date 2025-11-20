"use client";

import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AjudaPage() {
  const steps = [
    {
      title: "Passo 1: Insira o Valor do CUB",
      description: "No primeiro campo da calculadora, digite o valor do CUB (Custo Unitário Básico) para o mês atual. Este valor é a base para todos os cálculos."
    },
    {
      title: "Passo 2: Salve o CUB",
      description: "Clique no botão 'Salvar CUB'. O valor ficará guardado no seu navegador, e a calculadora usará esse número para os cálculos automáticos das obras."
    },
    {
      title: "Passo 3: Adicione Linhas de Averbação",
      description: "Clique em 'Adicionar Linha' para cada obra que deseja calcular (uma construção nova, um acréscimo, etc.)."
    },
    {
      title: "Passo 4: Preencha os Dados da Obra",
      description: "Para cada linha, selecione o 'Tipo' (Construção Nova ou Acréscimo) e preencha as áreas 'Anterior' e 'Atual' em metros quadrados (m²)."
    },
    {
      title: "Passo 5: Veja o Valor Calculado",
      description: "O valor final para cada obra aparecerá automaticamente na coluna 'Valor Calculado', baseado na fórmula: (Área Atual - Área Anterior) × CUB."
    },
    {
      title: "Passo 6: Utilize as Ações",
      description: "Use os botões de ação para 'Copiar' o valor calculado ou para 'Excluir' uma linha da tabela."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Guia Rápido</h1>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Calculadora
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Como usar a Calculadora de Averbação</CardTitle>
          <CardDescription>Siga os passos abaixo para realizar seus cálculos de forma simples e correta.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && <div className="mt-2 w-px flex-grow bg-border" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
