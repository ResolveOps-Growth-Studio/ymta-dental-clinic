import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import ImplantSpotlight from '../components/ImplantSpotlight';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <ImplantSpotlight />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Footer />

    </>
  );
}
