import React from "react";
import { SiGithub } from "react-icons/si";
import { RiArrowRightLine } from "react-icons/ri";
import Icon from "../icon/Icon";
import "./Card.css";

interface CardProps {
  name: string;
  description: string;
  stack: Array<{
    icon: React.ComponentType;
    name: string;
  }>;
  linkProject: string;
  linkGithub: string;
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

const Card: React.FC<CardProps> = ({
  name,
  description,
  stack,
  linkProject,
  linkGithub,
  colors,
}) => {
  return (
    <div
      className="Card"
      style={{
        backgroundColor: colors.surface,
        color: colors.text,
        border: `1px solid ${colors.accent}`,
      }}
    >
      <h3 className="Card-h3">{name}</h3>
      <p className="Card-description">{description}</p>
      <div className="Card-tech">
        {stack.map((tech, index) => (
          <Icon icon={tech.icon} key={`${tech.name}-${index}`} />
        ))}
      </div>
      <div className="Card-links">
        <a
          href={linkProject}
          rel="noreferrer"
          className="Card-link-project"
          target="_blank"
          style={{ color: colors.accent }}
        >
          View Project <RiArrowRightLine className="Card-icon-arrow" />
        </a>
        <a
          href={linkGithub}
          rel="noreferrer"
          className="Card-link-github"
          target="_blank"
          style={{ color: colors.accent }}
        >
          <SiGithub className="Card-icon-github" />
        </a>
      </div>
    </div>
  );
};

export default Card;
