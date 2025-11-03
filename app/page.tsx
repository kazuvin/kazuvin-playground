export default function Home() {
  return (
    <div className="isolate mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 pt-10 md:pb-24">
      <header className="space-y-6">
        <div className="size-18 bg-linear-to-r from-pink-300 to-purple-300 rounded-2xl grid place-items-center text-2xl">
          👀
        </div>

        <div className="space-y-2">
          <h1 className="font-bold text-xl">Kazuvin Playground</h1>
          <p className="font-semibold">
            実験的に作ったものを載せたり、スクラップをまとめたり。
          </p>
        </div>
      </header>

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
