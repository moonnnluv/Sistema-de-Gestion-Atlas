import { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { Card, Box, Typography, Tabs, Tab, Stack } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import UsuariosTabList from "./UsuariosTabList";
import UsuariosTabCreate from "./UsuariosTabCreate";

export default function UsuariosList() {
  const [items, setItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const { role } = useAuth();

  const load = useCallback(async () => {
    const { data } = await api.get("/empresa-usuarios");
    setItems(data || []);
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
      await api.delete(`/usuarios/${id}`);
      toast.success("Usuario eliminado");
      load();
    },
    [role, load]
  );

  const handleCreateSuccess = () => {
    setTabValue(0); // Cambiar a la pestaña de listar después de crear
  };

  return (
    <Stack spacing={3}>
      <div className="flex flex-row gap-4">
        <PeopleIcon className="text-primary" sx={{ fontSize: 40 }} />
        <div className="flex flex-col pt-1">
          <Typography variant="h5" color="primary">
            Gestión de Usuarios
          </Typography>
          <Typography variant="body" className="!pt-1 !mt-0 text-gray-800">
            Administra los usuarios del sistema. Puedes crear, editar y eliminar
            usuarios según tus permisos.
          </Typography>
        </div>
      </div>

      <Card sx={{ boxShadow: "0 2px 0px rgba(0,0,0,0.1)" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label="Listar Usuarios"
              icon={<PeopleIcon />}
              iconPosition="start"
              className="!min-h-[auto] !h-auto !pt-4"
            />
            {role === "administrador" && (
              <Tab
                label="Crear Usuario"
                icon={<PersonAddIcon />}
                iconPosition="start"
                className="!min-h-[auto] !h-auto !pt-4"
              />
            )}
          </Tabs>
        </Box>

        {/* Pestaña: Listar Usuarios */}
        {tabValue === 0 && (
          <UsuariosTabList items={items} onDelete={onDelete} onLoad={load} />
        )}

        {/* Pestaña: Crear Usuario */}
        {tabValue === 1 && role === "administrador" && (
          <UsuariosTabCreate onSuccess={handleCreateSuccess} onLoad={load} />
        )}
      </Card>
    </Stack>
  );
}
