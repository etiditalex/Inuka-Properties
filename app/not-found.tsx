import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white pt-24 pb-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-dark-900 mb-4 font-serif">
            Page Not Found
          </h2>
          <p className="text-xl text-dark-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Go Home
            </Link>
            <Link
              href="/for-sale"
              className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition border-2 border-primary-600 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

