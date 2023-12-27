"use client";

import Image from "next/image";
import NextBackgroundImage from "../../next-bg-image/src";
import Win from "@/public/win-small.png";

export default function Home(): any {
  return (
    <main className="">
      <NextBackgroundImage
        // src={{
        //   src: `https://placekitten.com/1200/1200`,
        //   width: 1200,
        //   height: 1200,
        // }}
        src={Win}
        className="w-screen h-screen text-4xl font-bold text-white p-10 flex flex-col justify-end"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel velit
        itaque mollitia ut ducimus totam numquam, veniam, repellat aperiam harum
        odio deserunt! Ab, qui ullam! Provident, saepe! Voluptas, dolore ipsa.
      </NextBackgroundImage>
    </main>
  );
}
