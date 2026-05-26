import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Cases } from '@/components/sections/Cases';
import { Process } from '@/components/sections/Process';
import { TechStack } from '@/components/sections/TechStack';
import { ContactForm } from '@/components/sections/ContactForm';

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Cases />
      <Process />
      <TechStack />
      <ContactForm />
    </>
  );
}
