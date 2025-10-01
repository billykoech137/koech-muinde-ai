import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";
import founder1 from "@/assets/founder-1.jpg";
import founder2 from "@/assets/founder-2.jpg";

const founders = [
  {
    name: "Billy Koech",
    role: "Co-Founder & CEO",
    image: founder1,
    bio: "Visionary leader with extensive experience in AI strategy and business development. Billy has led numerous successful AI transformation projects across various industries.",
    linkedin: "#",
    email: "billy@aianalytics.com",
  },
  {
    name: "John Muinde",
    role: "Co-Founder & CTO",
    image: founder2,
    bio: "Technical innovator specializing in machine learning and data engineering. John brings deep expertise in building scalable AI solutions and data infrastructure.",
    linkedin: "#",
    email: "john@aianalytics.com",
  },
];

const Founders = () => {
  return (
    <section id="founders" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Founders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Led by experienced professionals passionate about AI and data innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {founders.map((founder, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-1">{founder.name}</h3>
                <p className="text-primary font-medium mb-4">{founder.role}</p>
                <p className="text-muted-foreground mb-6">{founder.bio}</p>
                <div className="flex gap-4">
                  <a
                    href={founder.linkedin}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:${founder.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Founders;
