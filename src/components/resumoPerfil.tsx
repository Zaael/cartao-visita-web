import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

function ResumoPerfil() {
    return (
        <div>
            <Avatar />
            <h1>Israel Santos</h1>
            <h2>Analista de Desenvolvedor de Software</h2>
            <div className="text-center mb-8">
                <p className="text-slate-400">27, masculino, casado</p>
                <p className="text-slate-400 text-sm">São Paulo - SP</p>
            </div>
        </div>
    );
}

function Avatar() {
    return (
        <StaticImage
            alt="avatar"
            src="../images/Zael_perfil.jpg"
            className="avatar"
        />
    );
}

function RedesSociais() {
    return (
        <div className="redes-sociais">
            <a href="https://linkedin.com/in/israel-souto">
                <FaLinkedin size={24} />
            </a>
            <a href="https://github.com/israel-souto">
                <FaGithub size={24} />
            </a>
            <a href="https://instagram.com/israel_souto">
                <FaInstagram size={24} />
            </a>
        </div>
    );
}

export default ResumoPerfil;
