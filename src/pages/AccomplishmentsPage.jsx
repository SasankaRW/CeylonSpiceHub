
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Award, Gift, ShoppingBag, Globe, Zap, Utensils, Star, Flag, ArrowRight } from 'lucide-react';

const milestones = [
  {
    year: "Future Plans",
    events: [
      { month: "Upcoming", title: "Pasta Sauce Mixtures", desc: "Ready to Cook Pasta Sauce mixtures.", icon: Utensils },
      { month: "Upcoming", title: "Sugar Free Jam", desc: "Introducing Sugar Free Jam and spreads.", icon: Utensils },
      { month: "Upcoming", title: "Tea & Coffee Wines", desc: "Introducing Tea / Coffee wines to market.", icon: Globe },
      { month: "Upcoming", title: "Tea Leaf Pickle", desc: "Introducing Tender Tea Leave Pickle.", icon: Utensils },
    ]
  },
  {
    year: "2025",
    events: [
      { month: "December", title: "Made In Sri Lanka", desc: "Made In Sri Lanka Logo was awarded for 12 products.", icon: Award },
      { month: "December", title: "Wine Tasting Demo", desc: "Wine Tasting Demo Day at The Saturday Good Market Event.", icon: Globe },
      { month: "December", title: "Chutney Pallet", desc: "Chutney Pallet increased to 12.", icon: Utensils },
      { month: "December", title: "Cookery Demo", desc: "Cookery demo with Thisara TV.", icon: Zap },
      { month: "November", title: "Entrepreneur Award", desc: "Western Province Entrepreneur Award 2024 – Runners Up Micro Category.", icon: Award },
      { month: "November", title: "INFOTEL 2024", desc: "Participated in the SME Pavilion at the INFOTEL 2024.", icon: ShoppingBag },
      { month: "November", title: "Cinnamon Sugar", desc: "Cinnamon Sugar was introduced to the Market.", icon: Utensils },
      { month: "July", title: "Sauce Pallet", desc: "Sauce Pallet increased to 16.", icon: Utensils },
      { month: "February", title: "Jam Pallet", desc: "Jam Pallet increased to 8.", icon: Utensils },
    ]
  },
  {
    year: "2024",
    events: [
      { month: "December", title: "First Supermarket", desc: "KANDARA Supermarket – Our first supermarket entry.", icon: ShoppingBag },
      { month: "August", title: "Fruitopia Wine", desc: "Fruitopia fermented wine was introduced.", icon: Globe },
      { month: "August", title: "ESG Silver Award", desc: "MSME ESG Silver Award awarded by MBA Alumni Association of University of Colombo.", icon: Award },
    ]
  },
  {
    year: "2023",
    events: [
      { month: "October", title: "Good Market Approved", desc: "GOOD MARKET approved vendor.", icon: Award },
      { month: "August", title: "Mini Outlet Opening", desc: "Soft Opening of mini outlet at Divulpitiya & Online Sales.", icon: ShoppingBag },
      { month: "July", title: "KATAGASMA Range", desc: "Launched KATAGASMA range.", icon: Utensils },
      { month: "April", title: "KADAMALLA Gift Pack", desc: "New Year Gift Pack – KADAMALLA.", icon: Gift },
    ]
  },
  {
    year: "2022",
    events: [
      { month: "November", title: "Spice Mixtures", desc: "Added 5 more spice mixtures.", icon: Utensils },
      { month: "September", title: "Grand Launch", desc: "Launched with 5 spices & blends.", icon: Flag },
    ]
  }
];

const AccomplishmentsPage = () => {
  return (
    <div className="space-y-12 pb-12 bg-background/50">
      {/* HERO SECTION */}
      <section className="relative h-[300px] rounded-b-[2rem] overflow-hidden shadow-2xl mx-0 lg:mx-0 group">
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
            <div className="inline-block px-4 py-1.5 border border-white/50 rounded-full text-white/90 text-sm font-medium mb-4 uppercase tracking-[0.2em] backdrop-blur-md">
              Since 2022
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl font-serif">Our Journey</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl font-light leading-relaxed drop-shadow-md">
              "From a dream in Pasgoda to a global flavor destination."
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="container mx-auto px-6 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-card rounded-2xl shadow-xl p-6 grid md:grid-cols-3 gap-4 border border-border/50 divide-y md:divide-y-0 md:divide-x divide-border/50"
        >
          {[
            { label: "Products Launched", value: "70+", icon: ShoppingBag, color: "text-primary" },
            { label: "Years of Excellence", value: "3+", icon: Star, color: "text-yellow-500" },
            { label: "Awards Won", value: "2", icon: Award, color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-2">
              <div className={`p-2 rounded-full bg-muted/50 mb-2 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* TIMELINE SECTION */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground inline-flex items-center gap-3">
            Timeline of Success
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-2 rounded-full opacity-80"></div>
        </div>

        <div className="relative">
          {/* Continuous Center Line */}
          <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full md:block"></div>

          <div className="space-y-8">
            {milestones.map((yearGroup, yearIndex) => (
              <div key={yearGroup.year} className="relative">

                {/* Year Header */}
                <div className="flex justify-start md:justify-center items-center mb-4 relative z-10 pl-[56px] md:pl-0">
                  <div className="bg-background text-foreground font-bold text-lg px-6 py-1.5 rounded-full border-2 border-primary shadow-lg inline-block">
                    {yearGroup.year}
                  </div>
                </div>

                {/* Events Group */}
                <div className="space-y-4">
                  {yearGroup.events.map((event, eventIndex) => {
                    const isEven = eventIndex % 2 === 0;
                    return (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className={`md:flex items-center gap-4 ${isEven ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* Card Side */}
                        <div className="flex-1 ml-12 md:ml-0">
                          <Card className="group hover:shadow-2xl transition-all duration-300 border-l-4 border-l-primary hover:border-l-8 overflow-hidden h-full">
                            <CardContent className="p-3 md:p-4 h-full flex flex-col justify-center">
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide mb-0.5 block">
                                    {event.month}
                                  </span>
                                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                    {event.title}
                                  </h3>
                                </div>
                                <div className="p-1.5 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                  <event.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {event.desc}
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Center Dot & Connector */}
                        <div className="absolute left-[13px] md:static md:w-16 md:flex md:justify-center flex-none">
                          <div className="w-3.5 h-3.5 rounded-full bg-primary border-4 border-background shadow-md z-10 relative">
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
                              className="h-32 rounded-xl overflow-hidden shadow-lg border border-border/50 group"
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
          className="text-center py-8 px-6 bg-primary/5 rounded-3xl border border-primary/10"
        >
          <p className="text-xl md:text-2xl font-serif italic text-primary">"Scaling sustainably. Growing meaningfully."</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AccomplishmentsPage;
