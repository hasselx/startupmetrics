import { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const quotes = [
  {
    text: "The way to get started is to quit talking and start doing.",
    author: "Walt Disney"
  },
  {
    text: "Your most unhappy customers are your greatest source of learning.",
    author: "Bill Gates"
  },
  {
    text: "Content is king, but distribution is God.",
    author: "Mukesh Ambani"
  },
  {
    text: "Business success rests on the 5Ts: TAM sets the potential, Team drives the mission, Timing ignites the start, Traction fuels the growth, and Technology powers the future.",
    author: "Anupam Mittal"
  },
  {
    text: "Chase the vision, not the money; the money will end up following you.",
    author: "Tony Hsieh"
  },
  {
    text: "Ideas are easy. Implementation is hard.",
    author: "Guy Kawasaki"
  }
];

const QuotesCarousel = () => {
  const [plugin] = useState(() =>
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin]}
        className="w-full"
      >
        <CarouselContent>
          {quotes.map((quote, index) => (
            <CarouselItem key={index}>
              <div className="bg-gradient-to-br from-primary/5 to-accent/30 rounded-2xl p-6 md:p-8 border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-base md:text-lg leading-relaxed mb-3 italic">
                      "{quote.text}"
                    </p>
                    <p className="text-sm font-medium text-primary">
                      — {quote.author}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {quotes.map((_, index) => (
          <div
            key={index}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"
          />
        ))}
      </div>
    </div>
  );
};

export default QuotesCarousel;
