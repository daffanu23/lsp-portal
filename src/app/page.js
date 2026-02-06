import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventList from '@/components/EventList';
import NewsList from '@/components/NewsList';
import TestimonialList from '@/components/TestimonialList';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <EventList />
      <NewsList />
      <TestimonialList />
    </main>
  );
}