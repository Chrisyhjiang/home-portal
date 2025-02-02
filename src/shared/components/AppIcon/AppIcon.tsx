import { motion } from "framer-motion";

interface AppIconProps {
  name: string;
  icon: string;
  onClick?: () => void;
  link?: string;
}

export default function AppIcon({ name, icon, onClick, link }: AppIconProps) {
  return (
    <div className="icon-wrapper" onClick={onClick}>
      <motion.img src={icon} className="icon-image" alt={name} />
    </div>
  );
}
