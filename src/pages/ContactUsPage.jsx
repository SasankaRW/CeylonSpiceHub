
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactUsPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Form data submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
      variant: "default",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question, a suggestion, or just want to say hello, feel free to reach out.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <Input id="name" name="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="mt-1 bg-background/70 focus:ring-primary"/>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required className="mt-1 bg-background/70 focus:ring-primary"/>
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-foreground">Subject</Label>
                  <Input id="subject" name="subject" type="text" placeholder="Reason for contacting" value={formData.subject} onChange={handleChange} required className="mt-1 bg-background/70 focus:ring-primary"/>
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground">Message</Label>
                  <Textarea id="message" name="message" placeholder="Your message here..." value={formData.message} onChange={handleChange} required rows={5} className="mt-1 bg-background/70 focus:ring-primary"/>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          <Card className="shadow-xl bg-gradient-to-br from-primary/5 via-card to-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-8 w-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Our Address</h3>
                  <p className="text-muted-foreground">Ceylon Spice Hub (Pvt) Ltd,<br />123 Spice Route, Colombo 00700,<br />Sri Lanka.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="h-8 w-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Email Us</h3>
                  <a href="mailto:info@ceylonspicehub.com" className="text-muted-foreground hover:text-primary transition-colors">info@ceylonspicehub.com</a><br/>
                  <a href="mailto:sales@ceylonspicehub.com" className="text-muted-foreground hover:text-primary transition-colors">sales@ceylonspicehub.com</a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-8 w-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Call Us</h3>
                  <p className="text-muted-foreground">General Inquiries: +94 11 234 5678</p>
                  <p className="text-muted-foreground">Sales Department: +94 77 123 4567</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-lg overflow-hidden shadow-xl h-72">
             <iframe 
                width="100%" 
                height="100%" 
                style={{ border:0 }}
                loading="lazy" 
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=79.8488%2C6.9000%2C79.8700%2C6.9200&layer=mapnik&marker=6.9100%2C79.8594">
             </iframe>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ContactUsPage;
  