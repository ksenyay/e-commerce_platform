import React from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "../ui/button";
import {
  Download,
  Play,
  Clock,
  HardDrive,
  FileAudio,
  Shield,
  BarChart3,
} from "lucide-react";

type ProductPageProps = { id: string };

const ProductPage = ({ id }: ProductPageProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Hero Image */}
      <div className="relative w-full mb-8">
        <Image
          src="/waterfall.jpg"
          alt="Waterfall sounds"
          width={1200}
          height={400}
          className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />

        {/* Breadcrumb overlay */}
        <div className="absolute bottom-6 left-6">
          <Breadcrumb>
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-white/80 hover:text-white"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Product</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-start">
              Peaceful Waterfall Sounds
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                By <span className="font-semibold text-white">ksenyay</span>
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                Nature
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                250 downloads
              </span>
            </div>
          </div>

          {/* Audio Player Preview */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 rounded-xl p-4 "
                >
                  <Play className="w-6 h-6 ml-1" />
                </Button>
                <div>
                  <p className="text-white font-medium">Preview</p>
                  <p className="text-sm text-gray-400">
                    Peaceful Waterfall Sounds
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">3:45</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 hover:bg-white/10 rounded-xl"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              Immerse yourself in the tranquil sounds of a cascading waterfall.
              This high-quality recording captures the natural white noise
              perfect for relaxation, meditation, or background ambiance.
              Recorded in pristine natural conditions with professional
              equipment for the best audio experience.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "waterfall",
                "nature",
                "relaxing",
                "white noise",
                "meditation",
                "ambient",
              ].map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-6">
            <div className="space-y-6">
              {/* Price */}
              <div className="text-center pb-4 border-b border-white/10">
                <div className="text-3xl font-bold text-primary mb-2">
                  $10.00
                </div>
                <p className="text-sm text-gray-400">One-time purchase</p>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Technical Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">3:45</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <HardDrive className="w-4 h-4" />
                      <span>File Size</span>
                    </div>
                    <span className="font-medium">15.2 MB</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileAudio className="w-4 h-4" />
                      <span>Format</span>
                    </div>
                    <span className="font-medium">MP3</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>License</span>
                    </div>
                    <span className="font-medium text-green-400">
                      Commercial
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <Button className="w-full bg-primary hover:bg-primary/90 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-102">
                Add to Cart
              </Button>

              {/* License Info */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-green-400">
                    Commercial License
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Use in any project without attribution requirements. Perfect
                  for commercial use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
