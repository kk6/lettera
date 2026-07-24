import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  it("shows only the Source editor by default", () => {
    render(<App />);
    expect(screen.getByRole("textbox", { name: "text body" })).toBeTruthy();
    expect(screen.queryByLabelText("Markdown Preview")).toBeNull();
  });

  it("displays the same preview text when switching to Split", () => {
    render(<App />);

    fireEvent.change(screen.getByRole("textbox", { name: "text body" }), {
      target: { value: "# Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Split" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Hello" }),
    ).toBeTruthy();
  });

  it("returns to Source when the Split toggle is pressed again", () => {
    render(<App />);

    const splitToggle = screen.getByRole("button", { name: "Split" });

    fireEvent.click(splitToggle);

    expect(screen.getByLabelText("Markdown Preview").tagName).toBe("SECTION");

    fireEvent.click(splitToggle);

    expect(screen.queryByLabelText("Markdown Preview")).toBeNull();
  });

  it("preserves the source text after switching to Split and back", () => {
    render(<App />);

    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "text body",
    });
    const splitToggle = screen.getByRole("button", { name: "Split" });

    fireEvent.change(editor, {
      target: { value: "# Preserved text" },
    });

    fireEvent.click(splitToggle);
    fireEvent.click(splitToggle);

    const sourceEditor = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "text body",
    });

    expect(sourceEditor.value).toBe("# Preserved text");
  });

  it("will be updated when the source text is changed in Split mode", () => {
    render(<App />);

    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "text body",
    });
    const splitToggle = screen.getByRole("button", { name: "Split" });

    fireEvent.click(splitToggle);

    fireEvent.change(editor, {
      target: { value: "# Updated text" },
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Updated text" }),
    ).toBeTruthy();
  });

  it("does not error when switching to Split with empty source text", () => {
    render(<App />);

    const splitToggle = screen.getByRole("button", { name: "Split" });

    fireEvent.click(splitToggle);

    expect(screen.getByLabelText("Markdown Preview").tagName).toBe("SECTION");
  });

  it("keeps the source text when incomplete Markdown is entered", () => {
    render(<App />);

    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "text body",
    });
    const splitToggle = screen.getByRole("button", { name: "Split" });
    const incompleteMarkdown = "# Heading\n\n**unclosed emphasis";

    fireEvent.change(editor, {
      target: { value: incompleteMarkdown },
    });

    fireEvent.click(splitToggle);

    expect(editor.value).toBe(incompleteMarkdown);
    expect(
      screen.getByRole("heading", { level: 1, name: "Heading" }),
    ).toBeTruthy();
    expect(screen.getByText("**unclosed emphasis")).toBeTruthy();
    expect(screen.getByLabelText("Markdown Preview")).toBeTruthy();
  });

  it("does not generate a link for a dangerous URL", () => {
    render(<App />);

    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "text body",
    });
    const splitToggle = screen.getByRole("button", { name: "Split" });
    const maliciousMarkdown = "[Danger](javascript:alert('xss'))";

    fireEvent.change(editor, {
      target: { value: maliciousMarkdown },
    });

    fireEvent.click(splitToggle);

    expect(screen.getByText("Danger").textContent).toBe("Danger");
    expect(screen.queryByRole("link", { name: "Danger" })).toBeNull();

    const preview = screen.getByLabelText("Markdown Preview");
    expect(preview.querySelector("[href]")).toBeNull();
  });
});
