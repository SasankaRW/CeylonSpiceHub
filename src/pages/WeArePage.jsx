
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Target, BookOpen } from 'lucide-react';

const WeArePage = () => {
  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden shadow-xl">
          <div className="relative h-64 md:h-80">
            <img  
              className="w-full h-full object-cover" 
              alt="Ceylon Spice Hub farm and production facility"
             src="https://images.unsplash.com/photo-1677125061540-10b5da1bda5a" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white">Our Vision & Mission</h1>
            </div>
          </div>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <Card className="hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Eye className="h-10 w-10 text-secondary" />
            <CardTitle className="text-2xl text-primary">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed italic text-lg mb-4">
              "To become a cherished name in every household around the world—known for our distinctive aroma, rich flavor, vibrant color, and natural nutrition."
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Target className="h-10 w-10 text-accent" />
            <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              To craft and deliver nature-inspired products—spices, sauces, chutneys, jams, and wines—that celebrate authentic Sri Lankan flavor, support sustainable farming, empower local communities, and bring joy to every table.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <BookOpen className="h-10 w-10 text-primary" />
            <CardTitle className="text-2xl text-primary">History of Ceylon Spices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="md:flex md:space-x-6 items-center">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <img  
                  className="rounded-lg shadow-md object-cover w-full h-48" 
                  alt="Historical Ceylon spice trade"
                 src="https://images.unsplash.com/photo-1662615655994-89ee41457574" />
              </div>
              <div className="md:w-2/3">
                <p className="text-muted-foreground leading-relaxed">
                  For centuries, Sri Lanka—formerly known as Ceylon—has been celebrated for its abundant and aromatic spices. Its tropical climate and fertile soil nurtured a variety of spices, including cinnamon, cloves, pepper, nutmeg, mace, and cardamom, making the island a coveted destination for traders.
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Arab merchants were among the first to recognize the value of Ceylon's spices, establishing trade routes that connected the island to distant markets. The allure of these species eventually attracted European powers. In 1505, Portuguese Admiral Lourenço de Almeida arrived on Ceylon's southern coast, marking the beginning of European interest in the island's spice trade.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              The Portuguese established control over the lucrative cinnamon trade, followed by the Dutch in the 17th century, who expanded cultivation efforts. The British later took over in 1796, continuing the legacy of spice cultivation and export.
            </p>

            <div className="bg-accent/10 p-6 rounded-lg">
              <p className="text-muted-foreground leading-relaxed">
                Today, Sri Lanka continues to uphold its rich spice heritage. The cultivation and processing of spices remain integral to the island's culture and economy, with traditional methods passed down through generations. This enduring legacy ensures that the authentic flavors of Ceylon spices continue to enchant palates around the world.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
};

export default WeArePage;
