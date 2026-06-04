import { useMemo, useState } from "react";
import ReactTable from "../ui/ReactTable";
import { requestNotificationPermission } from "../../notification";
import "./Notifications.scss";
import { toast } from "react-toastify";

const activationAreas = [
  "North Sector",
  "Central Sector",
  "South Sector",
  "East Sector",
  "West Sector",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  area: "",
  status: "Draft",
};

const Notifications = ({ searchTerm = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const filteredNotifications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return notifications;
    }

    return notifications.filter((notification) =>
      [
        notification.title,
        notification.description,
        notification.area,
        notification.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [notifications, searchTerm]);

  const columns = useMemo(
    () => [
      {
        id: "serialNumber",
        header: "SR.NO",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "title",
        header: "NOTIFICATION TITLE",
      },
      {
        accessorKey: "description",
        header: "DESCRIPTION",
        cell: ({ getValue }) => (
          <span className="notifications-description">{getValue()}</span>
        ),
      },
      {
        accessorKey: "area",
        header: "AREA OF ACTIVATION",
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ getValue }) => {
          const status = getValue();

          return (
            <span
              className={`notifications-status notifications-status--${status.toLowerCase()}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "ACTIONS",
        cell: () => (
          <button className="notifications-action" type="button">
            View
          </button>
        ),
      },
    ],
    [],
  );

  const openModal = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setSending(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Notification title is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!form.area) {
      nextErrors.area = "Area of activation is required.";
    }

    if (!form.status) {
      nextErrors.status = "Status is required.";
    }

    return nextErrors;
  };

  //   const handleSend = () => {
  //     const validationErrors = validate();

  //     if (Object.keys(validationErrors).length > 0) {
  //       setErrors(validationErrors);
  //       return;
  //     }

  //     setNotifications((prev) => [
  //       ...prev,
  //       {
  //         id: `NOT-${Date.now()}`,
  //         title: form.title.trim(),
  //         description: form.description.trim(),
  //         area: form.area,
  //         status: form.status,
  //       },
  //     ]);

  //     closeModal();
  //   };

  const handleSend = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSending(true);

    try {
      const token =
        localStorage.getItem("fcmToken") ||
        (await requestNotificationPermission());

      if (!token) {
        throw new Error("Unable to get Firebase notification token.");
      }

      const notificationData = {
        id: `NOT-${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        area: form.area,
        status: "Sent",
      };

      const response = await fetch(
        "http://localhost:5000/api/notifications/send-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: notificationData.title,
            description: notificationData.description,
            area: notificationData.area,
            status: notificationData.status,
            token,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send notification");
      }

      setNotifications((prev) => [...prev, notificationData]);

      toast.success("Notification sent successfully");

      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-toolbar">
        <p>{notifications.length} notifications sent from this console.</p>
        <button type="button" onClick={openModal}>
          <span>+</span>
          Add Notification
        </button>
      </div>

      <div className="notifications-card">
        <ReactTable
          className="notifications-table"
          data={filteredNotifications}
          columns={columns}
          emptyMessage="No notification added"
          getRowId={(row) => row.id}
        />
      </div>

      {isModalOpen && (
        <div
          className="notifications-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="notifications-modal">
            <div className="notifications-modal__header">
              <div>
                <p>APP NOTIFICATION</p>
                <h2>Add Notification</h2>
              </div>
              <button type="button" aria-label="Close" onClick={closeModal}>
                x
              </button>
            </div>

            <div className="notifications-form">
              <label className={errors.title ? "has-error" : ""}>
                <span>Notification Title</span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <small>{errors.title}</small>}
              </label>

              <label className={errors.description ? "has-error" : ""}>
                <span>Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                />
                {errors.description && <small>{errors.description}</small>}
              </label>

              <div className="notifications-form__row">
                <label className={errors.area ? "has-error" : ""}>
                  <span>Area of Activation</span>
                  <select name="area" value={form.area} onChange={handleChange}>
                    <option value="" disabled>
                      Select area
                    </option>
                    {activationAreas.map((area) => (
                      <option value={area} key={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.area && <small>{errors.area}</small>}
                </label>

                <label className={errors.status ? "has-error" : ""}>
                  <span>Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Sent">Sent</option>
                    <option value="Active">Active</option>
                    <option value="InActive">Inactive</option>
                  </select>
                  {errors.status && <small>{errors.status}</small>}
                </label>
              </div>
            </div>

            <div className="notifications-modal__footer">
              <button type="button" onClick={closeModal} disabled={sending}>
                Cancel
              </button>
              <button type="button" onClick={handleSend} disabled={sending}>
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
