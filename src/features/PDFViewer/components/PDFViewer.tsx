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
      {/* Close Button */}
      <div className="absolute top-2 left-2 flex gap-2 z-50">
        <button
          onClick={onClose}
          className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          ⨉
        </button>
      </div>

      {/* PDF Viewer */}
      <iframe
        src={correctedPath}
        className="w-full h-full border-none"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
