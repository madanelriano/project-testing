import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Video Editor</h1>
      <Link
        href="/editor"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Editor
      </Link>
    </main>
  );
}