"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const helpSteps = [
  {
    value: 'item-1',
    number: 1,
    text: 'Primeiro, insira o valor atualizado do CUB e clique em "Salvar CUB". Este valor é essencial para todos os cálculos.',
    position: 'top-[22%] left-[30%]',
  },
  {
    value: 'item-2',
    number: 2,
    text: 'Use os botões para "Adicionar Linha" para cada averbação ou "Limpar Tudo" para recomeçar.',
    position: 'top-[42%] left-[10%]',
  },
  {
    value: 'item-3',
    number: 3,
    text: 'Para cada linha, selecione o "Tipo" de averbação. Se for "Acréscimo", o campo "Área Anterior" será habilitado.',
    position: 'top-[75%] left-[5%]',
  },
  {
    value: 'item-4',
    number: 4,
    text: 'Preencha as áreas. O "Valor Calculado" aparecerá automaticamente.',
    position: 'top-[75%] left-[50%]',
  },
  {
    value: 'item-5',
    number: 5,
    text: 'O valor final é exibido aqui. Use os botões de ação para copiar o valor de uma linha ou para removê-la.',
    position: 'top-[75%] right-[12%]',
  },
];

const Step = ({ number, text, value, position }: { number: number; text: string; value: string; position: string; }) => (
  <div className={`absolute ${position} w-52 transform`}>
      <AccordionItem value={value} className="border-none">
          <AccordionTrigger>
               <div className="relative flex items-start gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg">
                      {number}
                  </div>
              </div>
          </AccordionTrigger>
          <AccordionContent>
              <div className="p-3 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-primary/20">
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
                        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-inner border">
                            {helpImage && (
                                <Image
                                    src={helpImage.imageUrl}
                                    alt={helpImage.description}
                                    fill
                                    className="object-cover object-top"
                                    data-ai-hint={helpImage.imageHint}
                                    priority
                                />
                            )}
                            <div className="absolute inset-0 bg-black/5">
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