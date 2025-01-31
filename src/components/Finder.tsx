import { useEffect, useState } from "react";

export default function Finder() {
  const [files, setFiles] = useState([
    { name: "Resume.pdf", link: "/docs/resume.pdf" },
    { name: "Project 1", link: "https://github.com/Chrisyhjiang/project1" },
    { name: "Project 2", link: "https://github.com/Chrisyhjiang/project2" }
  ]);

  return (
    <div className="p-4 bg-gray-800 text-white w-full h-full">
      <h2 className="text-xl font-bold">Finder</h2>
      <ul className="mt-4">
        {files.map((file) => (
          <li key={file.name} className="mt-2">
            <a href={file.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
