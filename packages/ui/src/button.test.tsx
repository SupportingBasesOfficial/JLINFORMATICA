// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

/**
 * Teste de exemplo — Componente Button do @repo/ui.
 *
 * Demonstra o padrão para testar componentes React:
 * 1. Usar @testing-library/react para renderizar
 * 2. Usar @testing-library/user-event para interações
 * 3. Validar renderização, variants e comportamento asChild
 */
describe("Button", () => {
  it("renderiza com texto children", () => {
    render(<Button>Clique aqui</Button>);
    expect(
      screen.getByRole("button", { name: "Clique aqui" }),
    ).toBeInTheDocument();
  });

  it("aplica variant default corretamente", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
  });

  it("aplica variant outline corretamente", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("bg-background");
  });

  it("aplica size sm corretamente", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8");
  });

  it("renderiza como child quando asChild=true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveClass("bg-primary");
  });
});
