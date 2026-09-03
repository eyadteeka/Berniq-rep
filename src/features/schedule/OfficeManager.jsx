import { useState } from "react";
import { Card, CardHead, CardActions } from "../../components/ui/Card";
import { Field, FieldRow } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { IconPlus, IconTrash, IconCheck } from "../../components/ui/Icons";
import "./OfficeManager.css";

export default function OfficeManager({ offices, onAdd, onUpdate, onRemove }) {
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) {
      setError("أدخل اسم المكتب");
      return;
    }
    if (offices.some((o) => o.name === newName.trim())) {
      setError("هذا المكتب مسجل بالفعل");
      return;
    }
    onAdd(newName);
    setNewName("");
    setError("");
  };

  const handleUpdate = (id) => {
    if (!editName.trim()) {
      setError("أدخل اسم المكتب");
      return;
    }
    if (offices.some((o) => o.id !== id && o.name === editName.trim())) {
      setError("هذا المكتب مسجل بالفعل");
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
        title="إدارة المكاتب"
        hint="أضف أسماء المكاتب والفروع هنا لتسهيل الاستخدام في الجداول"
      />

      <div className="b-off__section">
        <h3 className="b-off__title">إضافة مكتب جديد</h3>
        <FieldRow>
          <Field label="اسم المكتب">
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
                placeholder="مثال: مكتب مبيعات / مكتب المطار / ..."
                className="b-field__input"
              />
            )}
          </Field>
        </FieldRow>

        <CardActions>
          <Button icon={IconPlus} onClick={handleAdd}>
            إضافة مكتب
          </Button>
        </CardActions>

        {error && <Alert tone="error" title="خطأ">{error}</Alert>}
      </div>

      {offices.length > 0 && (
        <div className="b-off__section">
          <h3 className="b-off__title">المكاتب المسجلة ({offices.length})</h3>
          <div className="b-off__list">
            {offices.map((office) => (
              <div key={office.id} className="b-off__item">
                {editId === office.id ? (
                  <div className="b-off__edit">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleUpdate(office.id);
                      }}
                      className="b-off__input"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      icon={IconCheck}
                      onClick={() => handleUpdate(office.id)}
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
                  <div className="b-off__display">
                    <span className="b-off__name">{office.name}</span>
                    <div className="b-off__actions">
                      <Button
                        size="sm"
                        variant="tertiary"
                        onClick={() => {
                          setEditId(office.id);
                          setEditName(office.name);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={IconTrash}
                        onClick={() => onRemove(office.id)}
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
