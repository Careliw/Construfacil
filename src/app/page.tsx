import { Calculator } from '@/components/features/construfacil/Calculator';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-full">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Calculator />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90">
              <Link href="/ajuda">
                <HelpCircle className="h-7 w-7" />
                <span className="sr-only">Página de Ajuda</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Página de Ajuda</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
