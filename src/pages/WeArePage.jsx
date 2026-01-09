
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
            src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=1000&auto=format&fit=crop"
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
            <div className="bg-white p-3 w-fit rounded-full shadow-sm mb-2">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Vision</h2>
            <p className="text-muted-foreground text-lg">
              To be a market leader in people- and planet-friendly food products, where every bite nurtures wellness, sustains the earth, and brings authentic Sri Lankan flavors to the world.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="p-8 space-y-4">
            <div className="bg-white p-3 w-fit rounded-full shadow-sm mb-2">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Mission</h2>
            <p className="text-muted-foreground text-lg">
              To craft and deliver healthy, nutritious, and 100% natural food and spice products, grown through sustainable practices, empowered by rural communities, and rooted in generations of tradition, so our customers can taste the true goodness of nature in every bite.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CORE VALUES */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Core Values – WE ARE SPICE HUB</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { text: "Socially and environmentally sustainable", icon: Globe },
            { text: "Passionate about healthy, nutritious products", icon: Heart },
            { text: "Integrity in all we do", icon: ShieldCheck },
            { text: "Customer-centric and taste-driven", icon: Users },
            { text: "Empowering rural women", icon: Award },
            { text: "Home-garden-based supply chains", icon: Leaf },
            { text: "Unique generational methods", icon: Leaf },
            { text: "Bountiful wellness in every bite", icon: Heart },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3"
            >
              <item.icon className="h-8 w-8 text-primary/70" />
              <p className="font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STRATEGIC FOCUS */}
      <section className="bg-muted/30 p-8 md:p-12 rounded-2xl md:text-center space-y-8">
        <h2 className="text-3xl font-bold">Strategic Focus Areas</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Production", "Product Development", "Export Marketing", "Sales & Marketing"].map((area) => (
            <div key={area} className="bg-white px-6 py-3 rounded-full shadow-sm border font-semibold text-lg text-primary">
              {area}
            </div>
          ))}
        </div>
        <p className="text-xl font-serif italic text-muted-foreground mt-6">
          "Handcrafted stories in every bottle. Scaling sustainably. Growing meaningfully."
        </p>
      </section>

      {/* INNOVATION & COMPANY INFO */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" /> Innovation & Heritage
          </h2>
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Where tradition meets innovation.</h3>
            <p className="text-muted-foreground">
              We proudly work with rare local fruits, including <span className="font-medium text-foreground">Lovi – Rose Tart</span>, blending age-old methods with modern craftsmanship to deliver truly unique products.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" /> Company Information
          </h2>
          <div className="bg-card p-6 rounded-xl border shadow-sm text-sm space-y-3">
            <div className="grid grid-cols-[140px_1fr]">
              <span className="text-muted-foreground">Company Name:</span>
              <span className="font-medium">The Ceylon Spice Hub (Pvt) Ltd</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <span className="text-muted-foreground">Registration No:</span>
              <span className="font-medium">PV 00264115</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <span className="text-muted-foreground">Incorporated:</span>
              <span className="font-medium">30th September 2022</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <span className="text-muted-foreground">Bankers:</span>
              <span className="font-medium">Sampath Bank PLC</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <span className="text-muted-foreground">Auditors:</span>
              <span className="font-medium">Wickramasinghe Dayananda & Co.</span>
            </div>
            <div className="pt-2 mt-2 border-t">
              <span className="block text-muted-foreground mb-1">Directors:</span>
              <ul className="list-disc pl-5 font-medium">
                <li>Maihinda Rathnayake</li>
                <li>Manohari Rathnayaka</li>
                <li>Mihin Rathnayaka</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeArePage;
