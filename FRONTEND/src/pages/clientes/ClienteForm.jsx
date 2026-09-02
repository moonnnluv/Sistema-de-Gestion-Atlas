import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business";
import { api } from "../../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ClienteForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Información del cliente
    es_empresa: false,
    rut: "",
    nombre: "",
    nombre_fantasia: "",
    giro_actividad_economica: "",
    // Información del representante
    nombre_representante: "",
    cargo_representante: "",
    correo_representante: "",
    telefono_representante: "",
    relacion_representante: "",
    // Información de contacto
    direccion_calle: "",
    direccion_numero: "",
    direccion_ciudad: "",
    direccion_region: "",
    sitio_web: "",
    telefono_corporativo: "",
    correo: "",
    telefono: "",
    direccion: "",
    // Información financiera
    metodo_pago: "",
    dia_pago: "",
    moneda: "",
    nombre_banco: "",
    numero_cuenta: "",
    titular_cuenta: "",
  });

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/clientes/${id}`);
        setForm({
          // Información del cliente
          es_empresa: data.es_empresa || false,
          rut: data.rut || "",
          nombre: data.nombre || "",
          nombre_fantasia: data.nombre_fantasia || "",
          giro_actividad_economica: data.giro_actividad_economica || "",
          // Información del representante
          nombre_representante: data.nombre_representante || "",
          cargo_representante: data.cargo_representante || "",
          correo_representante: data.correo_representante || "",
          telefono_representante: data.telefono_representante || "",
          relacion_representante: data.relacion_representante || "",
          // Información de contacto
          direccion_calle: data.direccion_calle || "",
          direccion_numero: data.direccion_numero || "",
          direccion_ciudad: data.direccion_ciudad || "",
          direccion_region: data.direccion_region || "",
          sitio_web: data.sitio_web || "",
          telefono_corporativo: data.telefono_corporativo || "",
          correo: data.correo || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          // Información financiera
          metodo_pago: data.metodo_pago || "",
          dia_pago: data.dia_pago || "",
          moneda: data.moneda || "",
          nombre_banco: data.nombre_banco || "",
          numero_cuenta: data.numero_cuenta || "",
          titular_cuenta: data.titular_cuenta || "",
        });
      } catch {
        toast.error("Error al cargar cliente");
      }
    })();
  }, [id, isEdit]);

  const onSubmit = async () => {
    if (!form.nombre || !form.correo) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/clientes/${id}`, form);
        toast.success("Cliente actualizado");
      } else {
        await api.post("/clientes", form);
        toast.success("Cliente creado");
      }
      navigate("/clientes");
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
          <BusinessIcon className="text-primary" sx={{ fontSize: 40 }} />
          <div className="flex flex-col pt-1">
            <Typography variant="h5" color="primary">
              Editar Cliente
            </Typography>
            <Typography variant="body" className="!pt-1 !mt-0 text-gray-800">
              Actualiza la información del cliente en el sistema. Puedes
              modificar todos los datos del cliente según tus permisos.
            </Typography>
          </div>
        </div>
      )}

      <Card sx={{ boxShadow: "0 2px 0px rgba(0,0,0,0.1)" }}>
        <CardContent className="!p-6">
          <div className="py-2">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isEdit ? "Editar cliente" : "Crear nuevo cliente"}
            </Typography>
            <Typography variant="body" color="text.secondary">
              {isEdit
                ? "Actualiza los datos del cliente en el sistema."
                : "Ingresa los datos del nuevo cliente para crearlo en el sistema."}
            </Typography>
          </div>
          <Divider sx={{ mb: 3, mt: 2 }} />
          <Stack spacing={4}>
            {/* 1. Información del cliente */}
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                1. Información del cliente
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Tipo de cliente</InputLabel>
                  <Select
                    value={form.es_empresa ? "empresa" : "persona"}
                    label="Tipo de cliente"
                    inputProps={{ "data-testid": "select-cliente-tipo" }}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, es_empresa: e.target.value === "empresa" }))
                    }
                  >
                    <MenuItem value="persona">Persona</MenuItem>
                    <MenuItem value="empresa">Empresa</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="rut-cliente-form"
                  label="RUT"
                  value={form.rut}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rut: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-rut" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                />
                <TextField
                  id="nombre-cliente-form"
                  label="Nombre completo"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-nombre" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="nombre-fantasia-cliente-form"
                  label="Nombre de fantasía"
                  value={form.nombre_fantasia}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre_fantasia: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-nombre-fantasia" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="giro-cliente-form"
                  label="Giro o actividad económica"
                  value={form.giro_actividad_economica}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, giro_actividad_economica: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-giro" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
            </Stack>

            <Divider />

            {/* 2. Información del representante del cliente */}
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                2. Información del representante del cliente
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="nombre-representante-cliente-form"
                  label="Nombre del representante"
                  value={form.nombre_representante}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre_representante: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-nombre-representante" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="cargo-representante-cliente-form"
                  label="Cargo del representante"
                  value={form.cargo_representante}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cargo_representante: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-cargo-representante" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="correo-representante-cliente-form"
                  label="Correo del representante"
                  type="email"
                  value={form.correo_representante}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, correo_representante: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-correo-representante" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="telefono-representante-cliente-form"
                  label="Teléfono del representante"
                  value={form.telefono_representante}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, telefono_representante: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-telefono-representante" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
              <TextField
                id="relacion-representante-cliente-form"
                label="Relación"
                value={form.relacion_representante}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relacion_representante: e.target.value }))
                }
                inputProps={{ "data-testid": "input-cliente-relacion-representante" }}
                variant="outlined"
                fullWidth
              />
            </Stack>

            <Divider />

            {/* 3. Información de contacto */}
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                3. Información de contacto
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="direccion-calle-cliente-form"
                  label="Calle"
                  value={form.direccion_calle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, direccion_calle: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-direccion-calle" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="direccion-numero-cliente-form"
                  label="Número"
                  value={form.direccion_numero}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, direccion_numero: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-direccion-numero" }}
                  sx={{ minWidth: 120 }}
                  variant="outlined"
                />
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="direccion-ciudad-cliente-form"
                  label="Ciudad"
                  value={form.direccion_ciudad}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, direccion_ciudad: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-direccion-ciudad" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="direccion-region-cliente-form"
                  label="Región"
                  value={form.direccion_region}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, direccion_region: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-direccion-region" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="sitio-web-cliente-form"
                  label="Sitio web"
                  type="url"
                  value={form.sitio_web}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sitio_web: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-sitio-web" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="telefono-corporativo-cliente-form"
                  label="Teléfono corporativo"
                  value={form.telefono_corporativo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, telefono_corporativo: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-telefono-corporativo" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="correo-cliente-form"
                  label="Correo"
                  type="email"
                  value={form.correo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, correo: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-correo" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  id="telefono-cliente-form"
                  label="Teléfono"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, telefono: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-telefono" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
            </Stack>

            <Divider />

            {/* 4. Información financiera */}
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                4. Información financiera
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <FormControl sx={{ flex: 1, minWidth: 200 }}>
                  <InputLabel>Método de pago</InputLabel>
                  <Select
                    value={form.metodo_pago}
                    label="Método de pago"
                    inputProps={{ "data-testid": "select-cliente-metodo-pago" }}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, metodo_pago: e.target.value }))
                    }
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    <MenuItem value="transferencia">Transferencia</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                    <MenuItem value="efectivo">Efectivo</MenuItem>
                    <MenuItem value="tarjeta">Tarjeta</MenuItem>
                    <MenuItem value="otro">Otro</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="dia-pago-cliente-form"
                  label="Día de pago"
                  type="number"
                  inputProps={{ min: 1, max: 31, "data-testid": "input-cliente-dia-pago" }}
                  value={form.dia_pago}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dia_pago: e.target.value }))
                  }
                  sx={{ minWidth: 150 }}
                  variant="outlined"
                />
                <FormControl sx={{ flex: 1, minWidth: 150 }}>
                  <InputLabel>Moneda</InputLabel>
                  <Select
                    value={form.moneda}
                    label="Moneda"
                    inputProps={{ "data-testid": "select-cliente-moneda" }}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, moneda: e.target.value }))
                    }
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    <MenuItem value="CLP">CLP (Peso Chileno)</MenuItem>
                    <MenuItem value="USD">USD (Dólar)</MenuItem>
                    <MenuItem value="EUR">EUR (Euro)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                  id="nombre-banco-cliente-form"
                  label="Nombre del banco"
                  value={form.nombre_banco}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre_banco: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-nombre-banco" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="numero-cuenta-cliente-form"
                  label="Nº de cuenta bancaria"
                  value={form.numero_cuenta}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, numero_cuenta: e.target.value }))
                  }
                  inputProps={{ "data-testid": "input-cliente-numero-cuenta" }}
                  sx={{ flex: 1, minWidth: 200 }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
              <TextField
                id="titular-cuenta-cliente-form"
                label="Titular de la cuenta"
                value={form.titular_cuenta}
                onChange={(e) =>
                  setForm((f) => ({ ...f, titular_cuenta: e.target.value }))
                }
                inputProps={{ "data-testid": "input-cliente-titular-cuenta" }}
                variant="outlined"
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                id="cancelar-cliente-form"
                variant="outlined"
                data-testid="button-cliente-cancelar"
                onClick={() => navigate("/clientes")}
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
                id="crear-cliente-form"
                variant="contained"
                data-testid="button-cliente-guardar"
                onClick={onSubmit}
                disabled={loading}
                startIcon={isEdit ? <EditIcon /> : <PersonAddIcon />}
                sx={{
                  minWidth: 150,
                  backgroundColor: "#1B7576",
                  "&:hover": {
                    backgroundColor: "#155a5b",
                  },
                }}
              >
                {isEdit ? "Actualizar Cliente" : "Crear Cliente"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
