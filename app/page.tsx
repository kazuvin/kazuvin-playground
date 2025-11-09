export default function Home() {
  return (
    <div className="space-y-12">
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
            className="border-border grid aspect-square place-items-center rounded-2xl border text-2xl"
          ></div>
        ))}
      </section>
    </div>
  );
}
