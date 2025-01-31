interface PDFViewerProps {
  filePath?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath }) => {
  if (!filePath || !filePath.endsWith(".pdf")) {
    return <div className="p-4 text-white bg-red-500">No valid PDF selected.</div>;
  }

  // 🔹 Ensure correct path for Vite's public folder
  const correctedPath = filePath.startsWith("/public")
    ? filePath
    : `/public${filePath}`;

  console.log("Rendering PDFViewer with corrected path:", correctedPath);

  return (
    <iframe
      src={correctedPath}
      className="w-full h-full border-none bg-white"
      title="PDF Viewer"
      style={{ minHeight: "90vh", minWidth: "90vw" }} // ✅ Ensure full screen
    />
  );
};

export default PDFViewer;
