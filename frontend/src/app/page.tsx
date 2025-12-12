export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <nav className="w-full px-8 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wide">
          CAS <span className="text-blue-400">Platform</span>
        </div>

        <div className="hidden md:flex gap-8 text-lg">
          <Link href="/upload">Upload Drawings</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/analyze">Analyze</Link>
        </div>
      </nav>

      <main className="flex flex-col items-center text-center flex-1 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold mt-20 leading-tight"
        >
          AI-Powered Construction{" "}
          <span className="text-blue-400">Modernization</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 text-xl max-w-2xl text-gray-300"
        >
          Automate shop drawing analysis, detect issues instantly, streamline
          coordination, and supercharge your construction workflows with AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="flex gap-6 mt-10"
        >
          <Link
            href="/upload"
            className="px-8 py-4 bg-blue-500 text-white rounded-xl text-lg font-semibold hover:bg-blue-600 transition"
          >
            Upload Drawings
          </Link>

          <Link
            href="/dashboard"
            className="px-8 py-4 border border-gray-400 rounded-xl text-lg font-semibold hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full"
        >
          <FeatureCard
            title="Shop Drawing Analyzer"
            desc="AI detects conflicts, missing dimensions, compliance issues, and highlights areas needing attention."
          />
          <FeatureCard
            title="3D & 2D Sync"
            desc="Real-time synchronization of PDF drawings with 3D layouts for instant spatial verification."
          />
          <FeatureCard
            title="Automated Reports"
            desc="Generate AI summaries, RFIs, comparison sheets, and export full structured reports."
          />
        </motion.div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Construction AI Systems — All Rights Reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 hover:bg-gray-800 transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300">{desc}</p>
    </div>
  );
}
