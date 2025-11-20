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
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Calculator />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="icon" className="fixed bottom-4 right-4 h-12 w-12 md:bottom-6 md:right-6 md:h-14 md:w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90">
              <Link href="/ajuda">
                <HelpCircle className="h-6 w-6 md:h-7 md:w-7" />
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
