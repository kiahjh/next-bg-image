import React from "react";
import { Space_Grotesk } from "next/font/google";
import type { NextPage } from "next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"], // eslint-disable-line
});

const ImagePage: NextPage = () => (
  <div className="flex justify-center items-center bg-slate-500 h-screen w-screen">
    <div className="bg-gradient-to-b from-white to-blue-100 p-12 w-[600px] h-72 flex flex-col justify-center items-center rounded-3xl">
      <h1
        className="text-6xl font-bold bg-gradient-to-r from-black via-blue-400 to-blue-800 bg-clip-text text-transparent p-2"
        style={spaceGrotesk.style}
      >
        next-bg-image
      </h1>
      <p className="text-base text-blue-800/50 text-center mt-4 w-[360px]">
        Responsive, optimized, and accessible background images for Next.js
      </p>
    </div>
  </div>
);

export default ImagePage;
