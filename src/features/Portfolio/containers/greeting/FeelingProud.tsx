import React from "react";

interface FeelingProudProps {
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

const FeelingProud: React.FC<FeelingProudProps> = ({ theme }) => {
  return (
    <div className="feeling-proud-illustration">
      <img
        src="/illustrations/chris.png"
        alt="Developer illustration"
        style={{
          maxWidth: "250px",
          width: "100%",
          height: "auto",
          filter: theme === "dark" ? "brightness(0.8)" : "none",
          borderRadius: "50%", // Makes it circular
          aspectRatio: "3/4", // Makes it oval (adjust ratio as needed)
          objectFit: "cover", // Ensures the image covers the container
        }}
      />
    </div>
  );
};

export default FeelingProud;
