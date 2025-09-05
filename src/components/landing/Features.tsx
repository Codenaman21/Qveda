import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import growth from "@/assets/growth.png";
import reflecting from "@/assets/reflecting.png";
import lookingahead from "@/assets/lookingahead.png";
import "@/styles/landing.css";


interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "Advanced analytics",
    description:
      "Runs statevector and QASM simulations with resource estimation.Provides fidelity, entropy, and coherence insights for deeper evaluation",
    image: lookingahead,
  },
  {
    title: "Practical Applications",
    description:
      "Maps your circuit to potential real-world use cases. Highlights where your design fits in quantum algorithms and industries.",
    image: reflecting,
  },
  {
    title: "AI-Powered insights",
    description:
      "Generates concise summaries and insights from raw quantum circuit data. Helps you understand algorithms, entanglement, and complexity instantly.",
    image: growth,
  },
];

const featureList: string[] = [
  "Dark/Light theme",
  "Reviews",
  "Features",
  "Pricing",
  "Contact form",
  "Our team",
  "Responsive design",
  "Newsletter",
  "Minimalist",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
