import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import "@/styles/landing.css";

interface TeamProps {
  name: string;
  position: string;
  socialNetworks: SociaNetworkslProps[];
}

interface SociaNetworkslProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    name: "Naman Sachdeva",
    position: "AI&ML and Backend Developer",
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/namansachdeva21/",
      },
      // {
      //   name: "Mail",
      //   url: "mailto:nsachdeva300@gmail.com",
      // },
      // {
      //   name: "Instagram",
      //   url: "https://www.instagram.com/",
      // },
    ],
  },
  {
    name: "Priyanshi.",
    position: "Frontend Developer",
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/priyansshi-i/",
      },
      // {
      //   name: "Facebook",
      //   url: "https://www.facebook.com/",
      // },
      // {
      //   name: "Instagram",
      //   url: "https://www.instagram.com/",
      // },
    ],
  },
  {
    name: "Stuti Kanugo",
    position: "Frontend Developer",
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/stuti-kanugo/",
      },

      // {
      //   name: "Instagram",
      //   url: "https://www.instagram.com/",
      // },
    ],
  },
  // {
  //   imageUrl: "https://i.pravatar.cc/150?img=17",
  //   name: "Bruce Rogers",
  //   position: "Backend Developer",
  //   socialNetworks: [
  //     {
  //       name: "Linkedin",
  //       url: "https://www.linkedin.com/in/leopoldo-miranda/",
  //     },
  //     {
  //       name: "Facebook",
  //       url: "https://www.facebook.com/",
  //     },
  //   ],
  // },
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;

      case "Facebook":
        return <Facebook size="20" />;

      case "Instagram":
        return <Instagram size="20" />;
    }
  };

  return (
    <section
      id="team"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Our Dedicated{" "}
        </span>
        Team
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        Meet the passionate individuals behind our success, driving innovation
        and excellence.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamList.map(
          ({ name, position, socialNetworks }: TeamProps) => (
            <Card
              key={name}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <CardTitle className="text-center">{name}</CardTitle>
                <CardDescription className="text-primary">
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p>Passionate builder and AI and Quantum Enthusiast</p>
              </CardContent>

              <CardFooter>
                {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                  <div key={name}>
                    <a
                      rel="noreferrer noopener"
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{name} icon</span>
                      {socialIcon(name)}
                    </a>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
