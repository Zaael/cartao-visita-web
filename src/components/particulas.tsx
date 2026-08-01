import React from "react";
import Particles from "../component/Particles";

const Fundo: React.FC = () => (
  <div className="fixed inset-0 -z-10">
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
      className={""}
    />
  </div>
);

export default Fundo;
