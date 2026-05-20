import React, { useMemo } from "react";
import Banner1 from "../../assets/banner1.png";
import Banner2 from "../../assets/banner2.png";
import Banner3 from "../../assets/banner3.png";
import "./OfferBanner.scss";

const banners = [
  {
    id: "home-hero",
    label: "HOME HERO",
    title: "The Spring Atelier",
    subtitle: "Up to 30% off curated living rooms",
    dates: "Jan 5 - Feb 14, 2026",
    status: "Live",
    image: Banner1,
  },
  {
    id: "catalog-top",
    label: "CATALOG TOP",
    title: "Heritage Wood Series",
    subtitle: "Solid oak tables, hand-finished",
    dates: "Feb 15 - Mar 31, 2026",
    status: "Scheduled",
    image: Banner2,
  },
  {
    id: "wallet-top",
    label: "WALLET TOP",
    title: "Cashback Carnival",
    subtitle: "Earn 6% back on every order this week",
    dates: "Mar 1 - Mar 10, 2026",
    status: "Live",
    image: Banner3,
  },
];

const OfferBanner = ({ searchTerm = "" }) => {
  const visibleBanners = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return banners;
    }

    return banners.filter((banner) =>
      [banner.label, banner.title, banner.subtitle, banner.dates, banner.status].some(
        (value) => value.toLowerCase().includes(query)
      )
    );
  }, [searchTerm]);

  return (
    <div className="offer-banner-page">
      <div className="offer-banner-toolbar">
        <p>Magazine-style banners shown across the customer app.</p>
        <button type="button">
          <span>+</span>
          New Banner
        </button>
      </div>

      <section className="offer-banner-grid">
        {visibleBanners.map((banner) => (
          <article className="offer-banner-card" key={banner.id}>
            <div className="offer-banner-card__image">
              <img src={banner.image} alt="" />
              <span className="offer-banner-card__label">{banner.label}</span>
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

        <button className="offer-banner-compose" type="button">
          <span>+</span>
          <strong>Compose a new banner</strong>
          <small>Drop an image, add copy, schedule</small>
        </button>
      </section>
    </div>
  );
};

export default OfferBanner;
