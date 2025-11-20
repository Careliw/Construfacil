"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      description: "Clique em 'Adicionar Linha' para cada obra que deseja calcular (uma construção nova, um acréscimo, etc.). Você pode adicionar quantas linhas precisar."
    },
    {
      title: "Passo 4: Preencha os Dados da Obra",
      description: "Para cada linha, selecione o 'Tipo' (Construção Nova ou Acréscimo) e preencha as áreas 'Anterior' e 'Atual' em metros quadrados (m²)."
    },
    {
      title: "Passo 5: Veja o Valor Calculado",
      description: (
        <span>
          O valor final para cada obra aparecerá automaticamente. As fórmulas são:
          <br />
          - <strong>Construção Nova:</strong> Área Atual × CUB
          <br />
          - <strong>Acréscimo:</strong> (Área Atual - Área Anterior) × CUB
        </span>
      ),
    },
    {
      title: "Passo 6: Utilize as Ações",
      description: "Use os botões de ação para 'Copiar' o valor calculado de uma linha ou para 'Excluir' a linha da tabela."
    },
    {
      title: "Passo 7: Imprimir o Cálculo",
      description: "Após preencher os dados, clique no botão 'Imprimir Cálculo' para gerar uma versão para impressão dos resultados."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Guia Rápido</h1>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Calculadora
          </Link>
        </Button>
      </header>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <Card key={index} className="bg-card border-2 border-border/70 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-base sm:text-lg font-bold">
                {index + 1}
              </div>
              <div className='pt-1'>
                <CardTitle className="text-lg md:text-xl">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground pl-12 sm:pl-14 text-sm md:text-base">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
