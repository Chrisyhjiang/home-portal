import React from "react";
import { work } from "../../portfolio";
import Card from "../../components/card/Card";
import "./Projects.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface ProjectsProps {
  theme: {
    body: string;
    text: string;
    highlight: string;
    dark: string;
    secondaryText: string;
    accentColor: string;
    accentBright: string;
    projectCard: string;
    name: string;
  };
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
    slidesToSlide: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const Projects: React.FC<ProjectsProps> = ({ theme }) => {
  const colors = {
    background: theme.body,
    text: theme.text,
    primary: theme.highlight,
    secondary: theme.secondaryText,
    accent: theme.accentColor,
    surface: theme.projectCard,
    border: theme.dark,
  };

  return (
    <section className="Project section" id="project">
      <div className="container">
        <h2 className="Project-h2 section-head" style={{ color: theme.text }}>
          Projects
        </h2>
        <div className="Project-wrapper">
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={2000}
            infinite={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {work.map((project, index) => (
              <div key={`${project.name}-${index}`}>
                <Card
                  name={project.name}
                  description={project.description}
                  stack={project.stack}
                  linkProject={project.linkProject}
                  linkGithub={project.linkGithub}
                  theme={theme.name}
                  colors={colors}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Projects;
