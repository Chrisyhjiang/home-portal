import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Header.css";

const Header: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", colors.surface]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash without triggering scroll
      window.history.pushState(null, "", `#${sectionId}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        className={`portfolio-header ${isScrolled ? "scrolled" : ""}`}
        style={{
          backgroundColor: headerBackground,
          borderBottom: isScrolled ? `1px solid ${colors.border}` : "none",
        }}
      >
        <div className="header-content">
          <h1 className="logo" style={{ color: colors.text }}>
            CJ
          </h1>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: colors.text }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <button
              onClick={() => scrollToSection("greeting")}
              style={{ color: colors.text }}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              style={{ color: colors.text }}
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              style={{ color: colors.text }}
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              style={{ color: colors.text }}
            >
              Contact Me
            </button>
            <button
              onClick={() => window.open("/docs/Resume.pdf", "_blank")}
              style={{ color: colors.text }}
            >
              Resume
            </button>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
          </nav>
        </div>
      </motion.header>
      <div className={`mobile-overlay ${isMenuOpen ? "open" : ""}`} />
    </>
  );
};

export default Header;
