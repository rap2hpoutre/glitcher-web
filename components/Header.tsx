import Link from "next/link";

export default function Header({ link }: { link: string }) {
  console.log(link);
  return (
    <div className="flex justify-items-stretch border-b p-4 m-b-5">
      <div className="flex-auto justify-self-start">Glitcher</div>
      <div className="justify-self-end">
        <Link href={"/" + (link === "home" ? "" : link)}>{link}</Link>
      </div>
    </div>
  );
}
