import { useEffect, useRef, useState } from "react";
import "./InviteMemberModal.scss";

const EMPTY_FORM = {
  name: "",
  description: "",
  status: "active",
};

const getFormFromCategory = (category) => ({
  name: String(category?.name || ""),
  description: String(category?.description || ""),
  status: category?.status === false ? "inactive" : "active",
});

const AddCategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  category = null,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const isUpdateMode = mode === "update";

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setForm(isUpdateMode ? getFormFromCategory(category) : EMPTY_FORM);
      setErrors({});
      setLoading(false);
      firstInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, isUpdateMode, category]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Category name is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status === "active",
      });
      onClose();
    } catch {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="im-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div className="im-modal">
        <div className="im-modal__header">
          <div>
            <p className="im-modal__eyebrow">CATEGORY MANAGEMENT</p>
            <h2 className="im-modal__title" id="category-modal-title">
              {isUpdateMode ? "Update Category" : "Add Category"}
            </h2>
          </div>
          <button
            className="im-modal__close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <div className="im-form">
          <div className={`im-field ${errors.name ? "im-field--error" : ""}`}>
            <label className="im-field__label" htmlFor="category-name">
              Category Name
            </label>
            <input
              id="category-name"
              className="im-field__input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              ref={firstInputRef}
              autoComplete="off"
            />
            {errors.name && (
              <span className="im-field__error">{errors.name}</span>
            )}
          </div>

          <div
            className={`im-field ${
              errors.description ? "im-field--error" : ""
            }`}
          >
            <label className="im-field__label" htmlFor="category-description">
              Description
            </label>
            <input
              id="category-description"
              className="im-field__input"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.description && (
              <span className="im-field__error">{errors.description}</span>
            )}
          </div>

          <div className="im-field">
            <label className="im-field__label" htmlFor="category-status">
              Status
            </label>
            <div className="im-field__select-wrap">
              <select
                id="category-status"
                className="im-field__select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <span className="im-field__chevron" aria-hidden="true">
                v
              </span>
            </div>
          </div>
        </div>

        <div className="im-modal__footer">
          <button
            className="im-modal__btn im-modal__btn--ghost"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="im-modal__btn im-modal__btn--primary"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? isUpdateMode
                ? "Updating..."
                : "Adding..."
              : isUpdateMode
                ? "Update Category"
                : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
