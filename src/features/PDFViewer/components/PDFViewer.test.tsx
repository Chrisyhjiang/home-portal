import { render } from "@testing-library/react";
import PDFViewer from "./PDFViewer";

test("renders PDFViewer component", () => {
  // Providing the required 'onClose' prop as a dummy function
  render(<PDFViewer onClose={() => {}} />);
});
