import React from "react";
import Item1 from "../../assets/item1.png";
import Item2 from "../../assets/item2.jpeg";
import deliverytruck from "../../assets/deliverytruck.svg";
import tick from "../../assets/tickcircle.svg";
import "./OrderDetails.scss";

const timeline = [
  {
    title: "Order placed",
    time: "12 Jan, 09:14 AM",
    status: "done",
    icon: tick,
  },
  {
    title: "Payment confirmed",
    time: "12 Jan, 09:15 AM",
    status: "done",
    icon: tick,
  },
  {
    title: "Workshop assembly",
    time: "13 Jan, 11:32 AM",
    status: "done",
    icon: tick,
  },
  {
    title: "Quality check",
    time: "14 Jan, 04:48 PM",
    status: "done",
    icon: tick,
  },
  {
    title: "Out for delivery",
    time: "Today, 08:00 AM",
    status: "current",
    note: "IN PROGRESS",
    icon: deliverytruck,
  },
  {
    title: "Delivered",
    time: "Expected by 6 PM",
    status: "pending",
  },
];

export const productDetails = [
  {
    id: "MS-SF-201",
    productName: "Velvet Emerald Armchair",
    category: "Chairs",
    quantity: 1,
    price: "42,500",
    image: Item1,
  },
  {
    id: "MS-DC-042",
    productName: "Sage Linen Cushion Set",
    category: "Decor",
    quantity: 2,
    price: "10,800",
    image: Item2,
  },
];

const OrderDetails = ({ onBack }) => {
  return (
    <div className="order-details-page">
      <button className="order-details-back" type="button" onClick={onBack}>
        <span>&lt;</span>
        Back to orders
      </button>

      <div className="order-details-layout">
        <div className="order-details-main">
          <section className="order-details-card order-details-hero">
            <div>
              <p className="order-details-eyebrow">ORDER</p>
              <h2>MS-10247</h2>
              <span>Placed on 12 Jan 2026 - Card payment</span>
            </div>

            <div className="order-details-actions">
              <span className="order-status">In Transit</span>
              <button
                type="button"
                className="order-button order-button--light"
              >
                Print
              </button>
              <button type="button" className="order-button order-button--dark">
                Update Status
              </button>
            </div>
          </section>

          <section className="order-details-card order-timeline-card">
            <p className="order-details-eyebrow">DELIVERY TIMELINE</p>
            <div className="order-timeline">
              {timeline.map((item) => (
                <div
                  className={`order-timeline__item order-timeline__item--${item.status}`}
                  key={item.title}
                >
                  <span className="order-timeline__dot">
                    {item.icon ? (
                      <img src={item.icon} alt="" aria-hidden="true" />
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.time}</p>
                  </div>
                  {item.note && <small>{item.note}</small>}
                </div>
              ))}
            </div>
          </section>

          <section className="order-details-card order-items-card">
            <p className="order-details-eyebrow">ITEMS</p>

            <div className="order-items-list">
              {productDetails.map((item) => (
                <div className="order-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.productName}</strong>
                    <span>{item.id}</span>
                    <p>
                      {item.category} - Qty {item.quantity}
                    </p>
                  </div>
                  <strong className="order-item__price">
                    &#8377;{item.price}
                  </strong>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div>
                <span>Subtotal</span>
                <strong>&#8377;53,300</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong className="order-total__free">Free</strong>
              </div>
              <div>
                <span>Cashback (4%)</span>
                <strong className="order-total__cashback">
                  + &#8377;2,132
                </strong>
              </div>
              <div className="order-total__paid">
                <span>Total Paid</span>
                <strong>&#8377;53,300</strong>
              </div>
            </div>
          </section>
        </div>

        <aside className="order-details-side">
          <section className="order-details-card">
            <p className="order-details-eyebrow">CUSTOMER</p>
            <div className="order-customer">
              <span>AK</span>
              <div>
                <strong>Aanya Kapoor</strong>
                <p>aanya.k@mail.com - +91 98XXXX2210</p>
              </div>
            </div>
            <button className="order-profile-link" type="button">
              View profile -&gt;
            </button>
          </section>

          <section className="order-details-card order-address-card">
            <p className="order-details-eyebrow">DELIVERY ADDRESS</p>
            <h3>A-1204, Lakeside Heights</h3>
            <p>Powai, Mumbai 400076</p>
            <p>Maharashtra, India</p>
            <div className="order-eta">
              <span>o</span>
              ETA today by 6 PM
            </div>
          </section>

          <section className="order-details-card">
            <p className="order-details-eyebrow">PAYMENT</p>
            <div className="order-payment">
              <span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="7" width="16" height="10" rx="1.5" />
                  <path d="M4 10h16" />
                </svg>
              </span>
              <div>
                <strong>HDFC &bull;&bull;&bull;&bull; 4421</strong>
                <p>Captured - Txn #PAY-89234</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;
