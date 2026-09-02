import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export default function ContratoDetalle() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4450";

  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  const load = async () => {
    const { data } = await api.get(`/contratos/${id}`);
    setItem(data);
  };
  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line

  const onDelete = async () => {
    if (role !== "administrador") return;
    await api.delete(`/contratos/${id}`);
    toast.success("Contrato eliminado");
    navigate("/contratos");
  };

  if (!item) return null;
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{item.titulo}</Typography>
          <Typography>Cliente: {item.cliente_id}</Typography>
          <Typography>Inicio: {item.fecha_inicio}</Typography>
          <Typography>Fin: {item.fecha_fin}</Typography>
          {item.descripcion && (
            <Typography>Descripción: {item.descripcion}</Typography>
          )}
          <a
            href={`${apiUrl}/contratos/${id}/file`}
            target="_blank"
            rel="noreferrer"
          >
            Ver archivo
          </a>
          {role === "administrador" && (
            <Button color="error" variant="contained" onClick={onDelete}>
              Eliminar
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
