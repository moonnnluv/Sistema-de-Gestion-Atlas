import { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { 
  Card, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Stack, 
  CircularProgress 
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { useAuth } from "../../hooks/useAuth";
import ContratosTabList from "./ContratosTabList";
import ContratosTabCreate from "./ContratosTabCreate";

export default function ContratosList() {
  const [items, setItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/contratos");
      setItems(data || []);
    } catch (error) {
      console.error("Error al cargar contratos:", error);
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

  const handleCreateSuccess = () => {
    setTabValue(0); // Cambiar a la pestaña de listar después de crear
  };

  const onDelete = useCallback(
    async (id) => {
      if (role !== "administrador") return;
      await api.delete(`/contratos/${id}`);
      toast.success("Contrato eliminado");
      load();
    },
    [role, load]
  );

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
          Cargando contratos...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor espera, esto puede tomar unos segundos
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} maxWidth="100%">
      <div className="flex flex-row gap-4">
        <DescriptionIcon className="text-primary" sx={{ fontSize: 40 }} />
        <div className="flex flex-col pt-1">
          <Typography variant="h5" color="primary">
            Gestión de Contratos
          </Typography>
          <Typography variant="body" className="!pt-1 !mt-0 text-gray-800">
            Administra todos los contratos de tus clientes. Puedes crear, editar
            y visualizar contratos según tus permisos.
          </Typography>
        </div>
      </div>

      <Card sx={{ boxShadow: "0 2px 0px rgba(0,0,0,0.1)" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label="Listar Contratos"
              icon={<ListIcon />}
              iconPosition="start"
              className="!min-h-[auto] !h-auto !pt-4"
            />
            {role === "administrador" && (
              <Tab
                label="Crear Contrato"
                icon={<AddIcon />}
                iconPosition="start"
                className="!min-h-[auto] !h-auto !pt-4"
              />
            )}
          </Tabs>
        </Box>

        {/* Pestaña: Listar Contratos */}
        {tabValue === 0 && (
          <ContratosTabList 
            items={items} 
            onDelete={onDelete} 
            onLoad={load}
            loading={loading}
          />
        )}

        {/* Pestaña: Crear Contrato */}
        {tabValue === 1 && role === "administrador" && (
          <ContratosTabCreate onSuccess={handleCreateSuccess} onLoad={load} />
        )}
      </Card>
    </Stack>
  );
}
