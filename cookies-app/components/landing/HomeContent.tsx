import Hero from "./Hero";
import Deals from "./Deals";
import Sizes from "./Sizes";
import HowItWorks from "./HowItWorks";
import Flavours from "./Flavours";
import Footer from "./Footer";

export default function HomeContent() {
  return (
    <main>
      <Hero />
      <Deals />
      <Sizes />
      <HowItWorks />
      <Flavours />
      <Footer />
    </main>
  );
}
