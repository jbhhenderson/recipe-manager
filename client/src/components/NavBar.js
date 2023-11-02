import { useState } from "react";
import { NavLink as RRNavLink } from "react-router-dom";
import {
Button,
Collapse,
Nav,
NavLink,
NavItem,
Navbar,
NavbarBrand,
NavbarToggler,
} from "reactstrap";
import { logout } from "../managers/authManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
const [open, setOpen] = useState(false);

const toggleNavbar = () => setOpen(!open);

return (
    <div>
    <Navbar color="light" light fixed="true" expand="lg">
        <NavbarBrand className="mr-auto" tag={RRNavLink} to="/">
        🍳🔪Recipe Manager
        </NavbarBrand>
        {loggedInUser ? (
        <>
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={open} navbar>
            <Nav navbar>
                <NavItem onClick={() => setOpen(false)}>
                    <NavLink tag={RRNavLink} to="/recipes">
                    All Recipes
                    </NavLink>
                </NavItem>
                <NavItem onClick={() => setOpen(false)}>
                    <NavLink tag={RRNavLink} to="/my-recipes">
                    My Recipes
                    </NavLink>
                </NavItem>
                <NavItem onClick={() => setOpen(false)}>
                    <NavLink tag={RRNavLink} to="/recipes/favorites">
                    Favorite Recipes
                    </NavLink>
                </NavItem>
                <NavItem onClick={() => setOpen(false)}>
                    <NavLink tag={RRNavLink} to="/my-pantry">
                    My Pantry
                    </NavLink>
                </NavItem>
                <NavItem onClick={() => setOpen(false)}>
                    <NavLink tag={RRNavLink} to="/my-shopping-list">
                    My Shopping List
                    </NavLink>
                </NavItem>
                <NavItem onClick={() => setOpen(false)}>
                    <NavLink tag={RRNavLink} to="/create-recipe">
                    Create Recipe
                    </NavLink>
                </NavItem>
            </Nav>
            </Collapse>
            <Button
            outline
            color="primary"
            onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                logout().then(() => {
                setLoggedInUser(null);
                setOpen(false);
                });
            }}
            >
            Logout
            </Button>
        </>
        ) : (
        <Nav navbar>
            <NavItem>
            <NavLink tag={RRNavLink} to="/login">
                <Button color="primary">Login</Button>
            </NavLink>
            </NavItem>
        </Nav>
        )}
    </Navbar>
    </div>
);
}