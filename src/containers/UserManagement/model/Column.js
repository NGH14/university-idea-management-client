export const Column = [
  {
    field: "no",
    headerName: "No.",
    disableColumnMenu: true,
    sortable: false,
    width: "100%",
    type: "number",
    minWidth: 100,
    flex: 1,
    align: "center",
    headerAlign: "center",

    renderCell: (value) => {
      return <div>{value.api.getRowIndex(value.id) + 1}</div>;
    },
  },
  {
    field: "full_name",
    // headerAlign: "center",
    headerName: "Full name",
    disableColumnMenu: true,
    sortable: true,
    width: "100%",
    type: "string",
    minWidth: 200,
    flex: 1,
  },

  {
    field: "email",
    headerName: "Email",
    // headerAlign: "center",
    disableColumnMenu: true,
    sortable: true,
    type: "email",
    width: "auto",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "department",
    headerName: "Department",
    // headerAlign: "center",
    disableColumnMenu: true,
    sortable: true,
    type: "string",
    width: "auto",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "role",
    headerName: "Role",
    align: "center",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: true,
    width: "auto",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "date_of_birth",
    // headerAlign: "center",
    headerName: "Birthday",
    disableColumnMenu: true,
    sortable: false,
    width: "auto",
    minWidth: 200,
    type: "date",

    flex: 1,
  },
];
