import NextBackgroundImage from '../../../next-bg-image/src';
import AcmeLogo from '@/public/acme-logo.png';
import PineTrees from '@/public/pine-trees.jpg';

export default function Home(): any {
  return (
    <main className="">
      <NextBackgroundImage
        _renderDebugCss
        src={[AcmeLogo, `linear-gradient(rgba(0,0,0,0), rgba(0,155,0,0.9))`, PineTrees]}
        // src={PineTrees}
        lazyLoad={true}
        className="w-screen h-[50vh] text-3xl font-bold text-white p-10 flex flex-col justify-end"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel velit itaque mollitia
        ut ducimus totam numquam, veniam, repellat aperiam harum odio deserunt! Ab, qui
        ullam! Provident, saepe! Voluptas, dolore ipsa.
      </NextBackgroundImage>
    </main>
  );
}
