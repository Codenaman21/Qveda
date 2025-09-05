import { Link } from "react-router-dom";  
import { Button } from '@/components/ui/button';
import "@/styles/landing.css";

//import { buttonVariants } from "./ui/button";
//import { HeroCards } from "./HeroCards";
//import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Hero = () => {
  return (
    <section className="container flex flex-col items-center justify-center min-h-screen py-20 md:py-32 gap-10">
      <div className="text-center max-w-4xl space-y-8">
        <main className="text-5xl md:text-6xl lg:text-7xl font-bold">
          <h1 className="mb-4">
            Quantum Workflow
            <span className="block mt-2 bg-gradient-to-r from-[#92AD2D] via-[#77FF41] to-[#D6FF41] text-transparent bg-clip-text">
              Reimagined
            </span>
          </h1>
        </main>

        <p className="text-xl md:text-2xl text-gray-300 mx-auto max-w-2xl leading-relaxed">
          Accelerate quantum research with Qveda's intuitive workflow platform designed for researchers and developers.
        </p>

        <div className="pt-6 space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center items-center">
          <Link to="/simulate">
            <Button className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-[#92AD2D] to-[#77FF41] hover:from-[#D6FF41] hover:to-[#6D28D9]">
              Launch Qveda
            </Button>
          </Link>

          {/* <a
            rel="noreferrer noopener"
            href="https://github.com/leoMirandaa/shadcn-landing-page.git"
            target="_blank"
            className={`w-full md:w-auto px-8 py-6 text-lg ${buttonVariants({
              variant: "outline",
            })}`}
          >
            View Documentation
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a> */}
        </div>
      </div>

      {/* Quantum visualization placeholder */}
      {/* <div className="relative mt-12 w-full max-w-5xl h-64 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="relative z-10 text-center p-8">
          <div className="flex justify-center items-center space-x-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-70 animate-pulse" 
                style={{animationDelay: `${i * 0.2}s`}}
              ></div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Visualizing quantum circuit workflows</p>
        </div>
      </div> */}

      {/* Shadow effect */}
      {/* <div className="shadow"></div> */}

      <style>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </section>
  );
};