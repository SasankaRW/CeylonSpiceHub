
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Award, Gift, ShoppingBag, Globe, Zap, Utensils, Star, Flag, ArrowRight } from 'lucide-react';

const milestones = [
  {
    year: "2025",
    events: [
      { month: "Featured", title: "Cinnamon Sugar", desc: "Launched our value-added cinnamon sugar.", icon: Zap, img: "https://images.unsplash.com/photo-1599307436067-12df520ba678?q=80&w=1000&auto=format&fit=crop" },
      { month: "Upcoming", title: "15 Wine Launches", desc: "Expanding our wine portfolio significantly.", icon: Globe },
      { month: "Soon", title: "Future Innovations", desc: "More ground-breaking products coming soon.", icon: Zap },
    ]
  },
  {
    year: "2024",
    events: [
      { month: "October", title: "Chutney Collection", desc: "Introduced 12 new chutneys to the market.", icon: Utensils },
      { month: "September", title: "FRUITOPIA Wines", desc: "Grand launch of our fruit wines.", icon: Globe, img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop" },
      { month: "August", title: "Silver Award at ESG Summit", desc: "Honored by the University of Colombo MBA Alumni.", icon: Award },
      { month: "June", title: "Sauce Collection", desc: "Introduced 14 distinct sauce varieties.", icon: Utensils, img: "https://images.unsplash.com/photo-1622035345717-380d603e8712?q=80&w=1000&auto=format&fit=crop" },
    ]
  },
  {
    year: "2023",
    events: [
      { month: "October", title: "Good Market Approved", desc: "Recognized as a sustainable vendor by Good Market.", icon: Award, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop" },
      { month: "August", title: "Physical Presence", desc: "Opened product counter & online sales channels.", icon: ShoppingBag },
      { month: "July", title: "KATAGASMA Range", desc: "Launched our traditional condiments range.", icon: Utensils },
      { month: "April", title: "KADAMALLA Gift Pack", desc: "Introduced our special New Year Gift Pack.", icon: Gift, img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1000&auto=format&fit=crop" },
    ]
  },
  {
    year: "2022",
    events: [
      { month: "November", title: "Product Expansion", desc: "Added 5 more unique spice mixtures to our collection.", icon: Globe },
      { month: "September", title: "Global Launch", desc: "Launched with 5 signature spices & blends.", icon: Flag, img: "https://images.unsplash.com/photo-1532336414038-517a23760a2e?q=80&w=1000&auto=format&fit=crop" },
    ]
  }
];

const AccomplishmentsPage = () => {
  return (
    <div className="space-y-20 pb-12 bg-background/50">
      {/* HERO SECTION */}
      <section className="relative h-[450px] rounded-b-[3rem] overflow-hidden shadow-2xl mx-0 lg:mx-0 group">
        <img
          src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=1920&auto=format&fit=crop"
          alt="Ceylon Spice Hub Journey"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 border border-white/50 rounded-full text-white/90 text-sm font-medium mb-6 uppercase tracking-[0.2em] backdrop-blur-md">
              Since 2022
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl font-serif">Our Journey</h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-3xl font-light leading-relaxed drop-shadow-md">
              "From a dream in Pasgoda to a global flavor destination, every milestone is a step forward for our community and planet."
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="container mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-card rounded-2xl shadow-xl p-8 grid md:grid-cols-3 gap-8 border border-border/50 divide-y md:divide-y-0 md:divide-x divide-border/50"
        >
          {[
            { label: "Products Launched", value: "70+", icon: ShoppingBag, color: "text-primary" },
            { label: "Years of Excellence", value: "3+", icon: Star, color: "text-yellow-500" },
            { label: "Awards Won", value: "2", icon: Award, color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4">
              <div className={`p-3 rounded-full bg-muted/50 mb-4 ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* TIMELINE SECTION */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground inline-flex items-center gap-3">
            Timeline of Success
          </h2>
          <div className="w-16 h-1.5 bg-primary mx-auto mt-4 rounded-full opacity-80"></div>
        </div>

        <div className="relative">
          {/* Continuous Center Line */}
          <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full md:block"></div>

          <div className="space-y-12">
            {milestones.map((yearGroup, yearIndex) => (
              <div key={yearGroup.year} className="relative">

                {/* Year Header */}
                <div className="flex justify-start md:justify-center items-center mb-8 relative z-10 pl-[56px] md:pl-0">
                  <div className="bg-background text-foreground font-bold text-xl md:text-2xl px-8 py-2 rounded-full border-2 border-primary shadow-lg inline-block">
                    {yearGroup.year}
                  </div>
                </div>

                {/* Events Group */}
                <div className="space-y-6">
                  {yearGroup.events.map((event, eventIndex) => {
                    const isEven = eventIndex % 2 === 0;
                    return (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className={`md:flex items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* Card Side */}
                        <div className="flex-1 ml-12 md:ml-0">
                          <Card className="group hover:shadow-2xl transition-all duration-300 border-l-4 border-l-primary hover:border-l-8 overflow-hidden h-full">
                            <CardContent className="p-4 md:p-5 h-full flex flex-col justify-center">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <span className="text-xs font-bold text-primary uppercase tracking-wide mb-1 block">
                                    {event.month}
                                  </span>
                                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                    {event.title}
                                  </h3>
                                </div>
                                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                  <event.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {event.desc}
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Center Dot & Connector */}
                        <div className="absolute left-[13px] md:static md:w-16 md:flex md:justify-center flex-none">
                          <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md z-10 relative">
                            <div className="absolute top-1/2 left-full w-8 h-[2px] bg-primary md:hidden"></div> {/* Mobile Connector */}
                          </div>
                        </div>

                        {/* Image/Empty Side */}
                        <div className="flex-1 hidden md:block">
                          {event.img && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                              className="h-48 rounded-xl overflow-hidden shadow-lg border border-border/50 group"
                            >
                              <img
                                src={event.img}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 px-6 bg-primary/5 rounded-3xl border border-primary/10"
        >
          <p className="text-2xl md:text-3xl font-serif italic text-primary">"Scaling sustainably. Growing meaningfully."</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AccomplishmentsPage;
