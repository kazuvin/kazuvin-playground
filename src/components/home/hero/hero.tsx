/**
 * ホームページのヒーローセクション
 * プレゼンテーションコンポーネント - 静的なコンテンツの表示のみ
 */
export function Hero() {
  return (
    <header className="space-y-1 leading-7">
      <div className="py-6 text-5xl">☕️</div>
      <p className="animate-fade-slide-up animation-forwards opacity-0">
        Hello, my name is Kazuvin.
      </p>
      <p className="animate-fade-slide-up animation-delay-200 animation-forwards opacity-0">
        This is my playground for experimenting with new web technologies
      </p>
      <p className="animate-fade-slide-up animation-delay-400 animation-forwards opacity-0">
        Please take a look around and enjoy your stay!
      </p>
    </header>
  );
}
