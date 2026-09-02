import { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import {
  Card,
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import ClientesTabList from "./ClientesTabList";
import ClientesTabCreate from "./ClientesTabCreate";

export default function ClientesList() {
  const [items, setItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/clientes");
      setItems(data || []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onDelete = useCallback(
    async (id) => {
      if (role !== "administrador") return;
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente eliminado");
      load();
    },
    [role, load]
  );

  const handleCreateSuccess = () => {
    setTabValue(0); // Cambiar a la pestaña de listar después de crear
  };

  if (loading && items.length === 0) {
    return (
      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "400px" }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Cargando clientes...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor espera, esto puede tomar unos segundos
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <div className="flex flex-row gap-4">
        <BusinessIcon className="text-primary" sx={{ fontSize: 40 }} />
        <div className="flex flex-col pt-1">
          <Typography variant="h5" color="primary">
            Gestión de Clientes
          </Typography>
          <Typography variant="body" className="!pt-1 !mt-0 text-gray-800">
            Administra la información de tus clientes. Puedes crear, editar y
            eliminar clientes según tus permisos.
          </Typography>
        </div>
      </div>

      <Card sx={{ boxShadow: "0 2px 0px rgba(0,0,0,0.1)" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label="Listar Clientes"
              icon={<ListIcon />}
              iconPosition="start"
              className="!min-h-[auto] !h-auto !pt-4"
            />
            {role === "administrador" && (
              <Tab
                label="Crear Cliente"
                icon={<AddIcon />}
                iconPosition="start"
                className="!min-h-[auto] !h-auto !pt-4"
              />
            )}
          </Tabs>
        </Box>

        {/* Pestaña: Listar Clientes */}
        {tabValue === 0 && (
          <ClientesTabList 
            items={items} 
            onDelete={onDelete} 
            onLoad={load}
            loading={loading}
          />
        )}

        {/* Pestaña: Crear Cliente */}
        {tabValue === 1 && role === "administrador" && (
          <ClientesTabCreate onSuccess={handleCreateSuccess} onLoad={load} />
        )}
      </Card>
    </Stack>
  );
}
