import React from "react";
import {
    HiHome,
    HiMiniPhone,
    HiIdentification,
    HiAcademicCap,
} from "react-icons/hi2";

function NavMenu() {
    return (
        <nav className="nav-menu">
            <ul className="lista-menu">
                <NavItem>
                    <HiHome size={24} />
                </NavItem>
                <NavItem>
                    <HiIdentification size={24} />
                </NavItem>
                <NavItem>
                    <HiMiniPhone size={24} />
                </NavItem>
                <NavItem>
                    <HiAcademicCap size={24} />
                </NavItem>
            </ul>
        </nav>
    );
}

function NavItem({ children }: { children: React.ReactNode }) {
    return (
        <li>
            <a href="#">{children}</a>
        </li>
    );
}

export default NavMenu;
