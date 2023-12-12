import NextBackgroundImage from "@friends-library/next-bg-image";
import Win from "@/public/win.jpeg";
import Transparent from "@/public/transparent.png";

export default function Home(): any {
  return (
    <main className="">
      <NextBackgroundImage
        src={[
          `linear-gradient(to bottom, rgb(0 0 0 / 0), black)`,
          Transparent,
          Win,
        ]}
        className="w-screen h-screen text-4xl font-bold text-white p-10 flex flex-col justify-end"
        size={{
          default: `cover`,
          md: `100px`,
        }}
        lazyLoad
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel velit
        itaque mollitia ut ducimus totam numquam, veniam, repellat aperiam harum
        odio deserunt! Ab, qui ullam! Provident, saepe! Voluptas, dolore ipsa.
      </NextBackgroundImage>
    </main>
  );
}
