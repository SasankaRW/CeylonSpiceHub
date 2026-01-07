
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import CartIcon from '@/components/CartIcon';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/we-are', label: 'We Are' },
  { to: '/our-products', label: 'Our Products' },
  { to: '/products', label: 'Shop' },
  { to: '/accomplishments', label: 'Accomplishments' },
  { to: '/gallery-blog', label: 'Gallery & Blog' },
  { to: '/contact-us', label: 'Contact Us' },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/909949a5-1a33-4bbc-9ce6-0f65e0d7ca06/cde322e75cd351356564d87ae629c91d.png"
              alt="Ceylon Spice Hub Logo"
              className="h-12 w-12"
            />
            <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">Ceylon Spice Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {isAdmin ? (
                  <>
                    <NavigationMenuItem>
                      <NavLink
                        to="/admin"
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                        )}
                      >
                        Dashboard
                      </NavLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavLink
                        to="/admin/products"
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                        )}
                      >
                        Products
                      </NavLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavLink
                        to="/admin/orders"
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                        )}
                      >
                        Orders
                      </NavLink>
                    </NavigationMenuItem>
                  </>
                ) : (
                  navLinks.map((link) => (
                    <NavigationMenuItem key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) => cn(
                          navigationMenuTriggerStyle(),
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                        )}
                      >
                        {link.label}
                      </NavLink>
                    </NavigationMenuItem>
                  ))
                )}
              </NavigationMenuList>
            </NavigationMenu>
            {!isAdmin && <CartIcon />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {!isAdmin && <CartIcon />}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="ml-2">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background"
            >
              <nav className="container py-4">
                {isAdmin ? (
                  <div className="flex flex-col space-y-2">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => cn(
                        "px-4 py-2 rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/admin/products"
                      className={({ isActive }) => cn(
                        "px-4 py-2 rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Products
                    </NavLink>
                    <NavLink
                      to="/admin/orders"
                      className={({ isActive }) => cn(
                        "px-4 py-2 rounded-md",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </NavLink>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => cn(
                          "px-4 py-2 rounded-md",
                          isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-grow container py-8"
      >
        {children}
      </motion.main>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/909949a5-1a33-4bbc-9ce6-0f65e0d7ca06/cde322e75cd351356564d87ae629c91d.png"
              alt="Ceylon Spice Hub Logo"
              className="h-16 w-16 mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">Ceylon Spice Hub</h3>
            <p className="text-sm opacity-80">Authentic Taste of Nature</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={`footer-${link.to}`}>
                  <Link to={link.to} className="text-sm hover:text-accent transition-colors opacity-80 hover:opacity-100">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin" className="text-sm hover:text-accent transition-colors opacity-80 hover:opacity-100">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <p className="text-sm opacity-80">123 Spice Route, Colombo, Sri Lanka</p>
            <p className="text-sm opacity-80">info@ceylonspicehub.com</p>
            <p className="text-sm opacity-80">+94 11 234 5678</p>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-70">
          &copy; {new Date().getFullYear()} Ceylon Spice Hub (Pvt) Ltd. All Rights Reserved.
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
