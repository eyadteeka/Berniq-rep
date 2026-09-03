import { useState } from "react";
import { Card, CardHead, CardActions } from "../../components/ui/Card";
import { Field, FieldRow } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { IconPlus, IconTrash, IconCheck } from "../../components/ui/Icons";
import "./EmployeeManager.css";

export default function EmployeeManager({ employees, onAdd, onUpdate, onRemove }) {
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) {
      setError("أدخل اسم الموظف");
      return;
    }
    if (employees.some((e) => e.name === newName.trim())) {
      setError("هذا الموظف مسجل بالفعل");
      return;
    }
    onAdd(newName);
    setNewName("");
    setError("");
  };

  const handleUpdate = (id) => {
    if (!editName.trim()) {
      setError("أدخل اسم الموظف");
      return;
    }
    if (employees.some((e) => e.id !== id && e.name === editName.trim())) {
      setError("هذا الموظف مسجل بالفعل");
      return;
    }
    onUpdate(id, editName);
    setEditId(null);
    setEditName("");
    setError("");
  };

  return (
    <Card>
      <CardHead
        step="0"
        title="إدارة الموظفين"
        hint="أضف أسماء الموظفين هنا لتسهيل الاستخدام في الجداول"
      />

      <div className="b-emp__section">
        <h3 className="b-emp__title">إضافة موظف جديد</h3>
        <FieldRow>
          <Field label="اسم الموظف">
            {(id) => (
              <input
                id={id}
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                placeholder="أدخل اسم الموظف"
                className="b-field__input"
              />
            )}
          </Field>
        </FieldRow>

        <CardActions>
          <Button icon={IconPlus} onClick={handleAdd}>
            إضافة موظف
          </Button>
        </CardActions>

        {error && <Alert tone="error" title="خطأ">{error}</Alert>}
      </div>

      {employees.length > 0 && (
        <div className="b-emp__section">
          <h3 className="b-emp__title">الموظفون المسجلون ({employees.length})</h3>
          <div className="b-emp__list">
            {employees.map((emp) => (
              <div key={emp.id} className="b-emp__item">
                {editId === emp.id ? (
                  <div className="b-emp__edit">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleUpdate(emp.id);
                      }}
                      className="b-emp__input"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      icon={IconCheck}
                      onClick={() => handleUpdate(emp.id)}
                    >
                      حفظ
                    </Button>
                    <Button
                      size="sm"
                      variant="tertiary"
                      onClick={() => setEditId(null)}
                    >
                      إلغاء
                    </Button>
                  </div>
                ) : (
                  <div className="b-emp__display">
                    <span className="b-emp__name">{emp.name}</span>
                    <div className="b-emp__actions">
                      <Button
                        size="sm"
                        variant="tertiary"
                        onClick={() => {
                          setEditId(emp.id);
                          setEditName(emp.name);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={IconTrash}
                        onClick={() => onRemove(emp.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
