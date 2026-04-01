export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Buflo AI</h3>
          <p className="text-slate-500 text-sm">
            Smart learning platform for students and teachers.
          </p>
        </div>

        <p className="text-slate-500 text-sm">
          © 2026 Buflo AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}