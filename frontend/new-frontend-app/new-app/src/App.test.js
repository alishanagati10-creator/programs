import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Coding Platform heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Coding Platform/i);
  expect(headingElement).toBeInTheDocument();
});
