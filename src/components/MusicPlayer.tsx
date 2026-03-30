import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'DATA_STREAM_01',
    artist: 'AI_CORE_ALPHA',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'MEMORY_LEAK_02',
    artist: 'AI_CORE_BETA',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'KERNEL_PANIC_03',
    artist: 'AI_CORE_GAMMA',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#050505] border-4 border-[#0ff] p-6 relative font-['VT323'] text-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f] animate-pulse"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="mb-6 border-b-2 border-[#f0f] pb-4">
        <h3 className="text-[#fff] text-3xl bg-[#f0f] text-[#050505] inline-block px-2 mb-2">
          {currentTrack.title}
        </h3>
        <p className="text-[#0ff] text-xl">
          SRC: {currentTrack.artist}
        </p>
      </div>

      <div className="mb-6">
        <div className="h-4 bg-[#050505] border-2 border-[#0ff] relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#f0f]"
            style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[#0ff]">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={prevTrack}
          className="flex-1 py-2 bg-[#050505] border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-[#050505]"
        >
          &lt;&lt; PREV
        </button>
        
        <button
          onClick={togglePlay}
          className="flex-1 py-2 bg-[#f0f] border-2 border-[#f0f] text-[#050505] hover:bg-[#050505] hover:text-[#f0f] text-3xl"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        
        <button
          onClick={nextTrack}
          className="flex-1 py-2 bg-[#050505] border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-[#050505]"
        >
          NEXT &gt;&gt;
        </button>
      </div>
    </div>
  );
}
