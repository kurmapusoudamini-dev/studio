import StarlightSerenade from '@/components/StarlightSerenade';
import { GameProvider } from '@/context/GameContext';

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden">
      <GameProvider>
        <StarlightSerenade />
      </GameProvider>
    </main>
  );
}
