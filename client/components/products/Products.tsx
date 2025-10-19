import React from "react";
import Card from "./Card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import Categories from "./Categories";

const products = [
  {
    id: "1",
    title: "Forest Ambient",
    description: "Peaceful forest sounds for relaxation",
    price: 20.35,
    likes: 1200,
    imageUrl: "/forest.jpg",
  },
  {
    id: "2",
    title: "Rain Sounds",
    description: "Relaxing rain sounds for sleep and focus",
    price: 15.99,
    likes: 980,
    imageUrl: "/rain.jpg",
  },
  {
    id: "3",
    title: "Ocean Waves",
    description: "Soothing ocean wave sounds for meditation",
    price: 18.5,
    likes: 1100,
    imageUrl: "/beach.jpg",
  },
  {
    id: "4",
    title: "Mountain Breeze",
    description: "Calming mountain breeze sounds for relaxation",
    price: 22.0,
    likes: 750,
    imageUrl: "/mountain.jpg",
  },
  {
    id: "5",
    title: "City Ambience",
    description: "Urban city sounds for background noise",
    price: 12.75,
    likes: 640,
    imageUrl: "/city.jpg",
  },
  {
    id: "6",
    title: "Nighttime Crickets",
    description: "Peaceful cricket sounds for sleep",
    price: 14.2,
    likes: 890,
    imageUrl: "/crickets.jpg",
  },
  {
    id: "7",
    title: "Fireplace Crackling",
    description: "Warm fireplace sounds for cozy evenings",
    price: 19.99,
    likes: 1050,
    imageUrl: "/fireplace.jpg",
  },
  {
    id: "8",
    title: "Wind Chimes",
    description: "Gentle wind chime sounds for relaxation",
    price: 16.5,
    likes: 720,
    imageUrl: "/windchimes.jpg",
  },
  {
    id: "9",
    title: "Birdsong",
    description: "Cheerful birdsong for a refreshing atmosphere",
    price: 13.99,
    likes: 830,
    imageUrl: "/birds.jpg",
  },
  {
    id: "10",
    title: "Thunderstorm",
    description: "Dramatic thunderstorm sounds for focus",
    price: 21.0,
    likes: 950,
    imageUrl: "/thunderstorm.jpg",
  },
  {
    id: "11",
    title: "Waterfall",
    description: "Relaxing waterfall sounds for meditation",
    price: 17.75,
    likes: 780,
    imageUrl: "/waterfall.jpg",
  },
  {
    id: "12",
    title: "Desert Winds",
    description: "Calm desert wind sounds for relaxation",
    price: 14.5,
    likes: 670,
    imageUrl: "/desert.jpg",
  },
];

const Products = () => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Featured Sounds</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover our curated collection of premium audio files perfect for
          relaxation, focus, and creative projects.
        </p>
      </div>

      <Categories />

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
        {products.map((product) => (
          <Card key={product.id} card={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-3 mb-5">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="hover:bg-white/10 rounded-xl transition-all duration-200"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="hover:bg-white/10 bg-primary text-primary-foreground rounded-xl transition-all duration-200"
                isActive
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="text-gray-400" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                12
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="hover:bg-white/10 rounded-xl transition-all duration-200"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Products;
