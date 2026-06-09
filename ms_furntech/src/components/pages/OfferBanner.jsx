import React, { useMemo, useState, useEffect } from "react";
import BannerFallBack from "../../assets/banner1.png";
import Banner2 from "../../assets/banner2.png";
import Banner3 from "../../assets/banner3.png";
import "./OfferBanner.scss";
// import "./AddOfferBannerModal";
import AddOfferBannerModal from "./AddOfferBannerModal";
import { toast } from "react-toastify";
import { apiRequest } from "../api/api";
import deleteIcon from "../../assets/delete-2-svgrepo-com (1).svg";

const banners = [
  {
    id: "home-hero",
    label: "HOME HERO",
    title: "The Spring Atelier",
    subtitle: "Up to 30% off curated living rooms",
    dates: "Jan 5 - Feb 14, 2026",
    status: "Live",
    image: BannerFallBack,
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

const getBannersFromResponse = (response) =>
  response?.data?.banners || response?.banners || [];

const getBannerStatus = (banner) => {
  if (!banner.status) return "Inactive";
  return "Active";
};

// const formatBanner = (banner) => {
//   // const quantity = Number(product.productQuantity) || 0;
//   const status = getProductStatus(product);
//   // const category =
//   //   product.categoryId?.name ||
//   //   product.categoryName ||
//   //   product.categoryId ||
//   //   "";

//   return {
//     id: banner._id || bannner.id || banner.productCode,
//     title: product.title || "Untitled Banner",
//     // category,
//     // title: product.productCode || "No product code",
//     // subtitle:
//     //   product.description || product.productMaterial || "No description added",
//     // dates: `Qty ${quantity} · ${formatCurrency(product.productPrice)}`,
//     // priceFormatted: formatCurrency(product.productPrice),
//     // stockLabel: `${quantity} in stock`,
//     status,
//     image: product.bannerImage || BannerFallBack,
//     // material: product.productMaterial || "",
//     // code: product.productCode || "",
//     // source: product,
//   };
// };

const formatBanner = (banner) => ({
  id: banner._id || banner.id,
  title: banner.title || "Untitled Banner",
  subtitle: banner.linkUrl || "",
  dates: banner.createdAt
    ? new Date(banner.createdAt).toLocaleDateString()
    : "",
  status: getBannerStatus(banner),
  imageFile: null,
  image: banner.imageUrl,
  source: banner,
});

const OfferBanner = ({ searchTerm = "" }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // useEffect(() => {
  //   const fetchBanners = async () => {
  //     try {
  //       const response = await apiRequest("/api/banner/all");
  //       setBanners(getBannersFromResponse(response).map(formatBanner));
  //     } catch (err) {
  //       console.error(err);
  //       // setError("Failed to load products. Please try again.");
  //       toast.error("Failed to load banners. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBanners();
  // }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await apiRequest("/api/banner/all");

        setBanners(getBannersFromResponse(response).map(formatBanner));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load banners.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // const visibleBanners = useMemo(() => {
  //   const query = searchTerm.trim().toLowerCase();

  //   if (!query) {
  //     return banners;
  //   }

  //   return banners.filter((banner) =>
  //     [
  //       // banner.label,
  //       banner.title,
  //       // banner.subtitle,
  //       // banner.dates,
  //       banner.status,
  //     ].some((value) => value.toLowerCase().includes(query)),
  //   );
  // }, [searchTerm]);

  const visibleBanners = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return banners;
    }

    return banners.filter((banner) =>
      [banner.title, banner.subtitle, banner.status]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query)),
    );
  }, [banners, searchTerm]);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedBanner(null);
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    console.log("SelectedBanner:", banner);
    setModalMode("update");
    setSelectedBanner(banner);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBanner(null);
    setModalMode("create");
  };

  const handleCreateBanner = async (payload) => {
    try {
      const response = await apiRequest("/api/banner/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const createdBanner = formatBanner(
        response?.data || {
          ...payload,
          _id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
      );

      setBanners((prev) => [...prev, createdBanner]);

      toast.success("Banner created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create banner");
      throw err;
    }
  };

  const handleUpdateBanner = async (payload) => {
    if (!selectedBanner) return;

    try {
      const response = await apiRequest(`/api/banner/${selectedBanner.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const updatedBanner = formatBanner({
        ...selectedBanner.source,
        ...payload,
        ...(response?.data || {}),
      });

      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === selectedBanner.id ? updatedBanner : banner,
        ),
      );

      toast.success("Banner updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update banner");
      throw err;
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    setDeleteLoading(true);

    try {
      await apiRequest(`/api/banner/${bannerToDelete.id}`, {
        method: "DELETE",
      });

      setBanners((prev) =>
        prev.filter((banner) => banner.id !== bannerToDelete.id),
      );

      setBannerToDelete(null);

      toast.success("Banner deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete banner");
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <div className="offer-banner-page">
      <div className="offer-banner-toolbar">
        <p>Magazine-style banners shown across the customer app.</p>
        <button type="button" onClick={openCreateModal}>
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
                {/* <button type="button" aria-label={`Edit ${banner.title}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4z" />
                    <path d="M13.5 6.5l4 4" />
                  </svg>
                </button> */}

                <button
                  type="button"
                  aria-label={`Edit ${banner.title}`}
                  onClick={() => openEditModal(banner)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4z" />
                    <path d="M13.5 6.5l4 4" />
                  </svg>
                </button>
                <button
                  className="team-actions__button team-actions__button--delete"
                  type="button"
                  aria-label={`Edit ${banner.name}`}
                  onClick={() => setBannerToDelete(banner)}
                >
                  <img src={deleteIcon} alt="" />
                </button>
                {/* <button className="offer-banner-card__manage" type="button">
                  Manage
                </button> */}
              </div>
            </div>
          </article>
        ))}

        <button
          className="offer-banner-compose"
          type="button"
          onClick={openCreateModal}
        >
          <span>+</span>
          <strong>Compose a new banner</strong>
          <small>Drop an image, add copy, schedule</small>
        </button>
      </section>

      <AddOfferBannerModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={
          modalMode === "update" ? handleUpdateBanner : handleCreateBanner
        }
        // onSubmit={handleCreateBanner}
        mode={modalMode}
        banner={selectedBanner}
      />

      {bannerToDelete && (
        <div className="team-delete-overlay" role="dialog" aria-modal="true">
          <div className="team-delete-modal">
            <h3>Delete banner?</h3>
            <p>
              Are you sure you want to delete
              <strong> {bannerToDelete.name}</strong>?
            </p>
            <div className="team-delete-modal__actions">
              <button
                className="team-delete-modal__cancel"
                type="button"
                onClick={() => setBannerToDelete(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="team-delete-modal__delete"
                type="button"
                onClick={handleDeleteBanner}
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

export default OfferBanner;
