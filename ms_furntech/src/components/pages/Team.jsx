// import React, { useMemo } from "react";
// import ReactTable from "../ui/ReactTable";
// import "./Team.scss";

// export const teamMembers = [
//   {
//     id: "U-01",
//     name: "Meera Suresh",
//     initials: "MS",
//     role: "Founder",
//     email: "meera@msinteriors.in",
//     status: "Active",
//     image:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
//   },
//   {
//     id: "U-02",
//     name: "Aditya Rao",
//     initials: "AR",
//     role: "Operations Lead",
//     email: "aditya@msinteriors.in",
//     status: "Active",
//   },
//   {
//     id: "U-03",
//     name: "Sana Khan",
//     initials: "SK",
//     role: "Customer Success",
//     email: "sana@msinteriors.in",
//     status: "Active",
//   },
//   {
//     id: "U-04",
//     name: "Vikrant Joshi",
//     initials: "VJ",
//     role: "Inventory Manager",
//     email: "vikrant@msinteriors.in",
//     status: "Away",
//   },
//   {
//     id: "U-05",
//     name: "Rhea Gupta",
//     initials: "RG",
//     role: "Marketing",
//     email: "rhea@msinteriors.in",
//     status: "Active",
//   },
// ];

// const Team = ({ searchTerm = "" }) => {
//   const filteredMembers = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();

//     if (!query) {
//       return teamMembers;
//     }

//     return teamMembers.filter((member) =>
//       [member.id, member.name, member.role, member.email, member.status].some(
//         (value) => value.toLowerCase().includes(query)
//       )
//     );
//   }, [searchTerm]);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "name",
//         header: "MEMBER",
//         cell: ({ row }) => (
//           <div className="team-member">
//             {row.original.image ? (
//               <img src={row.original.image} alt="" />
//             ) : (
//               <span className="team-member__avatar">{row.original.initials}</span>
//             )}
//             <div>
//               <strong>{row.original.name}</strong>
//               <small>{row.original.id}</small>
//             </div>
//           </div>
//         ),
//       },
//       {
//         accessorKey: "role",
//         header: "ROLE",
//       },
//       {
//         accessorKey: "email",
//         header: "EMAIL",
//         cell: ({ getValue }) => <span className="team-email">{getValue()}</span>,
//       },
//       {
//         accessorKey: "status",
//         header: "STATUS",
//         cell: ({ getValue }) => {
//           const status = getValue();

//           return (
//             <span className={`team-status team-status--${status.toLowerCase()}`}>
//               {status}
//             </span>
//           );
//         },
//       },
//       {
//         id: "actions",
//         header: "",
//         cell: () => <button className="team-actions" type="button">...</button>,
//       },
//     ],
//     []
//   );

//   return (
//     <div className="team-page">
//       <div className="team-page__toolbar">
//         <p>{teamMembers.length} members across the MS Interiors team.</p>
//         <button type="button">
//           <span>+</span>
//           Invite member
//         </button>
//       </div>

//       <div className="team-card">
//         <ReactTable
//           className="team-table"
//           data={filteredMembers}
//           columns={columns}
//           emptyMessage="No team members found."
//           getRowId={(row) => row.id}
//         />
//       </div>
//     </div>
//   );
// };

// export default Team;

import { useEffect, useMemo, useState } from "react";
import ReactTable from "../ui/ReactTable";
import InviteMemberModal from "./InviteMemberModal";
import { apiRequest } from "../api/api";
import editIcon from "../../assets/edit-pen-2-svgrepo-com.svg";
import deleteIcon from "../../assets/delete-2-svgrepo-com (1).svg";
import "./Team.scss";
import { toast } from "react-toastify";

const Team = ({ searchTerm = "" }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatUser = (user, index = 0) => {
    const roleValue = String(user.role ?? user.roleValue ?? "1");

    return {
      id: user._id || user.id || `U-${index + 1}`,
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      name:
        user.name ||
        `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
        "Unnamed Member",
      initials:
        user.initials ||
        `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase(),
      role: roleValue === "0" ? "Admin" : "Manager",
      roleValue,
      email: user.email || "No Email",
      mobileNumber: user.mobileNumber || user.phone || "",
      status: user.status ? "Active" : "Inactive",
      image: user.image || null,
    };
  };

  const getDeletedEmail = (member) => {
    const [localPart = "member", domain = "deleted.local"] =
      member.email.split("@");
    const safeLocalPart = localPart.replace(/[^a-zA-Z0-9._-]/g, "") || "member";
    const safeId = member.id.replace(/[^a-zA-Z0-9]/g, "");

    return `${safeLocalPart}+deleted-${safeId}-${Date.now()}@${domain}`;
  };

  const getResponseUser = (response, fallbackUser) =>
    response?.data || response?.data?.user || response?.user || fallbackUser;

  const filteredMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      [member.id, member.name, member.role, member.email, member.status].some(
        (value) => value.toLowerCase().includes(query),
      ),
    );
  }, [searchTerm, members]);

  // Called by InviteMemberModal with the constructed payload
  // const handleInvite = async (payload) => {
  //   // ── Send to backend ──────────────────────
  //   // const res = await fetch("/api/team/invite", {
  //   //   method: "POST",
  //   //   headers: { "Content-Type": "application/json" },
  //   //   body: JSON.stringify(payload),
  //   // });
  //   // if (!res.ok) throw new Error("Failed to invite member");

  //   // ── Optimistically add to local list ─────
  //   setMembers((prev) => [
  //     ...prev,
  //     {
  //       id: payload.id,
  //       name: payload.name,
  //       initials: payload.initials,
  //       role: payload.roleTitle,
  //       email: payload.email,
  //       status:
  //         payload.status.charAt(0).toUpperCase() + payload.status.slice(1),
  //     },
  //   ]);

  //   console.log("Invite payload →", payload);
  //   // payload.role is "1" for manager, "0" for admin
  // };

  // const handleInvite = async (payload) => {
  //   try {
  //     const response = await apiRequest("/api/user/create", {
  //       method: "POST",

  //       body: JSON.stringify(payload),
  //     });

  //     console.log("Create User Response:", response);

  //     const createdUser = response.data;

  //     const formattedUser = {
  //       id: createdUser._id || `U-${members.length + 1}`,

  //       name: `${createdUser.firstname || ""} ${
  //         createdUser.lastname || ""
  //       }`.trim(),

  //       initials: `${createdUser.firstname?.[0] || ""}${
  //         createdUser.lastname?.[0] || ""
  //       }`.toUpperCase(),

  //       role: createdUser.role === "0" ? "Admin" : "Manager",

  //       email: createdUser.email || "No Email",

  //       status: createdUser.status ? "Active" : "Inactive",

  //       image: null,
  //     };

  //     setMembers((prev) => [...prev, formattedUser]);

  //     setModalOpen(false);

  //     alert("User created successfully");
  //   } catch (error) {
  //     console.error("Failed to create user:", error);

  //     alert(error.message || "Failed to create user");
  //   }
  // };

  const handleInvite = async (payload) => {
    try {
      const response = await apiRequest("/api/user/create", {
        method: "POST",

        body: JSON.stringify(payload),
      });

      console.log("Create User Response:", response);

      const createdUser = response.data;
      const formattedUser = formatUser(createdUser, members.length);

      setMembers((prev) => [...prev, formattedUser]);

      setModalOpen(false);

      toast.success("User created successfully");
    } catch (error) {
      console.error("Failed to create user:", error);

      toast.error(error.message || "Failed to create user");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedMember(null);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setModalMode("update");
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
    setModalMode("create");
  };

  const handleUpdateMember = async (payload) => {
    if (!selectedMember) return;

    try {
      const response = await apiRequest(`/api/user/${selectedMember.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const updatedMember = formatUser(
        getResponseUser(response, {
          ...selectedMember,
          ...payload,
          _id: selectedMember.id,
        }),
      );

      setMembers((prev) =>
        prev.map((member) =>
          member.id === selectedMember.id ? updatedMember : member,
        ),
      );

      handleCloseModal();
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.message || "Failed to update user");
      throw error;
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    setDeleteLoading(true);

    try {
      await apiRequest(`/api/user/${memberToDelete.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstname: memberToDelete.firstname,
          lastname: memberToDelete.lastname,
          email: getDeletedEmail(memberToDelete),
          mobileNumber: memberToDelete.mobileNumber,
          role: memberToDelete.roleValue,
          status: false,
          is_deleted: true,
        }),
      });

      // await apiRequest(`/api/user/${memberToDelete.id}`, {
      //   method: "DELETE",
      // });

      setMembers((prev) =>
        prev.filter((member) => member.id !== memberToDelete.id),
      );
      setMemberToDelete(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // const data = await apiRequest("/api/user/all");

        // setMembers(data.users || data);

        const response = await apiRequest("/api/user/all");

        const formattedMembers = (response.data || []).map(formatUser);

        setMembers(formattedMembers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "serialNumber",
        header: "SR.NO",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: "MEMBER",
        cell: ({ row }) => (
          <div className="team-member">
            {row.original.image ? (
              <img src={row.original.image} alt="" />
            ) : (
              <span className="team-member__avatar">
                {row.original.initials}
              </span>
            )}
            <div>
              <strong>{row.original.name}</strong>
              <small>{row.original.id}</small>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "ROLE",
      },
      {
        accessorKey: "email",
        header: "EMAIL",
        cell: ({ getValue }) => (
          <span className="team-email">{getValue()}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span
              className={`team-status team-status--${status.toLowerCase()}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => (
          <div className="team-actions">
            <button
              className="team-actions__button"
              type="button"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => openEditModal(row.original)}
            >
              <img src={editIcon} alt="" />
            </button>
            <button
              className="team-actions__button team-actions__button--delete"
              type="button"
              aria-label={`Delete ${row.original.name}`}
              onClick={() => setMemberToDelete(row.original)}
            >
              <img src={deleteIcon} alt="" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="team-page">
      <div className="team-page__toolbar">
        <p>{members.length} members across the MS Interiors team.</p>
        <button type="button" onClick={openCreateModal}>
          <span>+</span>
          Invite member
        </button>
      </div>

      <div className="team-card">
        <ReactTable
          className="team-table"
          data={filteredMembers}
          columns={columns}
          emptyMessage={
            loading ? "Loading team members..." : "No team members found."
          }
          getRowId={(row) => row.id}
        />
      </div>

      <InviteMemberModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onInvite={modalMode === "update" ? handleUpdateMember : handleInvite}
        mode={modalMode}
        member={selectedMember}
      />

      {memberToDelete && (
        <div className="team-delete-overlay" role="dialog" aria-modal="true">
          <div className="team-delete-modal">
            <h3>Delete member?</h3>
            <p>
              Are you sure you wanna delete this member
              <strong> {memberToDelete.name}</strong>?
            </p>
            <div className="team-delete-modal__actions">
              <button
                className="team-delete-modal__cancel"
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="team-delete-modal__delete"
                type="button"
                onClick={handleDeleteMember}
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

export default Team;
