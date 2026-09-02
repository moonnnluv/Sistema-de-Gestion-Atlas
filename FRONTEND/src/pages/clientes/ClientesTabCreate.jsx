import { useState } from "react";
import {
  Button,
  CardContent,
  Stack,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export default function ClientesTabCreate({ onSuccess, onLoad }) {
  const { role } = useAuth();
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

  const onCreate = async () => {
    if (role !== "administrador") return;
    await api.post("/clientes", form);
    toast.success("Cliente creado");
    setForm({
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
    onLoad();
    onSuccess(); // Cambiar a la pestaña de listar después de crear
  };

  return (
    <CardContent className="!p-6">
      <div className="py-2">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Crear nuevo cliente
        </Typography>
        <Typography variant="body" color="text.secondary">
          Ingresa los datos del nuevo cliente para crearlo en el sistema.
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, es_empresa: e.target.value === "empresa" }))
                }
              >
                <MenuItem value="persona">Persona</MenuItem>
                <MenuItem value="empresa">Empresa</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="rut-cliente-create"
              label="RUT"
              value={form.rut}
              onChange={(e) =>
                setForm((f) => ({ ...f, rut: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
            />
            <TextField
              id="nombre-cliente-create"
              label="Nombre completo"
              value={form.nombre}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
              required
            />
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              id="nombre-fantasia-cliente-create"
              label="Nombre de fantasía"
              value={form.nombre_fantasia}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre_fantasia: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="giro-cliente-create"
              label="Giro o actividad económica"
              value={form.giro_actividad_economica}
              onChange={(e) =>
                setForm((f) => ({ ...f, giro_actividad_economica: e.target.value }))
              }
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
              id="nombre-representante-cliente-create"
              label="Nombre del representante"
              value={form.nombre_representante}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre_representante: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="cargo-representante-cliente-create"
              label="Cargo del representante"
              value={form.cargo_representante}
              onChange={(e) =>
                setForm((f) => ({ ...f, cargo_representante: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              id="correo-representante-cliente-create"
              label="Correo del representante"
              type="email"
              value={form.correo_representante}
              onChange={(e) =>
                setForm((f) => ({ ...f, correo_representante: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="telefono-representante-cliente-create"
              label="Teléfono del representante"
              value={form.telefono_representante}
              onChange={(e) =>
                setForm((f) => ({ ...f, telefono_representante: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
          </Stack>
          <TextField
            id="relacion-representante-cliente-create"
            label="Relación"
            value={form.relacion_representante}
            onChange={(e) =>
              setForm((f) => ({ ...f, relacion_representante: e.target.value }))
            }
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
              id="direccion-calle-cliente-create"
              label="Calle"
              value={form.direccion_calle}
              onChange={(e) =>
                setForm((f) => ({ ...f, direccion_calle: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="direccion-numero-cliente-create"
              label="Número"
              value={form.direccion_numero}
              onChange={(e) =>
                setForm((f) => ({ ...f, direccion_numero: e.target.value }))
              }
              sx={{ minWidth: 120 }}
              variant="outlined"
            />
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              id="direccion-ciudad-cliente-create"
              label="Ciudad"
              value={form.direccion_ciudad}
              onChange={(e) =>
                setForm((f) => ({ ...f, direccion_ciudad: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="direccion-region-cliente-create"
              label="Región"
              value={form.direccion_region}
              onChange={(e) =>
                setForm((f) => ({ ...f, direccion_region: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              id="sitio-web-cliente-create"
              label="Sitio web"
              type="url"
              value={form.sitio_web}
              onChange={(e) =>
                setForm((f) => ({ ...f, sitio_web: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="telefono-corporativo-cliente-create"
              label="Teléfono corporativo"
              value={form.telefono_corporativo}
              onChange={(e) =>
                setForm((f) => ({ ...f, telefono_corporativo: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              id="correo-cliente-create"
              label="Correo"
              type="email"
              value={form.correo}
              onChange={(e) =>
                setForm((f) => ({ ...f, correo: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              id="telefono-cliente-create"
              label="Teléfono"
              value={form.telefono}
              onChange={(e) =>
                setForm((f) => ({ ...f, telefono: e.target.value }))
              }
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
              id="dia-pago-cliente-create"
              label="Día de pago"
              type="number"
              inputProps={{ min: 1, max: 31 }}
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
              id="nombre-banco-cliente-create"
              label="Nombre del banco"
              value={form.nombre_banco}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre_banco: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="numero-cuenta-cliente-create"
              label="Nº de cuenta bancaria"
              value={form.numero_cuenta}
              onChange={(e) =>
                setForm((f) => ({ ...f, numero_cuenta: e.target.value }))
              }
              sx={{ flex: 1, minWidth: 200 }}
              variant="outlined"
              fullWidth
            />
          </Stack>
          <TextField
            id="titular-cuenta-cliente-create"
            label="Titular de la cuenta"
            value={form.titular_cuenta}
            onChange={(e) =>
              setForm((f) => ({ ...f, titular_cuenta: e.target.value }))
            }
            variant="outlined"
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            id="crear-cliente-create"
            variant="contained"
            onClick={onCreate}
            startIcon={<PersonAddIcon />}
            sx={{
              minWidth: 150,
              backgroundColor: "#1B7576",
              "&:hover": {
                backgroundColor: "#155a5b",
              },
            }}
          >
            Crear Cliente
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  );
}

