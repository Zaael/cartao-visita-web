import React from "react";
import { HiHome, HiMiniPhone, HiIdentification } from "react-icons/hi2";

function NavMenu() {
    return (
        <nav className="nav-menu">
            <ul className="lista-menu">
                <NavItem>
                    <HiHome />
                </NavItem>
                <NavItem>
                    <HiIdentification />
                </NavItem>
                <NavItem>
                    <HiMiniPhone />
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

function IconButton({ children }: { children: React.ReactNode }) {
    return <button>{children}</button>;
}

export default NavMenu;
