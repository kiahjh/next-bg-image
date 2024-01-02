"use client";

import Image from "next/image";
import NextBackgroundImage from "../../next-bg-image/src";
import Win from "@/public/win.jpeg";

export default function Home(): any {
  return (
    <main>
      <NextBackgroundImage
        // src={{
        //   src: `https://placekitten.com/1200/1200`,
        //   width: 1200,
        //   height: 1200,
        // }}
        src={Win}
        className="w-full h-96 text-4xl font-bold text-white p-10 flex flex-col justify-end bg-black"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel velit
        itaque mollitia ut ducimus totam numquam, veniam, repellat aperiam harum
        odio deserunt! Ab, qui ullam! Provident, saepe! Voluptas, dolore ipsa.
      </NextBackgroundImage>
    </main>
  );
}
