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
      <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-800 shadow-md">
        <motion.img
          src={icon} // ✅ Use `icon`, not `app.icon`
          className="w-12 h-12 rounded-full"
          alt={name} // ✅ Use `name`, not `app.name`
        />
      </div>
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
