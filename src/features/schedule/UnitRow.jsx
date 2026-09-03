import { useState, useRef, useEffect } from "react";
import { Field, TextInput, Select } from "../../components/ui/Field";
import { IconTrash } from "../../components/ui/Icons";
import { SHIFT_LIST } from "./scheduleEngine";
import "./UnitRow.css";

const SHIFT_OPTIONS = SHIFT_LIST.map((s) => ({
  value: s.id,
  label: `${s.label} — ${s.time}`,
}));

const LABEL_SEPARATOR = " / ";
const splitLabel = (label) =>
  label
    .split(/\s*\/\s*/)
    .map((name) => name.trim())
    .filter(Boolean);

export default function UnitRow({ unit, index, canRemove, onChange, onRemove, employees = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef(null);
  const unitLabel = unit.label ?? "";
  const selectedEmployeeNames = splitLabel(unitLabel);
  const inputDisplayValue = [unitLabel.trim(), inputValue]
    .filter(Boolean)
    .join(LABEL_SEPARATOR);
  const normalizedSearchValue = inputValue.trim().toLocaleLowerCase();
  const filteredEmployees = employees.filter(
    (employee) =>
      !selectedEmployeeNames.includes(employee.name) &&
      (!normalizedSearchValue || employee.name.toLocaleLowerCase().includes(normalizedSearchValue)),
  );

  useEffect(() => {
    // إغلاق القائمة عند النقر خارجها
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitInputValue = () => {
    const valueToCommit = inputValue.trim();
    if (!valueToCommit || selectedEmployeeNames.includes(valueToCommit)) {
      setInputValue("");
      return;
    }

    onChange({
      ...unit,
      label: [...selectedEmployeeNames, valueToCommit].join(LABEL_SEPARATOR),
    });
    setInputValue("");
  };

  const handleSelectEmployee = (employeeName) => {
    if (!selectedEmployeeNames.includes(employeeName)) {
      onChange({
        ...unit,
        label: [...selectedEmployeeNames, employeeName].join(LABEL_SEPARATOR),
      });
    }
    setInputValue("");
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const nextValue = e.target.value;
    const currentLabel = unitLabel.trim();

    if (!currentLabel || nextValue.startsWith(currentLabel)) {
      const nextSearchValue = currentLabel
        ? nextValue.slice(currentLabel.length).replace(/^\s*\/\s*/, "")
        : nextValue;
      setInputValue(nextSearchValue);
    } else {
      onChange({ ...unit, label: nextValue });
      setInputValue("");
    }

    setIsOpen(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitInputValue();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === "Escape") {
      setInputValue("");
      setIsOpen(false);
    }
  };

  const handleInputBlur = () => {
    commitInputValue();
    setIsOpen(false);
  };

  return (
    <div className="b-unit">
      <span className="b-unit__seat">{String(index + 1).padStart(2, "0")}</span>

      <Field label="الموظف أو الوحدة المتناوبة">
        {(id) => (
          <div className="b-unit__combobox-wrapper" ref={containerRef}>
            <div className="b-unit__combobox-input-wrapper">
              <TextInput
                id={id}
                value={inputDisplayValue}
                onChange={handleInputChange}
                onFocus={() => {
                  if (employees.length > 0) setIsOpen(true);
                }}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                placeholder="ابحث عن موظف..."
              />
              {employees.length > 0 && (
                <button
                  className="b-unit__combobox-toggle"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  title="فتح قائمة الموظفين"
                >
                  <span className="b-unit__arrow">▼</span>
                </button>
              )}
            </div>

            {isOpen && employees.length > 0 && (
              <div className="b-unit__combobox-dropdown">
                {filteredEmployees.length > 0 ? (
                  <ul className="b-unit__combobox-list">
                    {filteredEmployees.map((emp) => (
                      <li key={emp.id}>
                        <button
                          type="button"
                          className="b-unit__combobox-option"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectEmployee(emp.name)}
                        >
                          {emp.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="b-unit__combobox-empty">
                    لا توجد نتائج مطابقة
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Field>

      <Field label="وضعه في اليوم الأول">
        {(id) => (
          <Select
            id={id}
            value={unit.shift}
            options={SHIFT_OPTIONS}
            onChange={(e) => onChange({ ...unit, shift: e.target.value })}
          />
        )}
      </Field>

      <button
        type="button"
        className="b-unit__remove"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={`حذف ${unit.label || `الوحدة ${index + 1}`}`}
        title={canRemove ? "حذف الوحدة" : "الدورة تحتاج ٣ وحدات على الأقل"}
      >
        <IconTrash size={17} />
      </button>
    </div>
  );
}
