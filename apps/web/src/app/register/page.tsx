import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;

  const success = params.success === "true";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white text-black p-8 rounded-xl shadow-xl border-4 border-black w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
            Account created successfully 🎉
          </div>
        )}

        <form
          action="/api/register"
          method="POST"
          className="space-y-4"
        >
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            required
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Enter password"
            required
            className="w-full px-3 py-2 border rounded"
          />

          <button className="w-full bg-black text-white py-2 rounded">
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </main>
  );
}