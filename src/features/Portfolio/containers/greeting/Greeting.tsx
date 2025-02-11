import "./Greeting.css";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import { greeting } from "../../portfolio";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FeelingProud from "./FeelingProud";
import { style } from "glamor";
import { TypeAnimation } from "react-type-animation";

interface SubtitleConfig {
  highlightWords: string[];
  highlightPhrases: string[];
  accentColor: string;
}

export const parseSubtitle = (text: string, config: SubtitleConfig) => {
  const tokens = text.split(" ");
  const result = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const cleanToken = token.toLowerCase().replace(/[.,!?]$/, "");

    // Check for phrases (like "University of Waterloo")
    const phraseMatch = config.highlightPhrases.find((phrase) => {
      const words = phrase.toLowerCase().split(" ");
      return (
        tokens
          .slice(i, i + words.length)
          .map((t) => t.toLowerCase().replace(/[.,!?]$/, ""))
          .join(" ") === phrase.toLowerCase()
      );
    });

    if (phraseMatch) {
      const words = phraseMatch.split(" ");
      result.push(
        <span style={{ color: config.accentColor }}>
          {tokens.slice(i, i + words.length).join(" ")}
        </span>
      );
      i += words.length - 1;
      continue;
    }

    // Check for individual highlighted words
    if (config.highlightWords.includes(cleanToken)) {
      result.push(<span style={{ color: config.accentColor }}>{token}</span>);
    } else {
      result.push(token);
    }

    // Add space after each token except the last one
    if (i < tokens.length - 1) {
      result.push(" ");
    }
  }

  return [result.join("")]; // Return as a single string in an array
};

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

// export default function Greeting({ theme, colors }: GreetingProps) {
//   return (
//     <motion.div
//       className="greet-main"
//       id="greeting"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1 }}
//     >
//       <div className="greeting-main">
//         <div className="greeting-text-div">
//           <div>
//             <motion.p
//               className="greeting-text-p subTitle"
//               style={{ color: colors.secondary }}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4, duration: 0.8 }}
//             >
//               <span>I'm </span>
//               <span style={{ color: colors.accent }}>
//                 {greeting.full_name}.{" "}
//               </span>
//               <TypeAnimation
//                 sequence={[
//                   greeting.subTitle,
//                   1000, // Waits 1s before starting
//                 ]}
//                 wrapper="span"
//                 speed={50} // Typing speed in milliseconds
//                 style={{ color: colors.secondary }}
//                 repeat={1}
//               />
//             </motion.p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

export default function Greeting({ theme, colors }: GreetingProps) {
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
              {/* {greeting.subTitle} */}
              {/* Split and style specific words */}

              <TypeAnimation
                sequence={[greeting.subTitle, 1000]}
                wrapper="span"
                speed={50} // Typing speed in milliseconds
                style={{ color: colors.secondary }}
                repeat={1}
              />

              {/* {greeting.subTitle.split(" ").map((word, index, array) => {
                // Clean the word by removing punctuation and converting to lowercase
                const cleanWord = word.toLowerCase().replace(/[.,!?]$/, "");

                // Check for multi-word phrases
                const checkPhrase = (startIndex: number, words: string[]) => {
                  const phrase = words
                    .slice(startIndex, startIndex + 3)
                    .join(" ")
                    .toLowerCase();
                  return phrase === "university of waterloo";
                };

                // Highlight multi-word university name
                if (
                  cleanWord === "university" &&
                  index + 2 < array.length &&
                  checkPhrase(index, array)
                ) {
                  return (
                    <span key={index} style={{ color: colors.accent }}>
                      {word + " " + array[index + 1] + " " + array[index + 2]}{" "}
                    </span>
                  );
                }

                // Skip the next two words if they're part of "University of Waterloo"
                if (
                  (index > 0 &&
                    array[index - 1].toLowerCase() === "university" &&
                    cleanWord === "of") ||
                  (index > 1 &&
                    array[index - 2].toLowerCase() === "university" &&
                    array[index - 1].toLowerCase() === "of" &&
                    cleanWord === "waterloo")
                ) {
                  return null;
                }

                // Original single word highlighting
                return cleanWord === "cresta" || cleanWord === "defang" ? (
                  <span key={index} style={{ color: colors.accent }}>
                    {word}{" "}
                  </span>
                ) : (
                  <span key={index}>{word} </span>
                );
              })} */}
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
