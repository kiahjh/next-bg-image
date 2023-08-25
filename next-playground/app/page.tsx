import Image from 'next/image';
import { NextBackgroundImage } from '@friends-library/next-bg-image';
import Win from '@/public/win.jpeg';

export default function Home() {
  return (
    <main className="">
      <NextBackgroundImage src={Win} className="p-20 text-white text-xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel velit itaque mollitia
        ut ducimus totam numquam, veniam, repellat aperiam harum odio deserunt! Ab, qui
        ullam! Provident, saepe! Voluptas, dolore ipsa. Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Adipisci recusandae quo, maxime cupiditate ex nobis
        sunt eligendi non aliquid fugit soluta officiis et explicabo perspiciatis ipsam
        dolorem labore repellat impedit.
      </NextBackgroundImage>
    </main>
  );
}
