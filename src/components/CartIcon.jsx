
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCartItemCount, subscribeToCart } from '@/lib/cartStore';
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const [itemCount, setItemCount] = useState(getCartItemCount());

  useEffect(() => {
    const unsubscribe = subscribeToCart(() => {
      setItemCount(getCartItemCount());
    });
    return unsubscribe;
  }, []);

  return (
    <Button variant="ghost" asChild className="relative">
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default CartIcon;
