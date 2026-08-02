import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Cartao from "../components/cartao";
import Fundo from "../components/particulas";

const IndexPage: React.FC<PageProps> = () => {
    return (
        <div className="flex flex-col h-screen">
            <main className="relative flex flex-col h-screen w-full items-center justify-center">
                <Fundo />
                <Cartao />
            </main>
        </div>
    );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Cartão Visita</title>;
