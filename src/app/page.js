import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventList from '@/components/EventList';
import NewsList from '@/components/NewsList';
import TestimoniList from '@/components/TestimoniList'; // <--- Baru
import Footer from '@/components/Footer';               // <--- Baru

export default function Home() {
  return (
    <main>
      <Navbar />
      
      <Hero />
      <EventList />
      <NewsList />
      <TestimoniList />
      
      <Footer />
    </main>
  );
}