import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/api";
import "./AddProductPage.scss";
import { toast } from "react-toastify";

const EMPTY_FORM = {
  name: "",
  description: "",
  status: true,
  categoryId: "",
  discount: false,
  discountPercentage: 0,
  productDimensions: "",
  productImage: "",
  productPrice: "",
  productQuantity: "",
  productCode: "",
  productStockAvailability: true,
  productCustomizationOptions: false,
  productMaterial: "",
};

const BOOLEAN_FIELDS = [
  { name: "status", label: "Status", onText: "Active", offText: "Inactive" },
  { name: "discount", label: "Discount", onText: "Yes", offText: "No" },
  {
    name: "productStockAvailability",
    label: "Stock Availability",
    onText: "Available",
    offText: "Unavailable",
  },
  {
    name: "productCustomizationOptions",
    label: "Customization Options",
    onText: "Yes",
    offText: "No",
  },
];

const getCategoryList = (response) =>
  response?.data?.categories || response?.data || response?.categories || [];

const getProductFromResponse = (response) =>
  response?.data?.product || response?.data || response?.product || null;

const formatCategory = (category) => ({
  id: category?._id || category?.id || "",
  name: category?.name || "Untitled category",
});

const getFormFromProduct = (product) => ({
  name: String(product?.name || ""),
  description: String(product?.description || ""),
  status: product?.status !== false,
  categoryId: String(product?.categoryId?._id || product?.categoryId || ""),
  discount: Boolean(product?.discount),
  discountPercentage: product?.discountPercentage ?? 0,
  productDimensions: String(product?.productDimensions || ""),
  productImage: String(product?.productImage || ""),
  productPrice: product?.productPrice ?? "",
  productQuantity: product?.productQuantity ?? "",
  productCode: String(product?.productCode || ""),
  productStockAvailability: product?.productStockAvailability !== false,
  productCustomizationOptions: Boolean(product?.productCustomizationOptions),
  productMaterial: String(product?.productMaterial || ""),
});

const ToggleField = ({ label, checked, onChange, onText, offText }) => (
  <label className="product-form-toggle">
    <span>{label}</span>
    <button
      className={`product-form-toggle__control ${
        checked ? "product-form-toggle__control--on" : ""
      }`}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span>{checked ? onText : offText}</span>
      <i aria-hidden="true" />
    </button>
  </label>
);

const AddProductPage = ({ productId = "", initialProduct = null, onBack }) => {
  const isUpdateMode = Boolean(productId);
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(Boolean(productId));
  const [categoryError, setCategoryError] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest("/api/category/all");
        setCategories(getCategoryList(response).map(formatCategory));
      } catch (error) {
        console.error(error);
        setCategoryError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!productId) {
      setForm(EMPTY_FORM);
      setLoadingProduct(false);
      return;
    }

    if (initialProduct) {
      setForm(getFormFromProduct(initialProduct));
      setLoadingProduct(false);
      return;
    }

    const fetchProduct = async () => {
      setLoadingProduct(true);

      try {
        const response = await apiRequest(`/api/product/${productId}`);
        const product = getProductFromResponse(response);

        if (product) {
          setForm(getFormFromProduct(product));
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to load product");
        onBack();
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [initialProduct, onBack, productId]);

  const selectedCategoryLabel = useMemo(() => {
    const selected = categories.find(
      (category) => category.id === form.categoryId,
    );
    return selected?.name || "No category selected";
  }, [categories, form.categoryId]);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    updateField(name, value);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (!form.categoryId) nextErrors.categoryId = "Category is required.";
    if (!form.productPrice) nextErrors.productPrice = "Price is required.";
    if (!form.productQuantity) {
      nextErrors.productQuantity = "Quantity is required.";
    }
    if (!form.productCode.trim()) {
      nextErrors.productCode = "Product code is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      discountPercentage: Number(form.discountPercentage) || 0,
      productPrice: Number(form.productPrice),
      productQuantity: Number(form.productQuantity),
      productCode: form.productCode.trim(),
      productDimensions: form.productDimensions.trim(),
      productImage: form.productImage.trim(),
      productMaterial: form.productMaterial.trim(),
    };

    setSubmitting(true);

    try {
      await apiRequest(
        isUpdateMode ? `/api/product/${productId}` : "/api/product/create",
        {
          method: isUpdateMode ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      );

      toast.success(
        isUpdateMode
          ? "Product updated successfully"
          : "Product created successfully",
      );
      onBack();
    } catch (error) {
      console.error(error);
      toast.error(
        error.message ||
          `Failed to ${isUpdateMode ? "update" : "create"} product`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="product-form-page">
        <div className="product-form-toolbar">
          <div>
            <p>Catalog inventory</p>
            <h2>Loading Product</h2>
          </div>
          <button className="product-form-back" type="button" onClick={onBack}>
            Back to Products
          </button>
        </div>

        <section className="product-form-card">
          <p className="product-form-loading">Fetching product details...</p>
        </section>
      </div>
    );
  }

  return (
    <form className="product-form-page" onSubmit={handleSubmit}>
      <div className="product-form-toolbar">
        <div>
          <p>Catalog inventory</p>
          <h2>{isUpdateMode ? "Update Product" : "Add Product"}</h2>
        </div>
        <button className="product-form-back" type="button" onClick={onBack}>
          Back to Products
        </button>
      </div>

      <section className="product-form-card">
        <div className="product-form-grid">
          <label
            className={`product-form-field ${errors.name ? "product-form-field--error" : ""}`}
          >
            <span>Name</span>
            <input name="name" value={form.name} onChange={handleTextChange} />
            {errors.name && <small>{errors.name}</small>}
          </label>

          <label
            className={`product-form-field ${errors.productCode ? "product-form-field--error" : ""}`}
          >
            <span>Product Code</span>
            <input
              name="productCode"
              value={form.productCode}
              onChange={handleTextChange}
            />
            {errors.productCode && <small>{errors.productCode}</small>}
          </label>

          <label
            className={`product-form-field ${errors.categoryId ? "product-form-field--error" : ""}`}
          >
            <span>Category</span>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleTextChange}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
              </option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <small>{errors.categoryId}</small>}
            {categoryError && <small>{categoryError}</small>}
          </label>

          <label
            className={`product-form-field ${errors.productPrice ? "product-form-field--error" : ""}`}
          >
            <span>Product Price</span>
            <input
              name="productPrice"
              type="number"
              min="0"
              value={form.productPrice}
              onChange={handleTextChange}
            />
            {errors.productPrice && <small>{errors.productPrice}</small>}
          </label>

          <label
            className={`product-form-field ${errors.productQuantity ? "product-form-field--error" : ""}`}
          >
            <span>Product Quantity</span>
            <input
              name="productQuantity"
              type="number"
              min="0"
              value={form.productQuantity}
              onChange={handleTextChange}
            />
            {errors.productQuantity && <small>{errors.productQuantity}</small>}
          </label>

          <label className="product-form-field">
            <span>Discount Percentage</span>
            <input
              name="discountPercentage"
              type="number"
              min="0"
              max="100"
              value={form.discountPercentage}
              onChange={handleTextChange}
            />
          </label>

          <label className="product-form-field">
            <span>Product Dimensions (in m)</span>
            <input
              name="productDimensions"
              value={form.productDimensions}
              onChange={handleTextChange}
            />
          </label>

          <label className="product-form-field">
            <span>Product Material</span>
            <input
              name="productMaterial"
              value={form.productMaterial}
              onChange={handleTextChange}
            />
          </label>

          <label className="product-form-field product-form-field--wide">
            <span>Product Image</span>
            <input
              name="productImage"
              value={form.productImage}
              onChange={handleTextChange}
              placeholder="Image URL or uploaded image path"
            />
          </label>

          <label className="product-form-field product-form-field--wide">
            <span>Description</span>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleTextChange}
            />
          </label>
        </div>

        <div className="product-form-toggles">
          {BOOLEAN_FIELDS.map((field) => (
            <ToggleField
              key={field.name}
              label={field.label}
              checked={form[field.name]}
              onChange={(value) => updateField(field.name, value)}
              onText={field.onText}
              offText={field.offText}
            />
          ))}
        </div>

        <div className="product-form-summary">
          <span>Selected category</span>
          <strong>{selectedCategoryLabel}</strong>
        </div>

        <div className="product-form-actions">
          <button
            className="product-form-cancel"
            type="button"
            onClick={onBack}
          >
            Cancel
          </button>
          <button
            className="product-form-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? isUpdateMode
                ? "Updating..."
                : "Saving..."
              : isUpdateMode
                ? "Update Product"
                : "Save Product"}
          </button>
        </div>
      </section>
    </form>
  );
};

export default AddProductPage;
