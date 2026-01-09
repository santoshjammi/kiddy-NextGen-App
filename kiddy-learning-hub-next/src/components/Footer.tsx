export function Footer() {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-white/80">
            © 2024 Kiddy Learning Hub. Educational games for children ages 3-6.
          </p>
          <div className="mt-3 space-x-6">
            <a href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}