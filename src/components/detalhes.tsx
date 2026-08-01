import React from "react";
import { Timeline, Text } from "@mantine/core";
import { RedesSociais } from "./redesSociais";

function Projetos() {
    return (
        <section>
            <Timeline active={3} lineWidth={3}>
                <Timeline.Item title="Indra">
                    <Text>Trabalhei na Indra</Text>
                </Timeline.Item>
                <Timeline.Item title="MPS">
                    <Text>Trabalhei no MPS</Text>
                </Timeline.Item>
                <Timeline.Item title="Minsait">
                    <Text>Trabalhei no Minsait</Text>
                </Timeline.Item>
            </Timeline>
        </section>
    );
}

function Contatos() {
    return (
        <section>
            <RedesSociais />
            <p className="text-slate-400 text-sm mt-4">zaael.dev@gmail.com</p>
            <p className="text-slate-400 text-sm mt-4">
                israelsouto.s@gmail.com
            </p>
            <p>(11) 9 77763646</p>
        </section>
    );
}

function Resumo() {
    const techSkills = [
        { name: ".NET", level: 3 },
        { name: "JS", level: 3 },
        { name: "SQL", level: 3 },
        { name: "WEB/API/MVC", level: 3 },
        { name: "GIT", level: 3 },
        { name: "Azure DevOps", level: 2 },
        { name: "SOLID", level: 2 },
    ];

    const softSkills = [
        { name: "Dedicação", level: 4 },
        { name: "Inglês", level: 3 },
        { name: "Curiosidade", level: 3 },
        { name: "Comunicação", level: 4 },
        { name: "Trabalho em Equipe", level: 3 },
        { name: "Proatividade", level: 3 },
        { name: "CleanCode", level: 2 },
    ];

    return (
        <div className="max-w-2xl text-slate-300 p-8 font-sans leading-relaxed">
            {/* Habilidades */}
            <div className="border-t border-b border-slate-700 py-6">
                <h3 className="text-center text-2xl font-light mb-6 tracking-widest uppercase">
                    Habilidades
                </h3>

                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                    {/* Coluna Tech */}
                    <div className="space-y-2">
                        {techSkills.map((skill) => (
                            <div
                                key={skill.name}
                                className="flex justify-between items-center"
                            >
                                <span className="flex-1 text-right mr-3 font-medium">
                                    {skill.name}
                                </span>
                                <div className="flex gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded-full ${i < skill.level ? "bg-cyan-400" : "bg-white"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Coluna Soft */}
                    <div className="space-y-2">
                        {softSkills.map((skill) => (
                            <div key={skill.name} className="flex items-center">
                                <div className="flex gap-1 mr-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded-full ${i < skill.level ? "bg-cyan-400" : "bg-white"}`}
                                        />
                                    ))}
                                </div>
                                <span className="font-medium">
                                    {skill.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Projetos />
            <Formacao />
        </div>
    );
}

function Formacao() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Formações</h2>
            <div>
                <p>Tecnólogo em Análise e Desenvolvimento de Sistemas</p>
                <p>Facultade Impacta de Tecnologia, 2018-2019</p>
            </div>
        </div>
    );
}

export { Projetos, Contatos, Resumo };
