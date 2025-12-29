/**
 * Unit Tests for Helper Functions
 *
 * Tests for utility functions in src/lib/helpers.ts and src/lib/utils.ts
 */

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
import {
  convertCanvasToPdfCoordinates,
  convertPdfToCanvasCoordinates,
  clampPosition,
  calculateRelativePosition,
} from "@/lib/helpers";

describe("cn function", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", true && "baz")).toBe("foo baz");
  });

  it("merges Tailwind classes with tailwind-merge", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
});

describe("coordinate conversion functions", () => {
  const mockCanvas = {
    width: 800,
    height: 600,
  } as unknown as HTMLCanvasElement;

  describe("convertCanvasToPdfCoordinates", () => {
    it("converts canvas coordinates to PDF coordinates", () => {
      const canvasPosition = { x: 100, y: 100 };
      const result = convertCanvasToPdfCoordinates(
        canvasPosition,
        mockCanvas,
        1.5,
        { width: 400, height: 150 }
      );

      expect(result.x).toBeCloseTo(66.67, 2);
      expect(result.y).toBeCloseTo(233.33, 2);
    });

    it("handles scale factor correctly", () => {
      const canvasPosition = { x: 100, y: 100 };
      const result1 = convertCanvasToPdfCoordinates(
        canvasPosition,
        mockCanvas,
        1.0,
        { width: 400, height: 150 }
      );

      const result2 = convertCanvasToPdfCoordinates(
        canvasPosition,
        mockCanvas,
        2.0,
        { width: 400, height: 150 }
      );

      expect(result1.x).toBe(100);
      expect(result2.x).toBe(50);
    });
  });

  describe("convertPdfToCanvasCoordinates", () => {
    it("converts PDF coordinates to canvas coordinates", () => {
      const pdfPosition = { x: 66.67, y: 233.33, width: 266.67, height: 100 };
      const result = convertPdfToCanvasCoordinates(
        pdfPosition,
        mockCanvas,
        1.5
      );

      expect(result.x).toBeCloseTo(100, 2);
      expect(result.y).toBeCloseTo(100, 2);
    });
  });

  describe("clampPosition", () => {
    it("clamps position within bounds", () => {
      const position = { x: 50, y: 50 };
      const result = clampPosition(position, 800, 600, 100, 100);

      expect(result.x).toBe(50);
      expect(result.y).toBe(50);
    });

    it("clamps position at minimum bounds", () => {
      const position = { x: -10, y: -10 };
      const result = clampPosition(position, 800, 600, 100, 100);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it("clamps position at maximum bounds", () => {
      const position = { x: 900, y: 700 };
      const result = clampPosition(position, 800, 600, 100, 100);

      expect(result.x).toBe(700);
      expect(result.y).toBe(500);
    });
  });

  describe("calculateRelativePosition", () => {
    it("calculates position relative to container", () => {
      const containerRect = new DOMRect(100, 100, 400, 400);

      const result = calculateRelativePosition(150, 150, containerRect, 0, 0);

      expect(result.x).toBe(50);
      expect(result.y).toBe(50);
    });

    it("accounts for offset", () => {
      const containerRect = new DOMRect(100, 100, 400, 400);

      const result = calculateRelativePosition(150, 150, containerRect, 10, 10);

      expect(result.x).toBe(40);
      expect(result.y).toBe(40);
    });
  });
});
