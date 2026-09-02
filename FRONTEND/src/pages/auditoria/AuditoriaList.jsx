import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "../../lib/api";
import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import HistoryIcon from "@mui/icons-material/History";
import EventIcon from "@mui/icons-material/Event";

export default function AuditoriaList() {
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    const { data } = await api.get("/auditoria");
    setItems(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Definir las columnas de la tabla
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        Cell: ({ row }) => `#${row.original.id}`,
      },
      {
        accessorKey: "accion",
        header: "Acción",
        size: 400,
      },
      {
        accessorKey: "usuario_id",
        header: "Usuario",
        size: 200,
      },
      {
        accessorKey: "fecha_hora",
        header: "Fecha y Hora",
        size: 250,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <EventIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(row.original.fecha_hora || row.original.fecha)}
            </Typography>
          </Stack>
        ),
      },
    ],
    []
  );

  return (
    <Stack spacing={3}>
      <div className="flex flex-row gap-4">
        <HistoryIcon className="text-primary" sx={{ fontSize: 40 }} />
        <div className="flex flex-col pt-1">
          <Typography variant="h5" color="primary">
            Auditoría
          </Typography>
          <Typography variant="body" className="!pt-1 !mt-0 text-gray-800">
            Historial completo de todas las acciones realizadas en el sistema.
            Rastrea cambios, creaciones y eliminaciones.
          </Typography>
        </div>
      </div>

      {/* Tabla de auditoría */}
      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <CardContent className="!p-0">
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
        </CardContent>
      </Card>
    </Stack>
  );
}
