import { useEffect, useRef, useState } from "react";
import "./InviteMemberModal.scss";

const EMPTY_FORM = {
  name: "",
  description: "",
  status: "active",
};

const getFormFromProduct = (product) => ({
  name: String(product?.name || ""),
  description: String(product?.description || ""),
  status: product?.status === false ? "inactive" : "active",
});

const AddProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  product = null,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const isUpdateMode = mode === "update";

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setForm(isUpdateMode ? getFormFromProduct(product) : EMPTY_FORM);
      setImageFile(null);
      setImagePreview(product?.image || "");
      setErrors({});
      setLoading(false);
      firstInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, isUpdateMode, product]);

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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }

    if (!file) {
      setImagePreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!imageFile && !imagePreview) {
      nextErrors.image = "Product image is required.";
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
        image: imageFile,
        imagePreview,
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
      aria-labelledby="product-modal-title"
    >
      <div className="im-modal">
        <div className="im-modal__header">
          <div>
            <p className="im-modal__eyebrow">PRODUCT MANAGEMENT</p>
            <h2 className="im-modal__title" id="product-modal-title">
              {isUpdateMode ? "Update Product" : "Add Product"}
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
            <label className="im-field__label" htmlFor="product-name">
              Product Name
            </label>
            <input
              id="product-name"
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
            <label className="im-field__label" htmlFor="product-description">
              Description
            </label>
            <input
              id="product-description"
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

          <div className={`im-field ${errors.image ? "im-field--error" : ""}`}>
            <label className="im-field__label" htmlFor="product-image">
              Product Image
            </label>
            <input
              id="product-image"
              className="im-field__input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={imageInputRef}
            />
            {imagePreview && (
              <div className="im-field__image-preview-wrap">
                <img
                  className="im-field__image-preview"
                  src={imagePreview}
                  alt="Selected product preview"
                />
                <button
                  className="im-field__image-remove"
                  type="button"
                  aria-label="Remove product image"
                  onClick={handleRemoveImage}
                >
                  X
                </button>
              </div>
            )}
            {errors.image && (
              <span className="im-field__error">{errors.image}</span>
            )}
          </div>

          <div className="im-field">
            <label className="im-field__label" htmlFor="product-status">
              Status
            </label>
            <div className="im-field__select-wrap">
              <select
                id="product-status"
                className="im-field__select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">In Stock</option>
                <option value="inactive">Out of Stock</option>
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
                ? "Update Product"
                : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
