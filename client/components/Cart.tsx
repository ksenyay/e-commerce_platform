import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";

const cartItems = [
  {
    id: "1",
    title: "Peaceful Waterfall",
    price: 10.0,
    imageUrl: "/waterfall.jpg",
  },
  {
    id: "2",
    title: "Forest Ambient",
    price: 8.5,
    imageUrl: "/forest.jpg",
  },
];

const Cart = () => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-primary" />
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-muted-foreground">
          Your cart is empty.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-foreground text-base">
                  {item.title}
                </h2>
                <p className="text-primary font-bold">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <button className="text-red-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-3 ">
            <span className="font-semibold text-foreground text-xl">Total</span>
            <span className="font-bold text-primary text-lg">
              ${total.toFixed(2)}
            </span>
          </div>

          <button className="w-full mt-3 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-200 hover:scale-101">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
