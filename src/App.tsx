import Desktop from "./features/Desktop/components/Desktop";

export default function App() {
  return (
    <div className="relative h-screen w-screen">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* macOS Desktop UI */}
        <Desktop />
      </div>
    </div>
  );
}
