import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#0ff] font-['VT323'] selection:bg-[#f0f] selection:text-white overflow-x-hidden relative">
      <div className="bg-noise"></div>
      <div className="scanlines"></div>

      <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen flex flex-col screen-tear">
        <header className="flex flex-col items-center justify-center mb-12 text-center border-b-4 border-[#f0f] pb-4">
          <h1 className="glitch-text" data-text="NEON_BEATS.EXE">
            NEON_BEATS.EXE
          </h1>
          <div className="mt-4 bg-[#0ff] text-[#050505] px-4 py-1 font-bold tracking-widest text-2xl">
            SYS.INIT // AWAITING_INPUT
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          <section className="w-full lg:w-auto flex-1 flex justify-center order-2 lg:order-1">
            <SnakeGame />
          </section>

          <section className="w-full lg:w-96 shrink-0 order-1 lg:order-2">
            <MusicPlayer />
          </section>
        </main>
        
        <footer className="mt-12 text-center text-[#f0f] text-2xl border-t-4 border-[#0ff] pt-4">
          <p>CONNECTION_ESTABLISHED // SECURE_CHANNEL</p>
        </footer>
      </div>
    </div>
  );
}
