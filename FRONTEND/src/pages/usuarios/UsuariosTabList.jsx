import { useMemo, useState } from "react";
import {
  IconButton,
  Stack,
  Typography,
  Avatar,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function UsuariosTabList({ items, onDelete }) {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (id, nombreUsuario) => {
    setUserToDelete({ id, nombreUsuario });
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  // Definir las columnas de la tabla
  const columns = useMemo(
    () => [
      {
        accessorKey: "nombre_usuario",
        header: "Usuario",
        size: 200,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 32,
                height: 32,
                fontSize: "0.875rem",
                color: "white",
              }}
            >
              {row.original.nombre_usuario?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, fontSize: "0.9rem" }}
            >
              {row.original.nombre_usuario}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: "correo",
        header: "Correo",
        size: 250,
      },
      {
        accessorKey: "rol",
        header: "Rol",
        size: 150,
        Cell: ({ row }) => (
          <Typography variant="body">
            {row.original.rol || row.original.rol_nombre || "N/A"}
          </Typography>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Creación",
        size: 180,
        Cell: ({ row }) => (
          <Typography variant="body">
            {row.original.created_at || "N/A"}
          </Typography>
        ),
      },
      {
        id: "acciones",
        header: "Acciones",
        size: 120,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {role === "administrador" ? (
              <>
                <IconButton
                  color="primary"
                  size="small"
                  data-testid={`button-usuario-editar-${row.original.id}`}
                  onClick={() =>
                    navigate(`/usuarios/${row.original.id}/editar`)
                  }
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  data-testid={`button-usuario-eliminar-${row.original.id}`}
                  onClick={() =>
                    handleDeleteClick(
                      row.original.id,
                      row.original.nombre_usuario
                    )
                  }
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Solo lectura
              </Typography>
            )}
          </Stack>
        ),
      },
    ],
    [role, navigate, handleDeleteClick]
  );

  return (
    <CardContent className="!p-0 bg-white">
      <div className="px-6 py-8">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Usuarios registrados en tu empresa
        </Typography>
        <Typography variant="body" color="text.secondary">
          El siguiente listado muestra todos los usuarios registrados en tu
          empresa y quienes tienen acceso a los datos dependiendo de su rol.
        </Typography>
      </div>
      <MaterialReactTable
        columns={columns}
        data={items}
        enableColumnResizing={false}
        enablePagination
        enableBottomToolbar
        enableTopToolbar={false}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableGlobalFilter={false}
        enableColumnFilters={false}
        enableHiding={false}
        layoutMode="grid"
        initialState={{
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
          density: "comfortable",
        }}
        localization={MRT_Localization_ES}
        muiTablePaperProps={{
          sx: {
            width: "100%",
            maxWidth: "100%",
            boxShadow: "none",
            overflow: "hidden",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
            backgroundColor: "#ffffff",
          },
        }}
        muiTableProps={{
          sx: {
            width: "100%",
            minWidth: "100%",
            tableLayout: "auto",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "600px",
            width: "100%",
            overflowX: "auto",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#CBE3E4",
            fontWeight: 600,
            fontSize: "1rem",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        }}
        muiTableHeadProps={{
          sx: {
            width: "100%",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        }}
        muiTableBodyProps={{
          sx: {
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        }}
        displayColumnDefOptions={{
          "mrt-row-actions": {
            size: 120,
          },
        }}
      />
      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <strong>{userToDelete?.nombreUsuario}</strong>? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit" data-testid="button-usuario-eliminar-cancelar">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            data-testid="button-usuario-eliminar-confirmar"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  );
}
