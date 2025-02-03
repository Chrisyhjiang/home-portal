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
    <div className="w-full h-full">
      {/* PDF Viewer */}
      <iframe
        src={`${correctedPath}#zoom=175&view=FitH&toolbar=0&navpanes=0&scrollbar=0&page=1`}
        className="w-full h-full border-none"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
