import { AppHeader } from "./components/shared";

export default function Home() {
  return (
    <div className="isolate mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 pt-10 md:pb-24">
      <AppHeader />

      <div className="space-y-3 leading-7 font-semibold">
        <p>
          Kazuvin
          の遊び場です。実験的に作ったものを載せたり、スクラップをまとめたり。気が向いたらなにか書いたりします。
        </p>
      </div>

      <section className="grid grid-cols-2 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square border border-border rounded-2xl grid place-items-center text-2xl"
          ></div>
        ))}
      </section>
    </div>
  );
}
