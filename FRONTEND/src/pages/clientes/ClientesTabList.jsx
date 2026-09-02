import { useMemo, useState, useCallback } from "react";
import {
  CardContent,
  IconButton,
  Stack,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ClientesTabList({ items, onDelete, onLoad, loading = false }) {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  const handleDeleteClick = useCallback((id, nombreCliente) => {
    setClienteToDelete({ id, nombreCliente });
    setOpenDeleteDialog(true);
  }, []);

  const handleDeleteConfirm = () => {
    if (clienteToDelete) {
      onDelete(clienteToDelete.id);
      setOpenDeleteDialog(false);
      setClienteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setClienteToDelete(null);
  };

  // Definir las columnas de la tabla
  const columns = useMemo(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
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
              {row.original.nombre?.charAt(0)?.toUpperCase() || "C"}
            </Avatar>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, fontSize: "0.9rem" }}
            >
              {row.original.nombre}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: "correo",
        header: "Correo",
        size: 250,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {row.original.correo}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: "telefono",
        header: "Teléfono",
        size: 150,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {row.original.telefono}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: "direccion",
        header: "Dirección",
        size: 200,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.original.direccion}
            </Typography>
          </Stack>
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
                  data-testid={`button-cliente-editar-${row.original.id}`}
                  onClick={() =>
                    navigate(`/clientes/${row.original.id}/editar`)
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
                  data-testid={`button-cliente-eliminar-${row.original.id}`}
                  onClick={() =>
                    handleDeleteClick(row.original.id, row.original.nombre)
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
    <CardContent className="!p-0" sx={{ position: "relative" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Cargando clientes...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Por favor espera, esto puede tomar unos segundos
          </Typography>
        </Box>
      )}
      <div className="px-6 py-8">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Clientes registrados
        </Typography>
        <Typography variant="body" color="text.secondary">
          El siguiente listado muestra todos los clientes registrados en el
          sistema. Puedes editar y eliminar clientes según tus permisos.
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
        muiTableBodyRowProps={{
          sx: {
            "&:nth-of-type(even)": {
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
            "&:hover": {
              backgroundColor: "rgba(27, 117, 118, 0.08)",
            },
            transition: "background-color 0.2s ease",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
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
            ¿Estás seguro de que deseas eliminar al cliente{" "}
            <strong>{clienteToDelete?.nombreCliente}</strong>? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit" data-testid="button-cliente-eliminar-cancelar">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            data-testid="button-cliente-eliminar-confirmar"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  );
}
