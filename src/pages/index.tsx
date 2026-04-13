import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      <h1 className="text-shadow-cyan-600">Cartão de Vista</h1>
      <div className="border-sky-700 border-2 rounded-3xl bg-sky-950 text-white w-full h-full m-40">
        Chega mais
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Cartão Visita</title>;
