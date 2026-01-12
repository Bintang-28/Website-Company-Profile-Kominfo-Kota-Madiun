import 'next/image';

declare module 'next/image' {
  
  interface ImageProps {
    dangerouslyAllowSVG?: boolean;
  }
}