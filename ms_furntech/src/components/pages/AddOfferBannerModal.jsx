import { useEffect, useRef, useState } from "react";
import "./InviteMemberModal.scss";

const EMPTY_FORM = {
  title: "",
  //   lastName: "",
  //   email: "",
  //   mobileNumber: "",
  imageFile: null,
  imageUrl:
    "https://codoid.s3.ap-south-1.amazonaws.com/workflow/fieldListTextIcon.svg",
  linkUrl: "",
  status: "active",
  //   state: "",
  //   postalCode: "",
  //   country: "",
};

const getFormFromBanner = (banner) => ({
  title: String(banner?.title || ""),
  //   lastName: String(banner?.lastName || ""),
  //   email: String(banner?.email || ""),
  //   //   mobileNumber: Number(banner?.mobileNumber || ""),
  //   mobileNumber: String(banner?.mobileNumber || ""),
  imageUrl: String(banner?.imageUrl || ""),
  linkUrl: String(banner?.linkUrl || ""),
  status: banner?.status === false ? "inactive" : "active",
  // city: String(banner?.status || ""),
  //   state: String(banner?.state || ""),
  //   postalCode: String(banner?.postalCode || ""),
  //   country: String(banner?.country || ""),
});

const AddOfferBannerModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  banner = null,
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
      setForm(isUpdateMode ? getFormFromBanner(banner) : EMPTY_FORM);
      setErrors({});
      setLoading(false);
      firstInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, isUpdateMode, banner]);

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

  // const handleChange = (event) => {
  //   const { name, value } = event.target;

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   if (errors[name]) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       [name]: "",
  //     }));
  //   }
  // };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!form.imageFile) {
      nextErrors.imageFile = "Image is required.";
    }

    if (!form.linkUrl.trim()) {
      nextErrors.linkUrl = "Url to the Banner is required.";
    }

    // if (!form.mobileNumber.trim()) {
    //   nextErrors.mobileNumber = "Mobile number is required.";
    // }

    // if (!form.address.trim()) {
    //   nextErrors.address = "Address is required.";
    // }

    // if (!form.city.trim()) {
    //   nextErrors.city = "City is required.";
    // }

    // if (!form.country.trim()) {
    //   nextErrors.country = "Country is required.";
    // }

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
        title: form.title.trim(),
        // lastName: form.lastName.trim(),
        // email: form.email.trim(),
        // // mobileNumber: Number(form.mobileNumber),
        // mobileNumber: form.mobileNumber.trim(),
        imageUrl: form.imageUrl.trim(),
        // imageFile: form.imageFile,
        linkUrl: form.linkUrl.trim(),
        status: form.status === "active",
        // state: form.state.trim(),
        // postalCode: form.postalCode.trim(),  
        // country: form.country.trim(),
      });

      onClose();
    } catch {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  //   const renderInput = (label, name, type = "text", ref = null) => (
  //     <div className={`im-field ${errors[name] ? "im-field--error" : ""}`}>
  //       <label className="im-field__label" htmlFor={name}>
  //         {label}
  //       </label>

  //       <input
  //         id={name}
  //         className="im-field__input"
  //         type={type}
  //         name={name}
  //         value={form[name]}
  //         onChange={handleChange}
  //         autoComplete="off"
  //         ref={ref}
  //       />

  //       {errors[name] && <span className="im-field__error">{errors[name]}</span>}
  //     </div>
  //   );

  const renderInput = (
    label,
    name,
    type = "text",
    ref = null,
    required = false,
  ) => (
    <div className={`im-field ${errors[name] ? "im-field--error" : ""}`}>
      <label className="im-field__label" htmlFor={name}>
        {label}
        {required && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
      </label>

      <input
        id={name}
        className="im-field__input"
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        autoComplete="off"
        ref={ref}
      />

      {errors[name] && <span className="im-field__error">{errors[name]}</span>}
    </div>
  );

  const renderFileInput = (label, name, required = false) => (
    <div className={`im-field ${errors[name] ? "im-field--error" : ""}`}>
      <label className="im-field__label" htmlFor={name}>
        {label}
        {required && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
      </label>

      <input
        id={name}
        className="im-field__input"
        type="file"
        name={name}
        accept="image/*"
        onChange={handleChange}
      />

      {form.imageFile && <small>{form.imageFile.name}</small>}

      {errors[name] && <span className="im-field__error">{errors[name]}</span>}
    </div>
  );
  return (
    <div
      className="im-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-modal-title"
    >
      <div className="im-modal">
        <div className="im-modal__header">
          <div>
            <p className="im-modal__eyebrow">BANNER MANAGEMENT</p>

            <h2 className="im-modal__title" id="customer-modal-title">
              {isUpdateMode ? "Update Banner" : "Add Banner"}
            </h2>
          </div>

          <button
            className="im-modal__close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className="im-form">
          {/* {renderInput("First Name", "firstName", "text", firstInputRef, true)}

          {renderInput("Last Name", "lastName", true)}

          {renderInput("Email", "email", "email", true)}

          {renderInput("Mobile Number", "mobileNumber", "tel", true)}

          {renderInput("Profile Picture URL", "profilePicture")}

          {renderInput("Address", "address", true)}

          {renderInput("City", "city", true)}

          {renderInput("State", "state")}

          {renderInput("Postal Code", "postalCode")}

          {renderInput("Country", "country", true)} */}

          {renderInput("Title", "title", "text", firstInputRef, true)}
          {/* 
          {renderInput("Last Name", "lastName", "text", null, true)}

          {renderInput("Email", "email", "email", null, true)}

          {renderInput("Mobile Number", "mobileNumber", "tel", null, true)} */}

          {/* {renderInput("Image Url", "imageUrl", "text", null, true)} */}

          {renderFileInput("Banner Image", "imageFile", true)}

          {renderInput("Banner Url", "linkUrl", "text", null, true)}

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
                <option value="active">Active</option>
                <option value="inactive">In Active</option>
              </select>
              <span className="im-field__chevron" aria-hidden="true">
                v
              </span>
            </div>
          </div>

          {/* {renderInput("Address", "address", "text", null, true)} */}

          {/* {renderInput("City", "city", "text", null, true)} */}

          {/* {renderInput("State", "state")} */}

          {/* {renderInput("Postal Code", "postalCode")} */}

          {/* {renderInput("Country", "country", "text", null, true)} */}
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
                ? "Update Customer"
                : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOfferBannerModal;
