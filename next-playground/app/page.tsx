"use client";

import NextBackgroundImage from "../../next-bg-image/src";
import Win from "@/public/win.jpeg";

export default function Home(): any {
  return (
    <main className="">
      <NextBackgroundImage
        src={Win}
        className="w-screen h-screen text-4xl font-bold text-white p-10 flex flex-col justify-end"
        minImageWidth={1000}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel velit
        itaque mollitia ut ducimus totam numquam, veniam, repellat aperiam harum
        odio deserunt! Ab, qui ullam! Provident, saepe! Voluptas, dolore ipsa.
      </NextBackgroundImage>
    </main>
  );
}
