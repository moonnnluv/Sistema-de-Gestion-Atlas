import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Divider,
  MenuItem,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ContratoForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cliente_id: "",
    titulo: "",
    fecha_inicio: "",
    fecha_fin: "",
    descripcion: "",
  });
  const [clientes, setClientes] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/clientes");
        setClientes(data || []);
      } catch {
        toast.error("Error al cargar clientes");
      }
    })();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/contratos/${id}`);
        setForm({
          cliente_id: data.cliente_id ? String(data.cliente_id) : "",
          titulo: data.titulo || "",
          fecha_inicio: data.fecha_inicio || "",
          fecha_fin: data.fecha_fin || "",
          descripcion: data.descripcion || "",
        });
      } catch {
        toast.error("Error al cargar contrato");
      }
    })();
  }, [id, isEdit]);

  const onSubmit = async () => {
    if (
      !form.cliente_id ||
      !form.titulo ||
      !form.fecha_inicio ||
      !form.fecha_fin
    ) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v ?? ""));
      if (file) formData.append("file", file);

      if (isEdit) {
        await api.put(`/contratos/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Contrato actualizado");
      } else {
        await api.post("/contratos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Contrato creado");
      }
      navigate("/contratos");
    } catch {
      // El error ya se maneja en el interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      {isEdit && (
        <div className="flex flex-row gap-4">
          <DescriptionIcon className="text-primary" sx={{ fontSize: 40 }} />
          <div className="flex flex-col pt-1">
            <Typography variant="h5" color="primary">
              Editar Contrato
            </Typography>
            <Typography variant="body" className="!pt-1 !mt-0 text-gray-800">
              Actualiza la información del contrato en el sistema. Puedes
              modificar todos los datos del contrato según tus permisos.
            </Typography>
          </div>
        </div>
      )}

      <Card sx={{ boxShadow: "0 2px 0px rgba(0,0,0,0.1)" }}>
        <CardContent className="!p-6">
          <div className="py-2">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isEdit ? "Editar contrato" : "Crear nuevo contrato"}
            </Typography>
            <Typography variant="body" color="text.secondary">
              {isEdit
                ? "Actualiza los datos del contrato en el sistema."
                : "Ingresa los datos del nuevo contrato para crearlo en el sistema."}
            </Typography>
          </div>
          <Divider sx={{ mb: 3, mt: 2 }} />
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                select
                label="Cliente"
                value={form.cliente_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cliente_id: e.target.value }))
                }
                inputProps={{ "data-testid": "select-contrato-cliente" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              >
                <MenuItem value="">
                  <em>Seleccione un cliente</em>
                </MenuItem>
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Título"
                value={form.titulo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, titulo: e.target.value }))
                }
                inputProps={{ "data-testid": "input-contrato-titulo" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
            </Stack>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                label="Fecha inicio"
                type="date"
                value={form.fecha_inicio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fecha_inicio: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ "data-testid": "input-contrato-fecha-inicio" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Fecha fin"
                type="date"
                value={form.fecha_fin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fecha_fin: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ "data-testid": "input-contrato-fecha-fin" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
            </Stack>
            <TextField
              label="Descripción"
              multiline
              rows={3}
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
              inputProps={{ "data-testid": "input-contrato-descripcion" }}
              variant="outlined"
              fullWidth
            />
            <TextField
              type="file"
              label="Archivo"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                accept: ".pdf",
                "data-testid": "input-contrato-archivo",
              }}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              variant="outlined"
              fullWidth
              helperText={
                isEdit
                  ? "Deja vacío para mantener el archivo actual o selecciona uno nuevo"
                  : "El archivo debe ser en formato PDF"
              }
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                data-testid="button-contrato-cancelar"
                onClick={() => navigate("/contratos")}
                sx={{
                  minWidth: 120,
                  borderColor: "divider",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                data-testid="button-contrato-guardar"
                onClick={onSubmit}
                disabled={loading}
                startIcon={isEdit ? <EditIcon /> : <DescriptionIcon />}
                sx={{
                  minWidth: 150,
                  backgroundColor: "#1B7576",
                  "&:hover": {
                    backgroundColor: "#155a5b",
                  },
                }}
              >
                {isEdit ? "Actualizar Contrato" : "Crear Contrato"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
