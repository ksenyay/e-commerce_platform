import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80">
      <div className="bg-white/5 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-lg">
        <h2 className="text-2xl font-bold text-red-400">
          404 – Page Not Found
        </h2>
        <p className="text-gray-300 text-center max-w-md">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="text-white font-semibold hover:underline transition"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
