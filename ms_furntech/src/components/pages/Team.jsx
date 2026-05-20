import React, { useMemo } from "react";
import ReactTable from "../ui/ReactTable";
import "./Team.scss";

export const teamMembers = [
  {
    id: "U-01",
    name: "Meera Suresh",
    initials: "MS",
    role: "Founder",
    email: "meera@msinteriors.in",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: "U-02",
    name: "Aditya Rao",
    initials: "AR",
    role: "Operations Lead",
    email: "aditya@msinteriors.in",
    status: "Active",
  },
  {
    id: "U-03",
    name: "Sana Khan",
    initials: "SK",
    role: "Customer Success",
    email: "sana@msinteriors.in",
    status: "Active",
  },
  {
    id: "U-04",
    name: "Vikrant Joshi",
    initials: "VJ",
    role: "Inventory Manager",
    email: "vikrant@msinteriors.in",
    status: "Away",
  },
  {
    id: "U-05",
    name: "Rhea Gupta",
    initials: "RG",
    role: "Marketing",
    email: "rhea@msinteriors.in",
    status: "Active",
  },
];

const Team = ({ searchTerm = "" }) => {
  const filteredMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return teamMembers;
    }

    return teamMembers.filter((member) =>
      [member.id, member.name, member.role, member.email, member.status].some(
        (value) => value.toLowerCase().includes(query)
      )
    );
  }, [searchTerm]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "MEMBER",
        cell: ({ row }) => (
          <div className="team-member">
            {row.original.image ? (
              <img src={row.original.image} alt="" />
            ) : (
              <span className="team-member__avatar">{row.original.initials}</span>
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
        cell: ({ getValue }) => <span className="team-email">{getValue()}</span>,
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ getValue }) => {
          const status = getValue();

          return (
            <span className={`team-status team-status--${status.toLowerCase()}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: () => <button className="team-actions" type="button">...</button>,
      },
    ],
    []
  );

  return (
    <div className="team-page">
      <div className="team-page__toolbar">
        <p>{teamMembers.length} members across the MS Interiors team.</p>
        <button type="button">
          <span>+</span>
          Invite member
        </button>
      </div>

      <div className="team-card">
        <ReactTable
          className="team-table"
          data={filteredMembers}
          columns={columns}
          emptyMessage="No team members found."
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default Team;
