import React from "react";
import ResumoPerfil from "./resumoPerfil";
import NavMenu from "./nav-menu";

const Cartao: React.FC = () => {
    return (
        <div className="card-border">
            <div className="card flex flex-col h-full">
                <header className="">
                    <NavMenu />
                </header>
                <main className="flex flex-1 overflow-hidden">
                    <aside>
                        <ResumoPerfil />
                    </aside>
                    <div className="flex-1 justify-center items-center">
                        <p>Teste conteudo</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Cartao;
