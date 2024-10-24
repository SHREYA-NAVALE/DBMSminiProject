import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import './Navbar.css';
import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <div className="navbar">
            {/* Logo aligned to the left */}
            <div className='logo'>
                <Link to="/">Personal Finances</Link>
            </div>

            {/* Navigation items aligned to the right */}
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><Link to="/budgets">Budgets</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                
                <SignedIn>
                    <li><UserButton /></li> {/* Show UserButton when signed in */}
                </SignedIn>
                
                <SignedOut>
                    <li><SignInButton /></li> {/* Show SignInButton when signed out */}
                </SignedOut>

                
            </ul>
        </div>
    );
};
