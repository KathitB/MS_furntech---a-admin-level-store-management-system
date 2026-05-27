import { useState, useEffect, useRef } from "react";
import "./InviteMemberModal.scss";

const EMPTY_FORM = {
  firstname: "",
  lastname: "",
  password: "",
  email: "",
  phone: "",
  role: "", // "manager" | "admin"
  // status: "", // "active" | "inactive" | "away"
  // roleTitle: "", // free-text role input field
};

const getFormFromMember = (member) => ({
  firstname: String(member?.firstname || ""),
  lastname: String(member?.lastname || ""),
  password: "",
  email: member?.email === "No Email" ? "" : String(member?.email || ""),
  phone: String(member?.mobileNumber || ""),
  role:
    String(member?.roleValue) === "1"
      ? "manager"
      : String(member?.roleValue) === "0"
        ? "admin"
        : "",
});

const InviteMemberModal = ({
  isOpen,
  onClose,
  onInvite,
  mode = "create",
  member = null,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const isUpdateMode = mode === "update";

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setForm(isUpdateMode ? getFormFromMember(member) : EMPTY_FORM);
        setErrors({});
        setLoading(false);
        firstInputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isUpdateMode, member]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstname.trim()) newErrors.firstname = "Name is required.";
    if (!form.lastname.trim()) newErrors.lastname = "Last Name is required";
    if (!isUpdateMode && !form.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!isUpdateMode && !form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (form.phone.trim() && !/^\+?[\d\s-]{7,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!form.role) newErrors.role = "Please select a role.";
    // if (!form.status) newErrors.status = "Please select a status.";
    // if (!form.roleTitle.trim()) newErrors.roleTitle = "Role title is required.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const phoneValue = form.phone.trim();

    // const payload = {
    //   id: generateId(),
    //   initials: generateInitials(form.name),
    //   firstname: form.firstname.trim(),
    //   lastname: form.lastname.trim(),
    //   password: form.password.trim(),
    //   email: form.email.trim(),
    //   phone: form.phone.trim(),
    //   role: form.role === "manager" ? "1" : "0", // manager → "1", admin → "0"
    //   status: form.status,
    //   roleTitle: form.roleTitle.trim(),
    // };

    const payload = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim(),
      role: form.role === "manager" ? "1" : "0",
      status: true,
      is_deleted: false,
    };

    if (!isUpdateMode || phoneValue) {
      payload.mobileNumber = /^\d+$/.test(phoneValue)
        ? Number(phoneValue)
        : phoneValue;
    }

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    try {
      await onInvite(payload);
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
      aria-labelledby="im-title"
    >
      <div className="im-modal">
        {/* ── Header ── */}
        <div className="im-modal__header">
          <div>
            <p className="im-modal__eyebrow">TEAM MANAGEMENT</p>
            <h2 className="im-modal__title" id="im-title">
              {isUpdateMode ? "Update Member" : "Invite Member"}
            </h2>
          </div>
          <button
            className="im-modal__close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* ── Avatar preview ── */}
        {/* <div className="im-modal__avatar-row">
          <div className="im-modal__avatar">
            {initials || <span className="im-modal__avatar-placeholder">?</span>}
          </div>
          <div className="im-modal__avatar-meta">
            <strong>{form.name || "New Member"}</strong>
            <small>{form.roleTitle || "Role title"}</small>
          </div>
        </div> */}

        {/* ── Form ── */}
        <div className="im-form">
          {/* Name */}
          <div
            className={`im-field ${errors.firstname ? "im-field--error" : ""}`}
          >
            <label className="im-field__label" htmlFor="im-name">
              First Name
            </label>
            <input
              id="im-name"
              className="im-field__input"
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              // placeholder="e.g. Meera Suresh"
              ref={firstInputRef}
              autoComplete="off"
            />
            {errors.firstname && (
              <span className="im-field__error">{errors.firstname}</span>
            )}
          </div>

          <div
            className={`im-field ${errors.lastname ? "im-field--error" : ""}`}
          >
            <label className="im-field__label" htmlFor="im-name">
              Last Name
            </label>
            <input
              id="im-name"
              className="im-field__input"
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              // placeholder="e.g. Meera Suresh"
              ref={firstInputRef}
              autoComplete="off"
            />
            {errors.lastname && (
              <span className="im-field__error">{errors.lastname}</span>
            )}
          </div>

          <div
            className={`im-field ${errors.password ? "im-field--error" : ""}`}
          >
            <label className="im-field__label" htmlFor="im-name">
              Password
            </label>
            <input
              id="im-name"
              className="im-field__input"
              type="text"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={isUpdateMode ? "blank to keep unchanged" : ""}
              ref={firstInputRef}
              autoComplete="off"
            />
            {errors.password && (
              <span className="im-field__error">{errors.password}</span>
            )}
          </div>

          {/* Email */}
          <div className={`im-field ${errors.email ? "im-field--error" : ""}`}>
            <label className="im-field__label" htmlFor="im-email">
              Email Address
            </label>
            <input
              id="im-email"
              className="im-field__input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              // placeholder="e.g. meera@msinteriors.in"
              autoComplete="off"
            />
            {errors.email && (
              <span className="im-field__error">{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className={`im-field ${errors.phone ? "im-field--error" : ""}`}>
            <label className="im-field__label" htmlFor="im-phone">
              Phone Number
            </label>
            <input
              id="im-phone"
              className="im-field__input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              // placeholder="e.g. +91 98765 43210"
              autoComplete="off"
            />
            {errors.phone && (
              <span className="im-field__error">{errors.phone}</span>
            )}
          </div>

          {/* Role title (free text) */}
          {/* <div
            className={`im-field ${errors.roleTitle ? "im-field--error" : ""}`}
          >
            <label className="im-field__label" htmlFor="im-role-title">
              Role Title
            </label>
            <input
              id="im-role-title"
              className="im-field__input"
              type="text"
              name="roleTitle"
              value={form.roleTitle}
              onChange={handleChange}
              // placeholder="e.g. Operations Lead"
              autoComplete="off"
            />
            {errors.roleTitle && (
              <span className="im-field__error">{errors.roleTitle}</span>
            )}
          </div> */}

          {/* Role dropdown + Status dropdown side by side */}
          <div className="im-form__row">
            {/* Permission Role */}
            <div className={`im-field ${errors.role ? "im-field--error" : ""}`}>
              <label className="im-field__label" htmlFor="im-role">
                Role
              </label>
              <div className="im-field__select-wrap">
                <select
                  id="im-role"
                  className="im-field__select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="im-field__chevron" aria-hidden="true">
                  ▾
                </span>
              </div>
              {errors.role && (
                <span className="im-field__error">{errors.role}</span>
              )}
              {/* {form.role && (
                <span className="im-field__hint">
                  Sends as&nbsp;
                  <strong>{form.role === "manager" ? '"1"' : '"0"'}</strong>
                  &nbsp;to backend
                </span>
              )} */}
            </div>

            {/* Status */}
            {/* <div
              className={`im-field ${errors.status ? "im-field--error" : ""}`}
            >
              <label className="im-field__label" htmlFor="im-status">
                Status
              </label>
              <div className="im-field__select-wrap">
                <select
                  id="im-status"
                  className="im-field__select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="away">Away</option>
                </select>
                <span className="im-field__chevron" aria-hidden="true">
                  ▾
                </span>
              </div>
              {errors.status && (
                <span className="im-field__error">{errors.status}</span>
              )}
            </div> */}
          </div>

          {/* Auto-generated info */}
          {/* <div className="im-autogen">
            <span className="im-autogen__item">
              <span className="im-autogen__label">ID</span>
              <span className="im-autogen__value">
                Auto-generated on invite
              </span>
            </span>
            <span className="im-autogen__item">
              <span className="im-autogen__label">Initials</span>
              <span className="im-autogen__value">{initials || "—"}</span>
            </span>
          </div> */}
        </div>

        {/* ── Footer ── */}
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
                : "Sending..."
              : isUpdateMode
                ? "Update Member"
                : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
