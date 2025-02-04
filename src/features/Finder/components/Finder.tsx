import { useAppStore } from "@hooks/useAppStore";
import "../styles/Finder.css"; // Ensure you have this file for styling

export default function Finder() {
  const { openApp } = useAppStore(); // ✅ Use store to open PDFViewer

  const files = [
    { name: "Resume.pdf", path: "/docs/Resume.pdf" }, // ✅ Ensure exact casing
    { name: "Project 1", path: "https://github.com/Chrisyhjiang/project1" },
    { name: "Project 2", path: "https://github.com/Chrisyhjiang/project2" },
  ];

  return (
    <div className="finder-container">
      <h2 className="finder-title">Finder</h2>
      <ul className="finder-list">
        {files.map((file) => (
          <li key={file.name} className="finder-item">
            {file.path.startsWith("http") ? (
              <a
                href={file.path}
                target="_blank"
                rel="noopener noreferrer"
                className="finder-link"
              >
                {file.name}
              </a>
            ) : (
              <button
                onClick={() => openApp("PDFViewer", { filePath: file.path })}
                className="finder-button"
              >
                {file.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
