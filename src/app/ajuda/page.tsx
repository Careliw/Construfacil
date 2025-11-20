"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const markersData = [
  { id: 'p1', top: '16%', left: '30%', number: 1, title: '1. Valor do CUB', content: 'Informe o valor atual do CUB referente ao mês vigente. Esse valor será usado para calcular automaticamente todas as averbações.' },
  { id: 'p2', top: '16%', left: '55%', number: 2, title: '2. Salvar CUB', content: 'Após digitar o valor do CUB, clique em Salvar. Os cálculos das averbações só serão executados com o CUB salvo.' },
  { id: 'p3', top: '35%', left: '25%', number: 3, title: '3. Adicionar Linha', content: 'Adiciona uma nova averbação (linha). Cada linha representa uma obra ou alteração distinta.' },
  { id: 'p4', top: '35%', left: '43%', number: 4, title: '4. Limpar Tudo', content: 'Remove todas as linhas de averbação adicionadas. Use com cuidado.' },
  { id: 'p5', top: '60%', left: '5%', number: 5, title: '5. Tipo da Averbação', content: 'Selecione o tipo. "Acréscimo" habilitará o campo "Área Anterior".' },
  { id: 'p6', top: '60%', left: '25%', number: 6, title: '6. Área Anterior', content: 'Se o tipo for "Acréscimo", informe a área que a construção já possuía.' },
  { id: 'p7', top: '60%', left: '40%', number: 7, title: '7. Área Atual', content: 'Preencha a área total atual da construção. Este campo é obrigatório.' },
  { id: 'p8', top: '60%', left: '58%', number: 8, title: '8. Valor Calculado', content: 'O valor é calculado automaticamente com a fórmula: (Área Atual - Área Anterior) × CUB.' },
  { id: 'p9', top: '60%', right: '5%', left: 'auto', number: 9, title: '9. Ações da Linha', content: 'Copie o valor individual ou remova a linha da tabela.' },
];


export default function AjudaPage() {
  const helpImage = PlaceHolderImages.find(img => img.id === 'ajuda-dashboard');
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const helpWrapRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const markerRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

  const togglePanel = (id: string) => {
    setOpenPanel(prev => (prev === id ? null : id));
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpWrapRef.current && !helpWrapRef.current.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .help-wrap {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .marker-btn {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 6px 14px hsla(var(--primary), 0.3);
          border: 3px solid rgba(255,255,255,0.7);
          transform: translate(-50%, -50%);
          transition: transform 160ms ease, box-shadow 160ms ease;
          z-index: 20;
        }
        .marker-btn:hover {
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 8px 18px hsla(var(--primary), 0.4);
        }
        .marker-arrow {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid hsl(var(--primary));
            filter: drop-shadow(0 3px 2px rgba(0,0,0,0.1));
            opacity: 0.8;
        }
        .help-panel {
          position: absolute;
          min-width: 240px;
          max-width: 280px;
          background: hsl(var(--card));
          border-radius: 8px;
          padding: 14px 16px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border: 1px solid hsl(var(--border));
          z-index: 10;
          transition: opacity 220ms ease, transform 220ms ease, visibility 220ms ease;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px) scale(0.97);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .help-panel.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .panel-title {
          font-weight: 600;
          margin-bottom: 6px;
          color: hsl(var(--foreground));
        }
         .panel-content {
          color: hsl(var(--muted-foreground));
        }
        .panel-content strong {
          font-weight: 600;
          color: hsl(var(--foreground));
        }
      `}</style>
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

        <div ref={helpWrapRef} className="help-wrap">
           {helpImage && (
            <Image
                src={helpImage.imageUrl}
                alt={helpImage.description}
                width={1200}
                height={750}
                className="rounded-lg shadow-md border"
                priority
                data-ai-hint={helpImage.imageHint}
            />
          )}

          {markersData.map(({ id, top, left, right, number, title, content }) => (
            <React.Fragment key={id}>
              <button
                ref={el => markerRefs.current[id] = el}
                className="marker-btn"
                onClick={() => togglePanel(id)}
                style={{ top, left: left ?? 'auto', right: right ?? 'auto' }}
              >
                {number}
              </button>
              <div
                ref={el => panelRefs.current[id] = el}
                className={`help-panel ${openPanel === id ? 'open' : ''}`}
                style={{ 
                    top: `calc(${top} + 25px)`, 
                    left: left ? `calc(${left})` : 'auto',
                    right: right ? `calc(${right} + 25px)`: 'auto',
                    transform: `translateX(-50%) translateY(15px) ${openPanel === id ? 'scale(1)' : 'scale(0.95)'}`,
                }}
              >
                <div className="panel-title">{title}</div>
                <div className="panel-content" dangerouslySetInnerHTML={{ __html: content.replace('(Área Atual - Área Anterior) × CUB', '<strong>(Área Atual - Área Anterior) × CUB</strong>') }} />

              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
