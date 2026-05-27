import { useMemo, useState } from "react";
import bedroomImage from "../../assets/bedroom.jpeg";
import homeOfficeImage from "../../assets/home_office.jpeg";
import kidsRoomImage from "../../assets/kidsroom.jpeg";
import kitchenImage from "../../assets/kitchen.jpeg";
import livingRoomImage from "../../assets/living_room.jpg";
import outdoorImage from "../../assets/outdoor.jpeg";
import "./Categories.scss";

const roomCategories = [
  {
    name: "Living Room",
    count: 6,
    image: livingRoomImage,
    items: [
      "Sofas",
      "Sectionals",
      "Recliners",
      "Accent chairs",
      "Coffee tables",
      "Entertainment units",
    ],
  },
  {
    name: "Bedroom",
    count: 6,
    image: bedroomImage,
    items: [
      "Bed frames",
      "Mattresses",
      "Nightstands",
      "Dressers",
      "Wardrobes",
      "Vanity tables",
    ],
  },
  {
    name: "Dining & Kitchen",
    count: 5,
    image: kitchenImage,
    items: [
      "Dining table sets",
      "Bar stools",
      "Kitchen islands",
      "Sideboards",
      "Buffet tables",
    ],
  },
  {
    name: "Home Office",
    count: 4,
    image: homeOfficeImage,
    items: [
      "Study desks",
      "Ergonomic office chairs",
      "Bookshelves",
      "Filing cabinets",
    ],
  },
  {
    name: "Kids' Room",
    count: 4,
    image: kidsRoomImage,
    items: [
      "Bunk beds",
      "Study tables",
      "Toy storage boxes",
      "Small-scale seating",
    ],
  },
  {
    name: "Outdoor & Patio",
    count: 4,
    image: outdoorImage,
    items: [
      "Outdoor dining sets",
      "Loungers",
      "Hammocks",
      "Weather-proof storage",
    ],
  },
];

const functionCategories = [
  {
    name: "Seating Furniture",
    items: [
      "Armchairs",
      "Stools",
      "Benches",
      "Bean bags",
      "Multi-seater couches",
    ],
  },
  {
    name: "Surfaces & Tables",
    items: ["End tables", "Console tables", "Desks", "Side tables"],
  },
  {
    name: "Storage Units",
    items: [
      "Chest of drawers",
      "Display cabinets",
      "Shoe racks",
      "Media consoles",
    ],
  },
  {
    name: "Sleeping Units",
    items: [
      "Daybeds",
      "Single frames",
      "Double frames",
      "King frames",
      "Sofa-cum-beds",
    ],
  },
];

const designStyles = [
  "Mid-Century Modern",
  "Scandinavian",
  "Industrial",
  "Minimalist",
  "Traditional",
  "Bohemian",
];

const materialFilters = [
  "Hardwood",
  "Teak",
  "Sheesham",
  "Oak",
  "Engineered Wood",
  "Metal",
  "Wicker/Rattan",
  "Glass",
  "Plastic",
];

const utilityCategories = [
  {
    name: "Home Decor & Furnishing",
    items: ["Carpets", "Area rugs", "Lighting", "Mirrors", "Wall art"],
  },
  {
    name: "Custom / Modular",
    items: [
      "Built-to-order wardrobes",
      "Personalized kitchens",
      "Custom upholstery",
    ],
  },
  {
    name: "Sale & Clearance",
    items: ["Discounted stock", "Holiday bundles", "Seasonal liquidation"],
  },
  {
    name: "New Arrivals",
    items: [
      "Latest catalog items",
      "Fresh collections",
      "Returning-user highlights",
    ],
  },
];

const normalize = (value) => value.toLowerCase();

const categoryMatches = (category, query) =>
  normalize(category.name).includes(query) ||
  category.items.some((item) => normalize(item).includes(query));

const filterOptions = {
  rooms: roomCategories.map((category) => category.name),
  functions: functionCategories.map((category) => category.name),
  styles: designStyles,
  materials: materialFilters,
};

const MultiSelectDropdown = ({ label, options, selected, onToggle }) => (
  <details className="category-filter">
    <summary>
      <span>{label}</span>
      <strong>{selected.length || "All"}</strong>
    </summary>
    <div className="category-filter__menu">
      {options.map((option) => (
        <label className="category-filter__option" key={option}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  </details>
);

const Categories = ({ searchTerm = "" }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    rooms: [],
    functions: [],
    styles: [],
    materials: [],
  });
  const query = searchTerm.trim().toLowerCase();

  const toggleFilter = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterKey];

      return {
        ...prev,
        [filterKey]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const visibleRooms = useMemo(() => {
    const selectedRooms = selectedFilters.rooms;

    return roomCategories.filter((category) => {
      const matchesSearch = query ? categoryMatches(category, query) : true;
      const matchesFilter =
        selectedRooms.length === 0 || selectedRooms.includes(category.name);

      return matchesSearch && matchesFilter;
    });
  }, [query, selectedFilters.rooms]);

  const visibleFunctions = useMemo(() => {
    const selectedFunctions = selectedFilters.functions;

    return functionCategories.filter((category) => {
      const matchesSearch = query ? categoryMatches(category, query) : true;
      const matchesFilter =
        selectedFunctions.length === 0 ||
        selectedFunctions.includes(category.name);

      return matchesSearch && matchesFilter;
    });
  }, [query, selectedFilters.functions]);

  const visibleUtilities = useMemo(
    () =>
      query
        ? utilityCategories.filter((category) =>
            categoryMatches(category, query),
          )
        : utilityCategories,
    [query],
  );

  const visibleStyles = useMemo(
    () =>
      designStyles.filter((style) => {
        const matchesSearch = query ? normalize(style).includes(query) : true;
        const matchesFilter =
          selectedFilters.styles.length === 0 ||
          selectedFilters.styles.includes(style);

        return matchesSearch && matchesFilter;
      }),
    [query, selectedFilters.styles],
  );

  const visibleMaterials = useMemo(
    () =>
      materialFilters.filter((material) => {
        const matchesSearch = query
          ? normalize(material).includes(query)
          : true;
        const matchesFilter =
          selectedFilters.materials.length === 0 ||
          selectedFilters.materials.includes(material);

        return matchesSearch && matchesFilter;
      }),
    [query, selectedFilters.materials],
  );

  return (
    <div className="categories-page">
      <div className="categories-toolbar">
        <div>
          <p>Primary navigation, filters, materials, and catalog campaigns.</p>
          <strong>6 rooms · 4 functions · 15 filter tags</strong>
        </div>
        <button type="button">
          <span>+</span>
          Add Category
        </button>
      </div>

      <section className="categories-section">
        <div className="categories-section__header categories-section__header--with-filters">
          <div>
            <p>Room-Based Categories</p>
            <h2>Primary Navigation</h2>
          </div>

          <div className="categories-filter-bar" aria-label="Category filters">
            <MultiSelectDropdown
              label="Rooms"
              options={filterOptions.rooms}
              selected={selectedFilters.rooms}
              onToggle={(value) => toggleFilter("rooms", value)}
            />
            <MultiSelectDropdown
              label="Functions"
              options={filterOptions.functions}
              selected={selectedFilters.functions}
              onToggle={(value) => toggleFilter("functions", value)}
            />
            <MultiSelectDropdown
              label="Styles"
              options={filterOptions.styles}
              selected={selectedFilters.styles}
              onToggle={(value) => toggleFilter("styles", value)}
            />
            <MultiSelectDropdown
              label="Materials"
              options={filterOptions.materials}
              selected={selectedFilters.materials}
              onToggle={(value) => toggleFilter("materials", value)}
            />
          </div>
        </div>

        <div className="room-category-grid">
          {visibleRooms.map((category) => (
            <article className="room-category-card" key={category.name}>
              <div className="room-category-card__image">
                <img src={category.image} alt="" />
              </div>
              <div className="room-category-card__content">
                <div className="room-category-card__top">
                  <span>{category.name.slice(0, 2).toUpperCase()}</span>
                  <small>{category.count} groups</small>
                </div>
                <h3>{category.name}</h3>
                <div className="room-category-card__items">
                  {category.items.map((item) => (
                    <button type="button" key={item}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* <section className="categories-section categories-section--split">
        <div className="function-panel">
          <div className="categories-section__header">
            <p>Function-Based Categories</p>
            <h2>Filtering & Sorting</h2>
          </div>

          <div className="function-list">
            {visibleFunctions.map((category) => (
              <article className="function-list__item" key={category.name}>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.items.join(", ")}</p>
                </div>
                <span>{category.items.length}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="filter-panel">
          <div className="categories-section__header">
            <p>Style & Material Filters</p>
            <h2>Selected Filters</h2>
          </div>

          <div className="filter-group">
            <span className="filter-group__label">Design Styles</span>
            <div className="filter-chip-row">
              {visibleStyles.map((style) => (
                <button type="button" key={style}>
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-group__label">Material Bases</span>
            <div className="filter-chip-row">
              {visibleMaterials.map((material) => (
                <button type="button" key={material}>
                  {material}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-section__header">
          <p>Utility & App-Specific Categories</p>
          <h2>Engagement Menus</h2>
        </div>

        <div className="utility-grid">
          {visibleUtilities.map((category) => (
            <article className="utility-card" key={category.name}>
              <h3>{category.name}</h3>
              <ul>
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default Categories;
