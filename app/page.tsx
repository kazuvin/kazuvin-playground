export default function Home() {
  return (
    <div className="space-y-12">
      <div className="space-y-1 leading-7">
        <p className="animate-fade-slide-up animation-forwards opacity-0">
          Hello, my name is Kazuvin.
        </p>
        <p className="animate-fade-slide-up animation-delay-200 animation-forwards opacity-0">
          This is my playground for experimenting with new web technologies
        </p>
        <p className="animate-fade-slide-up animation-delay-400 animation-forwards opacity-0">
          Please take a look around and enjoy your stay!
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
