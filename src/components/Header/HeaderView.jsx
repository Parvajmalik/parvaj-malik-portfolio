import React from "react";
import { NavLink } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";

const HeaderView = () => {
  const data = usePortfolio();
  if (!data) return null;

  const { site, header } = data;
  const midpoint = Math.floor(header.navLinks.length / 2);

  return (
    <header className="sticky-top pt-3 px-3" style={{ zIndex: 1000 }}>
      <nav className="d-flex justify-content-center align-items-center rounded-pill px-4 py-2 mx-auto nav-pill-wrap justify-content-evenly">
        {header.navLinks.map((link, i) => (
          <React.Fragment key={link.label}>
            {i === midpoint && (
              <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold mx-3 header-logo">
                {site.initials}
              </div>
            )}
            <NavLink
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `text-decoration-none fw-medium px-4 py-2 rounded-pill ${isActive ? "nav-pill-active" : "nav-pill-inactive"}`
              }
            >
              {link.label}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>
    </header>
  );
};

export default HeaderView;