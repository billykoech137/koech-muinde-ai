import { CheckCircle2 } from "lucide-react";

const About = () => {
  const values = [
    "Innovation-driven approach to problem solving",
    "Data security and privacy as top priorities",
    "Transparent communication throughout projects",
    "Scalable solutions that grow with your business",
  ];

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pioneering the Future of{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI & Analytics
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              We are a forward-thinking AI and data analytics startup dedicated to helping businesses harness the power
              of their data. Our mission is to democratize access to advanced analytics and artificial intelligence,
              making these transformative technologies accessible to organizations of all sizes.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              With deep expertise in machine learning, data science, and business intelligence, we partner with our
              clients to deliver tailored solutions that drive measurable results and sustainable growth.
            </p>

            <div className="space-y-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8">
              <div className="w-full h-full rounded-xl bg-card border border-border flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-xl font-semibold">Client Success Rate</div>
                  <p className="text-muted-foreground">
                    We're committed to delivering exceptional results on every project
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
