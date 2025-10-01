import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Database, Target, Sparkles, Shield } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Solutions",
    description: "Custom artificial intelligence models tailored to your business needs, from machine learning to deep learning applications.",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Forecast trends and make data-driven decisions with advanced statistical modeling and predictive algorithms.",
    color: "text-secondary",
  },
  {
    icon: Database,
    title: "Data Engineering",
    description: "Build robust data pipelines and infrastructure to collect, process, and store your data efficiently.",
    color: "text-accent",
  },
  {
    icon: Target,
    title: "Business Intelligence",
    description: "Transform raw data into actionable insights with interactive dashboards and comprehensive reporting solutions.",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    title: "AI Consulting",
    description: "Strategic guidance on implementing AI and data analytics to drive innovation and competitive advantage.",
    color: "text-secondary",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Ensure your data is protected with enterprise-grade security measures and compliance frameworks.",
    color: "text-accent",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive AI and data analytics solutions designed to accelerate your digital transformation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
