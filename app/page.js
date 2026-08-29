import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl front-bold mb-4">
          personal book maneger
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          keep track of your books you have read
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
          <Link href="/signup" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}


