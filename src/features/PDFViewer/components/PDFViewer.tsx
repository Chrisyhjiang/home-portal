import React from "react";

interface PDFViewerProps {
  filePath?: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath, onClose }) => {
  if (!filePath || !filePath.endsWith(".pdf")) {
    return (
      <div className="p-4 text-white bg-red-500">No valid PDF selected.</div>
    );
  }

  const correctedPath = filePath.startsWith("/docs/")
    ? filePath
    : `/docs/${filePath.replace(/^\/?public\//, "")}`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#2e2e2e",
      }}
    >
      <iframe
        src={`${correctedPath}#toolbar=0&navpanes=0`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="PDF viewer"
      />
    </div>
  );
};

export default PDFViewer;
