import { useState, useEffect } from "react";

const STORAGE_EMPLOYEES = "schedule_employees";
const STORAGE_OFFICES = "schedule_offices";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_EMPLOYEES);
    if (stored) {
      try {
        setEmployees(JSON.parse(stored));
      } catch {
        setEmployees([]);
      }
    }
  }, []);

  const save = (newEmployees) => {
    setEmployees(newEmployees);
    localStorage.setItem(STORAGE_EMPLOYEES, JSON.stringify(newEmployees));
  };

  const add = (name) => {
    const newEmployee = {
      id: Date.now(),
      name: name.trim(),
    };
    save([...employees, newEmployee]);
    return newEmployee;
  };

  const update = (id, name) => {
    save(employees.map((e) => (e.id === id ? { ...e, name: name.trim() } : e)));
  };

  const remove = (id) => {
    save(employees.filter((e) => e.id !== id));
  };

  return { employees, add, update, remove };
}

export function useOffices() {
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_OFFICES);
    if (stored) {
      try {
        setOffices(JSON.parse(stored));
      } catch {
        setOffices([]);
      }
    }
  }, []);

  const save = (newOffices) => {
    setOffices(newOffices);
    localStorage.setItem(STORAGE_OFFICES, JSON.stringify(newOffices));
  };

  const add = (name) => {
    const newOffice = {
      id: Date.now(),
      name: name.trim(),
    };
    save([...offices, newOffice]);
    return newOffice;
  };

  const update = (id, name) => {
    save(offices.map((o) => (o.id === id ? { ...o, name: name.trim() } : o)));
  };

  const remove = (id) => {
    save(offices.filter((o) => o.id !== id));
  };

  return { offices, add, update, remove };
}
