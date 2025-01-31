import { motion } from "framer-motion";

interface AppIconProps {
  name: string;
  icon: string;
  onClick?: () => void;
  link?: string;
}

export default function AppIcon({ name, icon, onClick, link }: AppIconProps) {
  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <motion.img
        src={icon}
        className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
        alt={name}
      />
    </a>
  ) : (
    <motion.img
      src={icon}
      className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
      onClick={onClick}
      alt={name}
    />
  );
}
