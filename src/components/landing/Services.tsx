import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "@/components/landing/Icons";
import cubeleg from "@/assets/cubeleg.png";
import "@/styles/landing.css";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Quantum Research",
    description:
      "End-to-end execution of circuits with statevector, QASM, and entanglement analysis.",
    icon: <ChartIcon />,
  },
  {
    title: "Quantum Circuit Design",
    description:
      "Design and optimize quantum circuits with user-friendly tools and templates.",
    icon: <WalletIcon />,
  },
  {
    title: "AI Integration",
    description:
      "Integrates advanced AI algorithms for enhanced circuit optimization and analysis.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Pioneering{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Helping India to Accelerate in Quantum Computing Research and
            Development and become a Global Leader in this Emerging Field.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={cubeleg}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
