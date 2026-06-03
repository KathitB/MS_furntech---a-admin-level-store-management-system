import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import productFallback from "../../assets/item1.png";
import { apiRequest } from "../api/api";
import deleteIcon from "../../assets/delete-2-svgrepo-com (1).svg";

const getProductsFromResponse = (response) =>
  response?.data?.products || response?.products || [];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const getProductStatus = (product) => {
  if (!product.status) return "Inactive";

  if (
    !product.productStockAvailability ||
    Number(product.productQuantity) <= 0
  ) {
    return "Out Stock";
  }

  if (Number(product.productQuantity) <= 5) {
    return "Low Stock";
  }

  return "In Stock";
};

const formatProduct = (product) => {
  const quantity = Number(product.productQuantity) || 0;
  const status = getProductStatus(product);
  const category =
    product.categoryId?.name ||
    product.categoryName ||
    product.categoryId ||
    "";

  return {
    id: product._id || product.id || product.productCode,
    name: product.name || "Untitled Product",
    category,
    title: product.productCode || "No product code",
    subtitle:
      product.description || product.productMaterial || "No description added",
    dates: `Qty ${quantity} · ${formatCurrency(product.productPrice)}`,
    priceFormatted: formatCurrency(product.productPrice),
    stockLabel: `${quantity} in stock`,
    status,
    image: product.productImage || productFallback,
    material: product.productMaterial || "",
    code: product.productCode || "",
    source: product,
  };
};

const Products = ({ searchTerm = "" }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest("/api/product/all");
        setProducts(getProductsFromResponse(response).map(formatProduct));
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.id,
        product.stockLabel,
        product.status,
        product.priceFormatted,
        product.material,
        product.code,
      ]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query)),
    );
  }, [products, searchTerm]);

  const openCreatePage = () => {
    navigate("/dashboard/products/add");
  };

  const openEditPage = (product) => {
    navigate(`/dashboard/products/${product.id}/edit`, {
      state: { product: product.source },
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    setModalMode("create");
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);

    try {
      await apiRequest(`/api/product/${productToDelete.id}`, {
        method: "DELETE",
      });

      setProducts((prev) =>
        prev.filter((product) => product.id !== productToDelete.id),
      );
      setProductToDelete(null);
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete Product:", err);
      alert(err.message || "Failed to delete Product");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="products-page">
      <div className="offer-banner-toolbar">
        <p>
          {loading ? "Loading products..." : `${products.length} active SKUs`}
        </p>
        <button type="button" onClick={openCreatePage}>
          <span>+</span>
          Add Product
        </button>
      </div>

      {error && (
        <div className="categories-state categories-state--error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && visibleProducts.length === 0 && (
        <div className="categories-state">
          <p>No products found{searchTerm ? ` for "${searchTerm}"` : ""}.</p>
        </div>
      )}

      <section className="offer-banner-grid">
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <article className="offer-banner-card" key={`loading-${index}`}>
              <div className="offer-banner-card__image">
                <img src={productFallback} alt="" />
                <span className="offer-banner-card__label">Loading...</span>
                <div className="offer-banner-card__copy">
                  <h2>Fetching product</h2>
                  <p>Please wait</p>
                </div>
              </div>
            </article>
          ))}

        {!loading &&
          !error &&
          visibleProducts.map((product) => (
            <article className="offer-banner-card" key={product.id}>
              <div className="offer-banner-card__image">
                <img src={product.image} alt={product.name} />
                <span className="offer-banner-card__label">{product.name}</span>
                <span
                  className={`offer-banner-card__status offer-banner-card__status--${product.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {product.status}
                </span>
                <div className="offer-banner-card__copy">
                  <h2>{product.title}</h2>
                  <p>{product.subtitle}</p>
                </div>
              </div>

              <div className="offer-banner-card__footer">
                <span className="offer-banner-card__dates">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="M8 3v4" />
                    <path d="M16 3v4" />
                    <path d="M4 10h16" />
                  </svg>
                  {product.dates}
                </span>
                <div className="offer-banner-card__actions">
                  <button type="button" aria-label={`Preview ${product.name}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label={`Edit ${product.name}`}
                    onClick={() => openEditPage(product)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4z" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                  </button>
                  <button
                    className="team-actions__button team-actions__button--delete"
                    type="button"
                    aria-label={`Edit ${product.name}`}
                    onClick={() => setProductToDelete(product)}
                  >
                    <img src={deleteIcon} alt="" />
                  </button>
                  {/* <button className="offer-banner-card__manage" type="button">
                    Delete
                  </button> */}
                </div>
              </div>
            </article>
          ))}
      </section>

      {productToDelete && (
        <div className="team-delete-overlay" role="dialog" aria-modal="true">
          <div className="team-delete-modal">
            <h3>Delete Product?</h3>
            <p>
              Are you sure you want to delete
              <strong> {productToDelete.name}</strong>?
            </p>
            <div className="team-delete-modal__actions">
              <button
                className="team-delete-modal__cancel"
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="team-delete-modal__delete"
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
