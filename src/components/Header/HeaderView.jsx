import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/css/Header.css";

const HeaderView = (props) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-links">
          <Link
            to="/"
            className={isActive("/") ? "nav-link active" : "nav-link"}
          >
            Home
          </Link>
          <Link
            to="/blog"
            className={isActive("/blog") ? "nav-link active" : "nav-link"}
          >
            Blogs
          </Link>
          <div className="logo">
            <span className="logo-text">PM</span>
          </div>
          <a href="#projects" className="nav-link">
            Project
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};

export default HeaderView;
