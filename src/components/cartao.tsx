import React from "react";
import ResumoPerfil from "./resumoPerfil";
import NavMenu from "./nav-menu";
import { Resumo, Contatos } from "./detalhes";

const Cartao: React.FC = () => {
    return (
        <div className="card-border">
            <div className="card flex flex-row h-full">
                <aside className="border-r border-gray-700 pr-2">
                    <ResumoPerfil />
                </aside>
                <div className="flex flex-1 flex-col">
                    <header className="p-4">
                        <NavMenu />
                    </header>
                    <main className="flex-1 flex justify-center items-center overflow-hidden">
                        <Resumo />
                        {/*<Contatos />*/}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Cartao;
