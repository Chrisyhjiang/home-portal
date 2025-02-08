import { render } from "@testing-library/react";
import Window from "./Window";
import Finder from "../../Finder/components/Finder";
import Dock from "../../Dock/components/Dock";

test("renders Window component", () => {
  render(
    <Window
      title="Test Window"
      isVisible={true}
      onClose={() => {}}
      onMinimize={() => {}}
      windowId="test-window"
    >
      <div>Window Content</div>
    </Window>
  );
  // Add more specific tests here
});

test("renders Finder component", () => {
  render(<Finder />);
});

test("renders Dock component", () => {
  render(<Dock openApp={() => {}} />);
});
