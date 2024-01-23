import Image from 'next/image';
import NextBackgroundImage from '../../../next-bg-image/src';
import AcmeLogo from '@/public/acme-logo.png';
import Win from '@/public/win-small.png';
import PineTrees from '@/public/pine-trees.jpg';

export default function Home(): any {
  return (
    <main className="">
      <NextBackgroundImage
        src={PineTrees}
        className="w-screen h-[50vh] text-3xl font-bold text-white p-10 flex flex-col justify-end"
        eager
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel velit itaque mollitia
        ut ducimus totam numquam, veniam, repellat aperiam harum odio deserunt! Ab, qui
        ullam! Provident, saepe! Voluptas, dolore ipsa.
      </NextBackgroundImage>
      <img src={Win.src} alt="" />
    </main>
  );
}
