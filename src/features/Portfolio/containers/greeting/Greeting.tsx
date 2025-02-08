import React from "react";
import "./Greeting.css";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import { greeting } from "../../portfolio";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FeelingProud from "./FeelingProud";
import { style } from "glamor";

interface GreetingProps {
  theme: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    border: string;
  };
}

export default function Greeting({ theme, colors }: GreetingProps) {
  const styles = style({
    backgroundColor: colors.accent,
    ":hover": {
      boxShadow: `0 5px 15px ${colors.accent}`,
    },
  });

  const buttonStyle = style({
    backgroundColor: colors.accent,
    color: colors.background,
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "180px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 6px 12px ${colors.accent}40`,
    },
  });

  const scrollToContact = () => {
    const element = document.getElementById("contact");
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
  };

  return (
    <motion.div
      className="greet-main"
      id="greeting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="greeting-main">
        <div className="greeting-text-div">
          <div>
            <motion.h1
              className="greeting-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {greeting.title}
            </motion.h1>
            <motion.p
              className="greeting-text-p subTitle"
              style={{ color: colors.secondary }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span>I'm </span>
              <span style={{ color: colors.accent }}>
                {greeting.full_name}.{" "}
              </span>
              {greeting.subTitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <SocialMedia />
            </motion.div>
            <motion.div
              className="portfolio-repo-btn-div"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link {...buttonStyle} to="/desktop">
                View Interactive Desktop 🖥️
              </Link>
            </motion.div>
            <motion.p
              style={{ marginTop: "15px", color: colors.secondary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              (Psst! Click the button to see something cool!)
            </motion.p>
          </div>
        </div>
        <motion.div
          className="greeting-image-div"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <FeelingProud theme={theme} colors={colors} />
        </motion.div>
      </div>
    </motion.div>
  );
}
