import React, { act, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import UnitRow from "./UnitRow";

globalThis.React = React;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const roots = [];

function UnitRowHarness({ initialUnit, employees }) {
  const [unit, setUnit] = useState(initialUnit);

  return (
    <UnitRow
      unit={unit}
      index={0}
      canRemove={false}
      employees={employees}
      onChange={setUnit}
      onRemove={vi.fn()}
    />
  );
}

function renderUnitRow(props) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push({ root, container });

  act(() => {
    root.render(<UnitRowHarness {...props} />);
  });

  return container;
}

afterEach(() => {
  while (roots.length) {
    const { root, container } = roots.pop();
    act(() => root.unmount());
    container.remove();
  }
});

describe("UnitRow employee selection", () => {
  it("shows a selected employee inside the input", () => {
    const container = renderUnitRow({
      initialUnit: { id: "unit-1", label: "", shift: "morning" },
      employees: [{ id: "employee-1", name: "Employee One" }],
    });
    const input = container.querySelector("input");

    act(() => input.focus());

    const option = [...container.querySelectorAll(".b-unit__combobox-option")].find(
      (button) => button.textContent === "Employee One",
    );

    expect(option).toBeTruthy();

    act(() => option.click());

    expect(input.value).toBe("Employee One");
  });

  it("keeps an existing employee when another employee is selected", () => {
    const container = renderUnitRow({
      initialUnit: { id: "unit-1", label: "Employee One", shift: "morning" },
      employees: [
        { id: "employee-1", name: "Employee One" },
        { id: "employee-2", name: "Employee Two" },
      ],
    });
    const input = container.querySelector("input");

    act(() => input.focus());

    const option = [...container.querySelectorAll(".b-unit__combobox-option")].find(
      (button) => button.textContent === "Employee Two",
    );

    act(() => option.click());

    expect(input.value).toBe("Employee One / Employee Two");
  });

  it("keeps selected employees after the shift changes", () => {
    const container = renderUnitRow({
      initialUnit: { id: "unit-1", label: "", shift: "morning" },
      employees: [{ id: "employee-1", name: "Employee One" }],
    });
    const input = container.querySelector("input");
    const shift = container.querySelector("select");

    act(() => input.focus());

    const option = container.querySelector(".b-unit__combobox-option");
    act(() => option.click());
    act(() => input.blur());
    act(() => {
      shift.value = "evening";
      shift.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(input.value).toBe("Employee One");
  });
});
