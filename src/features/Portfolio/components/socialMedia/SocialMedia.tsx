import React from "react";
import { social } from "../../portfolio";
import "./SocialMedia.css";

const SocialMedia: React.FC = () => {
  return (
    <div className="social-media">
      {social.map((platform, index) => (
        <a
          key={index}
          href={platform.link}
          className="social-media-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit my ${platform.name}`}
        >
          {platform.name}
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
