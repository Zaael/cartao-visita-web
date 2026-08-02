import Particles from "./particles";

/** Fundo animado da página, atrás do cartão. */
export default function FundoParticulas() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <Particles
        particleColors={["#ffffff"]}
        particleCount={200}
        particleSpread={20}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />
    </div>
  );
}
