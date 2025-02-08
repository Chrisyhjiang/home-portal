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
        src="/illustrations/feeling_proud.svg"
        alt="Developer illustration"
        style={{
          maxWidth: "100%",
          height: "auto",
          filter: theme === "dark" ? "brightness(0.8)" : "none",
        }}
      />
    </div>
  );
};

export default FeelingProud;
