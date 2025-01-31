import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function Terminal() {
  const [output, setOutput] = useState<string[]>(["Welcome to Terminal"]);
  const [input, setInput] = useState("");
  const { openApp } = useAppStore();

  const commands = {
    ls: () => "Resume.pdf  Project1  Project2",
    clear: () => {
      setOutput([]);
      return "";
    },
    help: () =>
      "Available commands:\n- ls (List files)\n- show <file> (View PDF files)\n- clear (Clear terminal)\n- help (Show this help message)",
  };

  const handleCommand = (event: React.FormEvent) => {
    event.preventDefault();
    let newOutput = [...output, `> ${input}`];
  
    const args = input.split(" ");
    const command = args[0];
  
    if (command === "show" && args[1]?.endsWith(".pdf")) {
      const filePath = `/docs/${args[1]}`; // Ensure the case matches the actual file name
      console.log("Opening PDF:", filePath); // Debugging
      newOutput.push(`Opening ${args[1]}...`);
      openApp("PDFViewer", { filePath });
    } else if (commands[command]) {
      newOutput.push(commands[command]());
    } else {
      newOutput.push("Command not found. Type 'help' for a list of commands.");
    }
  
    setOutput(newOutput);
    setInput("");
  };

  return (
    <div className="p-4 bg-black text-green-400 font-mono w-full h-full overflow-auto">
      {output.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <form onSubmit={handleCommand} className="mt-2">
        <span>$ </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-black border-none outline-none text-green-400 w-full"
          autoFocus
        />
      </form>
    </div>
  );
}
