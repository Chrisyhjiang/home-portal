import { useAppStore } from "../store/useAppStore";

export default function Finder() {
  const { openApp } = useAppStore(); // ✅ Use store to open PDFViewer

  const files = [
    { name: "Resume.pdf", path: "/docs/Resume.pdf" }, // ✅ Ensure exact casing
    { name: "Project 1", path: "https://github.com/Chrisyhjiang/project1" },
    { name: "Project 2", path: "https://github.com/Chrisyhjiang/project2" },
  ];

  return (
    <div className="p-4 bg-gray-800 text-white w-full h-full">
      <h2 className="text-xl font-bold">Finder</h2>
      <ul className="mt-4">
        {files.map((file) => (
          <li key={file.name} className="mt-2">
            {file.path.startsWith("http") ? (
              // ✅ External links open in new tab
              <a
                href={file.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {file.name}
              </a>
            ) : (
              // ✅ Open PDF inside the app
              <button
                onClick={() => openApp("PDFViewer", { filePath: file.path })}
                className="text-blue-400 hover:underline"
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
