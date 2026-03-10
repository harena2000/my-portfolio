export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020818] text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-400">404</h1>
        <p className="mt-4 text-gray-400">Page not found</p>
        <a href="/" className="mt-6 inline-block text-blue-400 hover:text-blue-300 underline">
          Go home
        </a>
      </div>
    </div>
  );
}
