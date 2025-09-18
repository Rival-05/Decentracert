import { Cards } from "./components/cards";
import { Container } from "./components/container";
import { Hero } from "./components/hero";
import { Steps } from "./components/steps";

export default function Home() {
  return (
    <div className="selection:bg-primary/20 relative min-h-screen w-full">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)",
        }}
      />
      <Container>
        <Hero />
        <Cards />
        <Steps />
      </Container>
    </div>
  );
}
