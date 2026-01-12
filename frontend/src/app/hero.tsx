"use client";

import React, { useState, useEffect, useRef } from 'react';

function Hero() {
  const heroItems = [
    {
      id: 1, type: 'image', src: "/image/hut80.jpg", alt: "hut80", thumbnail: "/image/hut80.jpg"
    },
    {
      id: 2, type: 'image', src: "/image/awaksigap-hero.jpg", alt: "awaksigap", thumbnail: "/image/awaksigap-hero.jpg"
    },
    {
      id: 3, type: 'video', src: "/video/PesonaKotaMadiun.mp4", alt: "Pemandangan Kota Madiun", thumbnail: "/video/PesonaKotaMadiun.mp4" 
    }
  ];

  const [activeItem, setActiveItem] = useState(heroItems[0]);
  
  const videoThumbnailRefs = useRef(new Map());

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem(currentItem => {
        const currentIndex = heroItems.findIndex(item => item.id === currentItem.id);
        const nextIndex = (currentIndex + 1) % heroItems.length;
        return heroItems[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (itemId) => {
    const node = videoThumbnailRefs.current.get(itemId);
    if (node) {
      node.play();
    }
  };

  const handleMouseLeave = (itemId) => {
    const node = videoThumbnailRefs.current.get(itemId);
    if (node) {
      node.pause();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {heroItems.map((item) => {
        const isActive = activeItem.id === item.id;
        if (item.type === 'video') {
          return (
            <video
              key={item.id}
              src={item.src}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              autoPlay muted loop playsInline suppressHydrationWarning={true}
            />
          );
        } else {
          return (
            <div
              key={item.id}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url('${item.src}')` }}
            />
          );
        }
      })}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-xl">
          {heroItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`relative h-16 w-24 overflow-hidden rounded-md transition-all duration-300 ${
                activeItem.id === item.id 
                  ? 'ring-2 ring-white shadow-xl' 
                  : 'ring-1 ring-white/30 hover:ring-white/80 scale-90 hover:scale-100'
              }`}
              onMouseEnter={() => item.type === 'video' && handleMouseEnter(item.id)}
              onMouseLeave={() => item.type === 'video' && handleMouseLeave(item.id)}
            >
              {item.type === 'video' ? (
                <video
                  ref={(node) => {
                    const map = videoThumbnailRefs.current;
                    if (node) {
                      map.set(item.id, node);
                    } else {
                      map.delete(item.id);
                    }
                  }}
                  src={item.thumbnail}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={item.thumbnail}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;