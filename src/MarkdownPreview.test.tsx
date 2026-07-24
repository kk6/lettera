import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownPreview } from "./MarkdownPreview";

describe("MarkdownPreview", () => {
  it("shows the heading", () => {
    render(<MarkdownPreview body="# Hello" />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Hello",
      }),
    ).toBeTruthy();
  });

  it("shows GFM table", () => {
    const body = `
| Name | Value |
| --- | --- |
| Lettera | Editor |
`;

    render(<MarkdownPreview body={body} />);

    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText("Lettera")).toBeTruthy();
  });

  it("does not generate raw HTML as DOM elements", () => {
    const { container } = render(
      <MarkdownPreview
        body={
          '<script>alert("xss")</script><button onclick="alert()">Danger!</button>'
        }
      />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
  });

  it("shows link text but does not generate link element", () => {
    render(<MarkdownPreview body="[Example](https://example.com)" />);

    expect(screen.getByText("Example")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("shows alternate text for image but does not load image element", () => {
    render(
      <MarkdownPreview body="![Lettera logo](https://example.com/logo.png)" />,
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Lettera logo")).toBeTruthy();
  });
});
