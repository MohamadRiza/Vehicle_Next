import CarCard from "@/components/Car-Card";
import HomeSearch from "@/components/Home-search";
import { Button } from "@/components/ui/button";
import { featuredCars } from "@/lib/data";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-20 flex flex-col">
      {/* HERO */}
      
      <section className="relative py-16 md:py-28 dotted-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-8xl mb-4 gradient-title">Find you dream car with vehicle AI</h1>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              Advanced AI Car Search and test Drive from thousend of vehicles
            </p>
          </div>
          {/* SEARCH */}
          <HomeSearch/>
        </div>
      </section>

      <section className="py-12">
        <div>
          <div>
            <h2>Feautured Cars</h2>
            <Button>View All <ChevronRight className="ml-1 h-4 w-4"/></Button>
          </div>
          
          <div>
            {featuredCars.map((car) => {
              return <CarCard key={car.id} car={car}/>
            })}
          </div>
        </div>
      </section>

    </div>
    
  );
}
