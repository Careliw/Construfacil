"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowDown, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const helpSteps = [
  {
    value: 'item-1',
    number: 1,
    text: 'Primeiro, insira o valor atualizado do CUB. Este valor é a base para todos os cálculos.',
    position: 'top-[16%] left-[30%]',
    arrow: <ArrowDown className="h-6 w-6 text-primary" />,
    arrowPosition: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  },
  {
    value: 'item-2',
    number: 2,
    text: 'Clique aqui para salvar o valor do CUB no seu navegador, para que ele seja lembrado em futuros acessos.',
    position: 'top-[16%] left-[55%]',
    arrow: <ArrowDown className="h-6 w-6 text-primary" />,
    arrowPosition: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  },
  {
      value: 'item-3',
      number: 3,
      text: 'Use este botão para adicionar uma nova linha à tabela para cada averbação que precisar calcular.',
      position: 'top-[35%] left-[25%]',
      arrow: <ArrowDown className="h-6 w-6 text-primary" />,
      arrowPosition: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  },
  {
      value: 'item-4',
      number: 4,
      text: 'Para recomeçar, clique aqui para remover todas as linhas da tabela de uma só vez.',
      position: 'top-[35%] left-[43%]',
      arrow: <ArrowDown className="h-6 w-6 text-primary" />,
      arrowPosition: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  },
  {
    value: 'item-5',
    number: 5,
    text: 'Selecione o tipo de averbação. "Acréscimo" habilitará o campo "Área Anterior".',
    position: 'top-[60%] left-[5%]',
    arrow: <ArrowRight className="h-6 w-6 text-primary" />,
    arrowPosition: 'left-full top-1/2 -translate-y-1/2 ml-1',
  },
  {
      value: 'item-6',
      number: 6,
      text: 'Se o tipo for "Acréscimo", informe a área que a construção já possuía antes da nova averbação.',
      position: 'top-[60%] left-[25%]',
      arrow: <ArrowRight className="h-6 w-6 text-primary" />,
      arrowPosition: 'left-full top-1/2 -translate-y-1/2 ml-1',
  },
  {
      value: 'item-7',
      number: 7,
      text: 'Preencha a área total atual da construção. Este campo é obrigatório para o cálculo.',
      position: 'top-[60%] left-[40%]',
      arrow: <ArrowRight className="h-6 w-6 text-primary" />,
      arrowPosition: 'left-full top-1/2 -translate-y-1/2 ml-1',
  },
  {
    value: 'item-8',
    number: 8,
    text: 'O valor é calculado automaticamente. Fórmula: (Área Atual - Área Anterior) * CUB. Para "Construção Nova", a Área Anterior é 0.',
    position: 'top-[60%] left-[58%]',
    arrow: <ArrowLeftIcon className="h-6 w-6 text-primary" />,
    arrowPosition: 'right-full top-1/2 -translate-y-1/2 mr-1',
  },
  {
    value: 'item-9',
    number: 9,
    text: 'Use estes botões para copiar o valor individual da linha ou para remover a linha da tabela.',
    position: 'top-[60%] right-[5%]',
    arrow: <ArrowLeftIcon className="h-6 w-6 text-primary" />,
    arrowPosition: 'right-full top-1/2 -translate-y-1/2 mr-1',
  },
];

const Step = ({ number, text, value, position, arrow, arrowPosition }: { number: number; text: string; value: string; position: string; arrow: React.ReactNode; arrowPosition: string; }) => (
  <div className={`absolute ${position} w-52 transform flex flex-col items-center`}>
    <AccordionItem value={value} className="border-none w-auto">
      <AccordionTrigger hideChevron className="p-0 hover:no-underline justify-center">
        <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg cursor-pointer">
          {number}
          <div className={`absolute ${arrowPosition} opacity-80`}>
            {arrow}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="mt-2 p-3 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-primary/20 w-52">
          <p className="text-sm text-card-foreground">{text}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  </div>
);

export default function AjudaPage() {
    const helpImage = PlaceHolderImages.find(img => img.id === 'ajuda-dashboard');

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold font-headline">Página de Ajuda</h1>
                <Button asChild variant="outline">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para a Calculadora
                    </Link>
                </Button>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Guia Visual da Calculadora</CardTitle>
                    <CardDescription>Clique nos números para ver a explicação de cada passo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-inner border bg-muted/20">
                            {helpImage && (
                                <Image
                                    src={helpImage.imageUrl}
                                    alt={helpImage.description}
                                    fill
                                    className="object-contain"
                                    data-ai-hint={helpImage.imageHint}
                                    priority
                                />
                            )}
                            <div className="absolute inset-0">
                                {helpSteps.map(step => (
                                    <Step key={step.number} {...step} />
                                ))}
                            </div>
                        </div>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
