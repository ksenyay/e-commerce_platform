import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">About Sound.io</h1>
      </div>

      <div className="prose prose-lg mx-auto text-center space-y-8">
        <p className="text-lg text-gray-300 leading-relaxed">
          Sound.io is a curated marketplace for high-quality audio files. We
          provide creators, filmmakers, and content producers with premium
          sounds that come with full commercial licensing.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-white">1</span>
            </div>
            <h3 className="text-base font-semibold mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-400">
              Professionally recorded and mastered audio files
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-white">2</span>
            </div>
            <h3 className="text-base font-semibold mb-2">
              Full Commercial License
            </h3>
            <p className="text-sm text-gray-400">
              Use in any project without attribution requirements
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-white">3</span>
            </div>
            <h3 className="text-base font-semibold mb-2">Instant Download</h3>
            <p className="text-sm text-gray-400">
              Get your sounds immediately after purchase
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-8 mt-13">
          <p className="text-base text-gray-300">
            Whether you&apos;re creating content, developing games, or producing
            films, our extensive library of sounds provides everything you need
            with the peace of mind that comes from proper licensing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
