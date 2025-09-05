import { Statistics } from "@/components/landing/Statistics";
import pilot from "@/assets/pilot.png";
import "@/styles/landing.css";


export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Us
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Qveda is an AI-powered quantum circuit assistant that turns raw quantum data into clear, structured insights. It bridges the gap between complex statevectors, entanglement metrics, and human understanding with concise summaries and analysis. By detecting algorithmic patterns, estimating complexity, and highlighting potential applications, Qveda helps developers quickly grasp what their circuits are really doing. In short, it makes quantum computing more intuitive, accessible, and efficient.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
