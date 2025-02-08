import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import Greeting from "../greeting/Greeting";
import Projects from "../projects/Projects";
import Experience from "../experience/Experience";
import Contact from "../contact/Contact";
import { useTheme } from "../../../../context/ThemeContext";
import { motion } from "framer-motion";
import "./Main.css";

const Main: React.FC = () => {
  const { colors, theme } = useTheme();

  useEffect(() => {
    document.body.classList.add(`theme-${theme}`);
    return () => {
      document.body.classList.remove(`theme-${theme}`);
    };
  }, [theme]);

  // Handle initial hash navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.slice(1); // Remove the # from the hash
      setTimeout(() => {
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
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }, []);

  if (!colors || !theme) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const projectsTheme = {
    body: colors.background,
    text: colors.text,
    highlight: colors.primary,
    dark: colors.surface,
    secondaryText: colors.secondary,
    accentColor: colors.accent,
    accentBright: colors.accent,
    projectCard: colors.surface,
    name: colors.primary,
  };

  return (
    <div>
      <Header />
      <main className="portfolio-main">
        <div className="main" style={{ backgroundColor: colors.background }}>
          <motion.section
            id="greeting"
            className="section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Greeting theme={theme} colors={colors} />
          </motion.section>
          <motion.section
            id="projects"
            className="section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Projects theme={projectsTheme} />
          </motion.section>
          <motion.section
            id="experience"
            className="section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Experience colors={colors} />
          </motion.section>
          <motion.section
            id="contact"
            className="section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Contact theme={theme} colors={colors} />
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Main;
