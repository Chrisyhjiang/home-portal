import React from "react";
import { experiences } from "../../portfolio";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "./Experience.css";

interface ExperienceProps {
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

const Experience: React.FC<ExperienceProps> = ({ colors }) => {
  return (
    <section className="Experience section" id="experience">
      <div className="container">
        <h2
          className="Experience-h2 section-head"
          style={{ color: colors.text }}
        >
          Experience
        </h2>
        <div className="Experience-wrapper">
          <VerticalTimeline lineColor={colors.text}>
            {experiences.map((experience, index) => (
              <VerticalTimelineElement
                key={`${experience.Company}-${index}`}
                date={`${experience.StartDate} - ${experience.EndDate}`}
                dateClassName="date-style"
                iconStyle={{
                  background: colors.accent,
                  color: colors.background,
                }}
                icon={
                  <img
                    alt=""
                    src={experience.Icon}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                }
                contentStyle={{
                  background: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.accent}`,
                }}
                contentArrowStyle={{
                  borderRight: `7px solid ${colors.accent}`,
                }}
              >
                <h3 className="vertical-timeline-element-title">
                  {experience.Role}, {experience.Company}
                </h3>
                <h4 className="vertical-timeline-element-subtitle">
                  {experience.Location}
                </h4>
                <ul>
                  {experience.Description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </section>
  );
};

export default Experience;
