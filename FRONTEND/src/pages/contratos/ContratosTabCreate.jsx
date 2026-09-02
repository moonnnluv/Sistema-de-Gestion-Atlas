import { useState, useEffect } from "react";
import {
  Button,
  CardContent,
  Stack,
  TextField,
  Typography,
  Divider,
  MenuItem,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function ContratosTabCreate({ onSuccess, onLoad }) {
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
      } catch (error) {
        toast.error("Error al cargar clientes");
      }
    })();
  }, []);

  const onCreate = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v ?? ""));
    if (file) formData.append("file", file);

    await api.post("/contratos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Contrato creado");
    setForm({
      cliente_id: "",
      titulo: "",
      fecha_inicio: "",
      fecha_fin: "",
      descripcion: "",
    });
    setFile(null);
    onLoad();
    onSuccess(); // Cambiar a la pestaña de listar después de crear
  };

  return (
    <CardContent className="!p-6">
      <div className="py-2">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Crear nuevo contrato
        </Typography>
        <Typography variant="body" color="text.secondary">
          Ingresa los datos del nuevo contrato para crearlo en el sistema.
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
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
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
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
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
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Fecha fin"
            type="date"
            value={form.fecha_fin}
            onChange={(e) =>
              setForm((f) => ({ ...f, fecha_fin: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
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
          variant="outlined"
          fullWidth
        />
        <TextField
          type="file"
          label="Archivo"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            accept: ".pdf,.doc,.docx,.xls,.xlsx",
          }}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          variant="outlined"
          fullWidth
          helperText="El archivo debe ser un PDF, DOC, DOCX, XLS o XLSX"
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={onCreate}
            startIcon={<DescriptionIcon />}
            sx={{
              minWidth: 150,
              backgroundColor: "#1B7576",
              "&:hover": {
                backgroundColor: "#155a5b",
              },
            }}
          >
            Crear Contrato
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  );
}
