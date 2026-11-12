import { BackToTop } from './components/layout/BackToTop';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Experiences } from './components/sections/Experiences';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { useLenis } from './hooks/useLenis';

export default function App() {
  useLenis();

  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Navbar />
      <main id="contenu" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experiences />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
