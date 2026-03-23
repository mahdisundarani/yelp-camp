export default function Footer() {
  return (
    <footer className="mt-auto py-8 glass-panel border-t border-base-border">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} YelpCamp. All rights reserved.</p>
        <p>Built with <span className="text-neon-blue font-semibold text-glow">React</span> and Tailwind</p>
      </div>
    </footer>
  );
}
