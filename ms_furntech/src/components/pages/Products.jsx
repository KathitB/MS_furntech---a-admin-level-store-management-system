import React from "react";
import product1 from "../../assets/item1.png";
import product2 from "../../assets/item2.jpeg";
import product3 from "../../assets/item3.png";
import product4 from "../../assets/item4.jpeg";
import product5 from "../../assets/item5.jpeg";

export const productsCatalog = [
  {
    id: "MS-SF-201",
    name: "Velvet Emerald Armchair",
    category: "Chairs",
    rating: 4.8,
    price: 42500,
    priceFormatted: "₹42,500",
    stock: 12,
    stockLabel: "12 in stock",
    status: "In Stock",
    image: product1,
  },
  {
    id: "MS-DT-118",
    name: "Heritage Solid Oak Table",
    category: "Tables",
    rating: 4.9,
    price: 78900,
    priceFormatted: "₹78,900",
    stock: 6,
    stockLabel: "6 in stock",
    status: "Low Stock",
    image: product2,
  },
  {
    id: "MS-CH-307",
    name: "Atelier Walnut Rocker",
    category: "Chairs",
    rating: 4.7,
    price: 32400,
    priceFormatted: "₹32,400",
    stock: 18,
    stockLabel: "18 in stock",
    status: "In Stock",
    image: product3,
  },
  {
    id: "MS-DC-042",
    name: "Sage Linen Cushion Set",
    category: "Decor",
    rating: 4.6,
    price: 5400,
    priceFormatted: "₹5,400",
    stock: 64,
    stockLabel: "64 in stock",
    status: "In Stock",
    image: product4,
  },
  {
    id: "MS-CH-508",
    name: "Mid-Century Teak Lounger",
    category: "Chairs",
    rating: 4.8,
    price: 38900,
    priceFormatted: "₹38,900",
    stock: 9,
    stockLabel: "9 in stock",
    status: "In Stock",
    image: product5,
  },
];

const Products = ({ searchTerm = "" }) => {
  //   const visibleProducts = useMemo(() => {
  //     const query = searchTerm.trim().toLowerCase();

  //     if (!query) {
  //       return productsCatalog;
  //     }

  //     return productsCatalog.filter((productsCatalog) =>
  //       [
  //         productsCatalog.label,
  //         productsCatalog.title,
  //         productsCatalog.subtitle,
  //         productsCatalog.dates,
  //         productsCatalog.status,
  //       ].some((value) => value.toLowerCase().includes(query)),
  //     );
  //   }, [searchTerm]);

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return productsCatalog;
    }

    return productsCatalog.filter((product) =>
      [
        product.name,
        product.category,
        product.id,
        product.stockLabel,
        product.status,
        product.rating?.toString(),
        product.priceFormatted,
      ]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query)),
    );
  }, [searchTerm]);

  return (
    <div className="products-page">
      <div className="offer-banner-toolbar">
        <p>5 active SKUs · 3 categories</p>
        <button type="button">
          <span>+</span>
          Add Product
        </button>
      </div>

      <section className="offer-banner-grid">
        {productsCatalog.map((banner) => (
          <article className="offer-banner-card" key={banner.id}>
            <div className="offer-banner-card__image">
              <img src={banner.image} alt="" />
              <span className="offer-banner-card__label">{banner.name}</span>
              <span
                className={`offer-banner-card__status offer-banner-card__status--${banner.status.toLowerCase()}`}
              >
                {banner.status}
              </span>
              <div className="offer-banner-card__copy">
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>
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
                {banner.dates}
              </span>
              <div className="offer-banner-card__actions">
                <button type="button" aria-label={`Preview ${banner.title}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </button>
                <button type="button" aria-label={`Edit ${banner.title}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4z" />
                    <path d="M13.5 6.5l4 4" />
                  </svg>
                </button>
                <button className="offer-banner-card__manage" type="button">
                  Manage
                </button>
              </div>
            </div>
          </article>
        ))}

        {/* <button className="offer-banner-compose" type="button">
          <span>+</span>
          <strong>Compose a new banner</strong>
          <small>Drop an image, add copy, schedule</small>
        </button> */}
      </section>
    </div>
  );
};

export default Products;
