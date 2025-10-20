const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-black/80">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-lg text-foreground font-semibold">Loading...</p>
    </div>
  </div>
);

export default Loading;
