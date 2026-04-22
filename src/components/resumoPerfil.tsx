import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

function ResumoPerfil() {
    return (
        <div>
            <Avatar />
            <h1>Israel Souto</h1>
            <h2>Engenheiro de Software</h2>
            <RedesSociais />
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
                <FaLinkedin />
            </a>
            <a href="https://github.com/israel-souto">
                <FaGithub />
            </a>
            <a href="https://instagram.com/israel_souto">
                <FaInstagram />
            </a>
        </div>
    );
}

export default ResumoPerfil;
