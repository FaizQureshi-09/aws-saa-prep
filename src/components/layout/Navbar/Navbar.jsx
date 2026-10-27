import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { navigationLinks } from '../../../data/navigationData';
import { useTheme } from '../../../hooks/useTheme';
import './Navbar.css';

/**
 * Fixed Squid-Ink top navigation bar with route-aware active links, a
 * light/dark theme toggle and a slide-down mobile menu for small viewports.
 */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMobileMenu}>
          <span className="navbar__brand-mark">SAA</span>
          <span className="navbar__brand-text">
            AWS <strong>Prep Suite</strong>
          </span>
        </Link>

        <nav
          className={`navbar__nav ${isMobileMenuOpen ? 'navbar__nav--open' : ''}`}
          aria-label="Primary"
        >
          <ul className="navbar__links">
            {navigationLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__icon-button"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          <button
            type="button"
            className="navbar__icon-button navbar__toggle"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((previous) => !previous)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}
