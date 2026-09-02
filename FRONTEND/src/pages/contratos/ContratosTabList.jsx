import { useMemo, useState, useCallback } from "react";
import {
  CardContent,
  Stack,
  Typography,
  Avatar,
  Chip,
  Link as MLink,
  IconButton,
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
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../hooks/useAuth";

export default function ContratosTabList({
  items,
  onDelete,
  onLoad,
  loading = false,
}) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4450";
  const navigate = useNavigate();
  const { role } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contratoToDelete, setContratoToDelete] = useState(null);

  const handleDeleteClick = useCallback((id, titulo) => {
    setContratoToDelete({ id, titulo });
    setOpenDeleteDialog(true);
  }, []);

  const handleDeleteConfirm = () => {
    if (contratoToDelete) {
      onDelete(contratoToDelete.id);
      setOpenDeleteDialog(false);
      setContratoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setContratoToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (fechaFin) => {
    if (!fechaFin) return "default";
    const fin = new Date(fechaFin);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return "error";
    if (diasRestantes <= 7) return "warning";
    if (diasRestantes <= 30) return "info";
    return "success";
  };

  const getStatusLabel = (fechaFin) => {
    if (!fechaFin) return "Sin fecha";
    const fin = new Date(fechaFin);
    const hoy = new Date();
    const diasRestantes = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return `Vencido (${Math.abs(diasRestantes)} días)`;
    if (diasRestantes === 0) return "Vence hoy";
    if (diasRestantes <= 7) return `Vence en ${diasRestantes} días`;
    if (diasRestantes <= 30) return `Vence en ${diasRestantes} días`;
    return "Vigente";
  };

  // Definir las columnas de la tabla
  const columns = useMemo(
    () => [
      {
        accessorKey: "titulo",
        header: "Título",
        size: 250,
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
              {row.original.titulo?.charAt(0)?.toUpperCase() || "C"}
            </Avatar>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, fontSize: "0.9rem" }}
            >
              {row.original.titulo}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: "cliente_nombre",
        header: "Cliente",
        size: 150,
      },
      {
        accessorKey: "fecha_inicio",
        header: "Inicio",
        size: 150,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(row.original.fecha_inicio)}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: "fecha_fin",
        header: "Fin",
        size: 150,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(row.original.fecha_fin)}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 180,
        Cell: ({ row }) => (
          <Chip
            label={getStatusLabel(row.original.fecha_fin)}
            size="small"
            color={getStatusColor(row.original.fecha_fin)}
          />
        ),
      },
      {
        accessorKey: "archivo",
        header: "Archivo",
        size: 150,
        Cell: ({ row }) => (
          <MLink
            href={`${apiUrl}/contratos/${row.original.id}/file`}
            target="_blank"
            rel="noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <AttachFileIcon fontSize="small" />
            Ver archivo
            <OpenInNewIcon fontSize="small" />
          </MLink>
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
                  data-testid={`button-contrato-editar-${row.original.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/contratos/${row.original.id}/editar`);
                  }}
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
                  data-testid={`button-contrato-eliminar-${row.original.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(row.original.id, row.original.titulo);
                  }}
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
    <CardContent className="!p-0 max-w-full" sx={{ position: "relative" }}>
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
            Cargando contratos...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Por favor espera, esto puede tomar unos segundos
          </Typography>
        </Box>
      )}
      <div className="px-6 py-8">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Contratos registrados
        </Typography>
        <Typography variant="body" color="text.secondary">
          El siguiente listado muestra todos los contratos registrados en el
          sistema. Puedes ver los detalles haciendo clic en cada fila.
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
            boxShadow: "none",
            overflow: "hidden",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
            backgroundColor: "#ffffff",
          },
        }}
        muiTableProps={{
          sx: {
            tableLayout: "auto",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "600px",
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
        muiTableBodyRowProps={(row) => ({
          onClick: (e) => {
            // No navegar si se hace clic en un botón
            if (e.target.closest("button")) return;
            navigate(`/contratos/${row.original.id}`);
          },
          sx: {
            cursor: "pointer",
            "&:nth-of-type(even)": {
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
            "&:hover": {
              backgroundColor: "rgba(27, 117, 118, 0.08)",
            },
            transition: "background-color 0.2s ease",
            fontFamily: '"Poppins", "Arial", "sans-serif"',
          },
        })}
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
            ¿Estás seguro de que deseas eliminar el contrato{" "}
            <strong>{contratoToDelete?.titulo}</strong>? Esta acción no se puede
            deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="inherit"
            data-testid="button-contrato-eliminar-cancelar"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            data-testid="button-contrato-eliminar-confirmar"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  );
}
