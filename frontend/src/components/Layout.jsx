import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
