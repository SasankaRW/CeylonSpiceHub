
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Target, Leaf, Heart, Globe, Users, Award, ShieldCheck, MapPin, Building, Calendar } from 'lucide-react';

const WeArePage = () => {
  return (
    <div className="space-y-20 pb-12">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Badge variant="outline" className="px-4 py-1 text-base">Authentic Taste of Nature</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-primary">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto italic">
          "Founded on 30th September 2022, The Ceylon Spice Hub (Pvt) Ltd is the realization of a dream that harmonizes tradition, sustainability, and flavor."
        </p>
      </motion.div>

      {/* STORY SECTION */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src="https://res.cloudinary.com/dwuxumj4x/image/upload/v1769840183/PAGE_4_s7p5ko.jpg"
            alt="Pasgoda Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
        >
          <p>
            Our 10-acre <span className="text-foreground font-semibold">Pasgoda Farm</span>, along with over 10 partner farms, stands as a living testament to eco-friendly agriculture. Every product is nurtured naturally by rain, wind, sunshine, and pure spring water, preserving the authenticity of Sri Lanka’s rich agricultural heritage.
          </p>
          <p>
            From whole spices to spice blends, pickles, jams, sauces, and wines, every product is handcrafted with care, ensuring natural color, nutrients, and taste remain untouched.
          </p>
        </motion.div>
      </section>

      {/* VISION & MISSION */}
      <section className="grid md:grid-cols-2 gap-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 space-y-4">
            <div className="bg-background p-3 w-fit rounded-full shadow-sm mb-2">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Vision</h2>
            <p className="text-muted-foreground text-lg">
              To be a market leader in people- and planet-friendly food products, where every bite nurtures wellness, sustains the earth, and brings authentic Sri Lankan flavors to the world.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="p-8 space-y-4">
            <div className="bg-background p-3 w-fit rounded-full shadow-sm mb-2">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Mission</h2>
            <p className="text-muted-foreground text-lg">
              To craft and deliver healthy, nutritious, and 100% natural food and spice products, grown through sustainable practices, empowered by rural communities, and rooted in generations of tradition, so our customers can taste the true goodness of nature in every bite.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CORE VALUES - SPICEHUB ACRONYM */}
      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-2"
        >
          <h2 className="text-3xl font-bold">
            Core Values – <span className="text-primary">WE ARE SPICEHUB</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each letter of our name represents a fundamental value that drives everything we do
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* SPICE Column */}
          <div className="space-y-3">
            {[
              {
                letter: "S",
                title: "Socially and environmentally sustainable",
                icon: Globe
              },
              {
                letter: "P",
                title: "Passionate about healthy, nutritious products",
                icon: Heart
              },
              {
                letter: "I",
                title: "Integrity in all we do",
                icon: ShieldCheck
              },
              {
                letter: "C",
                title: "Customer-centric and taste-driven",
                icon: Users
              },
              {
                letter: "E",
                title: "Empowering rural women",
                icon: Award
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-300">
                  {/* Letter Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-300">
                      <span className="text-2xl font-bold text-primary">
                        {item.letter}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* HUB Column */}
          <div className="space-y-3">
            {[
              {
                letter: "H",
                title: "Home-garden-based supply chains",
                icon: Leaf
              },
              {
                letter: "U",
                title: "Unique generational methods",
                icon: Leaf
              },
              {
                letter: "B",
                title: "Bountiful wellness in every bite",
                icon: Heart
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-300">
                  {/* Letter Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-300">
                      <span className="text-2xl font-bold text-primary">
                        {item.letter}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center pt-2"
        >
          <p className="text-base font-serif italic text-muted-foreground">
            "Eight values, one mission: <span className="text-primary font-semibold">bringing authentic Sri Lankan flavors to the world</span>"
          </p>
        </motion.div>
      </section>


    </div>
  );
};

export default WeArePage;
