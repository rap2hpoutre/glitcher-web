import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo2.png";
import Head from "next/head";

export default function Header({ link }: { link: "about" | "home" }) {
  return (
    <>
      <Head>
        <title>Glitcher - breakcore generator</title>
        <meta name="description" content="A Drum Loop Glitcher made by Rap2h" />

        <meta property="og:url" content="https://glitcher.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Drum Loop Glitcher" />
        <meta property="og:description" content="A Drum Loop Glitcher made by Rap2h" />
        <meta property="og:image" content="https://glitcher.vercel.app/ds.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="dungeon-synth-name-generator.vercel.app" />
        <meta property="twitter:url" content="https://glitcher.vercel.app/" />
        <meta name="twitter:title" content="Drum Loop Glitcher" />
        <meta name="twitter:description" content="A Drum Loop Glitcher made by Rap2h" />
        <meta name="twitter:image" content="https://glitcher.vercel.app/ds.png" />
      </Head>
      <div className="flex justify-items-stretch border-b px-2 pt-3 pb-2">
        <div className="flex-auto justify-self-start ml-3">
          <Link href={"/"}>
            <Image src={logo} alt="logo" />
          </Link>
        </div>
        <div className="justify-self-end mr-5 font-mono self-center hover:underline">
          {link === "about" ? <Link href={"/about"}>About</Link> : <Link href={"/"}>Home</Link>}
        </div>
      </div>
    </>
  );
}
