import Header from "../components/Header";

function ExternalLink({ href, text }: { href: string; text: string }) {
  return (
    <>
      {" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {text}
      </a>
    </>
  );
}

export default function About() {
  return (
    <div>
      <Header link="home" />
      <div className="container mx-auto my-5">
        <h1 className="text-xl text-center my-14 mx-2 md:mx-0 font-mono">About Glitcher</h1>
        <div className="mx-4 md:mx-0">
          <div className="max-w-xl mx-auto">
            <p className="mb-6">
              This project written in{" "}
              <ExternalLink href="https://www.typescriptlang.org/" text="Typescript" /> has been
              made with{" "}
              <ExternalLink href="https://github.com/ffmpegwasm/ffmpeg.wasm" text="ffmpeg-wasm" />{" "}
              (through a confidential
              <ExternalLink href="https://github.com/yeliulee/ffmpeg.wasm" text="fork" /> that
              indirectly fixes a browser crash), using{" "}
              <ExternalLink href="https://fr.reactjs.org/" text="React" /> via{" "}
              <ExternalLink href="https://nextjs.org/" text="NextJS" />. Style is done with{" "}
              <ExternalLink href="https://tailwindcss.com/" text="tailwindcss" />. The code is
              deployed on
              <ExternalLink href="https://vercel.com/" text="Vercel" /> thanks to Github actions.
              The glitch beat generation process is done thanks to the indestructible{" "}
              <ExternalLink href="https://ffmpeg.org/" text="ffmpeg" />.
            </p>
            <p className="mb-6">
              <b>The code is open source</b>, you can find it{" "}
              <ExternalLink
                href="https://github.com/rap2hpoutre/glitcher-web"
                text="here (Github)"
              />
              . Feel free to contribute! Report any bug{" "}
              <ExternalLink href="https://github.com/rap2hpoutre/glitcher-web/issues" text="here" />
              . Please note that the glitch beat generation process is done in the browser, so it
              might be slow and crash often.
            </p>
            <p className="mb-6">
              More glitch patterns coming soon (and more example patterns), you can have a look at
              the actual ones{" "}
              <ExternalLink
                href="https://github.com/rap2hpoutre/glitcher-web/blob/main/utils/patterns.ts"
                text="here"
              />
              . I will add a changelog soon.
            </p>
            <p className="mb-6">
              I made this project because I love making{" "}
              <ExternalLink href="https://youtu.be/n4h8tsBB7R0 " text="broken music tracks" /> with{" "}
              <ExternalLink href="https://youtu.be/d3uSsta-b8Y" text="glitched drum loops" />. I
              sometimes use recurrent patterns, and I wanted to make a tool to make it available for
              you. I first tried to make it with{" "}
              <ExternalLink href="https://sonic-pi.net/" text="Sonic PI" /> (demo of the project
              <ExternalLink href="https://youtu.be/pzLlRkVEW68" text="here" />
              ), but it was not that simple since it needed to install the program and then edit the
              code to change the sample. So I decided to create this simple &quot;online drum loop
              glitcher&quot; tool in 3 steps (go to site, upload, download, done). Also, I love
              writing
              <ExternalLink
                href="https://dungeon-synth-name-generator.vercel.app/"
                text="procedural generation tools"
              />
              .
            </p>
            <p className="mb-6">
              Any questions or suggestions? Contact:{" "}
              <ExternalLink href="mailto:raphaelht@gmail.com" text="raphaelht@gmail.com" />. I would
              be glad to have your feedback!
            </p>
            <p className="mb-10">Rap2h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
