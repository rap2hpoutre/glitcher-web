import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo2.png";

export default function Header({ link }: { link: string }) {
  console.log(link);
  return (
    <div className="flex justify-items-stretch border-b px-2 pt-3 pb-2">
      <div className="flex-auto justify-self-start">
        <Image src={logo} alt="logo" />
      </div>
      <div className="justify-self-end mr-5">
        <Link href={"/" + (link === "home" ? "" : link)}>{link}</Link>
      </div>
    </div>
  );
}
