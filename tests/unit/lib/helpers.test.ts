import { describe, it, expect } from "vitest";
import {
  clampPosition,
  calculateRelativePosition,
  PDF_SCALE,
  type CanvasPosition,
} from "@/lib/helpers";

describe("clampPosition", () => {
  it("keeps position within bounds", () => {
    const position: CanvasPosition = { x: 100, y: 200 };
    const containerWidth = 800;
    const containerHeight = 600;
    const signatureWidth = 200;
    const signatureHeight = 100;

    const result = clampPosition(
      position,
      containerWidth,
      containerHeight,
      signatureWidth,
      signatureHeight
    );

    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it("clamps position when exceeding max X", () => {
    const position: CanvasPosition = { x: 700, y: 200 };
    const containerWidth = 800;
    const containerHeight = 600;
    const signatureWidth = 200;
    const signatureHeight = 100;

    const result = clampPosition(
      position,
      containerWidth,
      containerHeight,
      signatureWidth,
      signatureHeight
    );

    expect(result.x).toBe(600); // 800 - 200
    expect(result.y).toBe(200);
  });

  it("clamps position when exceeding max Y", () => {
    const position: CanvasPosition = { x: 100, y: 550 };
    const containerWidth = 800;
    const containerHeight = 600;
    const signatureWidth = 200;
    const signatureHeight = 100;

    const result = clampPosition(
      position,
      containerWidth,
      containerHeight,
      signatureWidth,
      signatureHeight
    );

    expect(result.x).toBe(100);
    expect(result.y).toBe(500); // 600 - 100
  });

  it("clamps negative X to 0", () => {
    const position: CanvasPosition = { x: -10, y: 200 };
    const containerWidth = 800;
    const containerHeight = 600;
    const signatureWidth = 200;
    const signatureHeight = 100;

    const result = clampPosition(
      position,
      containerWidth,
      containerHeight,
      signatureWidth,
      signatureHeight
    );

    expect(result.x).toBe(0);
    expect(result.y).toBe(200);
  });

  it("clamps negative Y to 0", () => {
    const position: CanvasPosition = { x: 100, y: -10 };
    const containerWidth = 800;
    const containerHeight = 600;
    const signatureWidth = 200;
    const signatureHeight = 100;

    const result = clampPosition(
      position,
      containerWidth,
      containerHeight,
      signatureWidth,
      signatureHeight
    );

    expect(result.x).toBe(100);
    expect(result.y).toBe(0);
  });
});

describe("calculateRelativePosition", () => {
  it("calculates relative position from client coordinates", () => {
    const clientX = 500;
    const clientY = 400;
    const containerRect = { left: 100, top: 50 } as DOMRect;
    const offsetX = 20;
    const offsetY = 30;

    const result = calculateRelativePosition(
      clientX,
      clientY,
      containerRect,
      offsetX,
      offsetY
    );

    expect(result.x).toBe(380); // 500 - 100 - 20
    expect(result.y).toBe(320); // 400 - 50 - 30
  });

  it("handles zero offsets", () => {
    const clientX = 500;
    const clientY = 400;
    const containerRect = { left: 100, top: 50 } as DOMRect;
    const offsetX = 0;
    const offsetY = 0;

    const result = calculateRelativePosition(
      clientX,
      clientY,
      containerRect,
      offsetX,
      offsetY
    );

    expect(result.x).toBe(400); // 500 - 100
    expect(result.y).toBe(350); // 400 - 50
  });
});

describe("PDF_SCALE", () => {
  it("has correct scale factor", () => {
    expect(PDF_SCALE).toBe(1.5);
  });
});
