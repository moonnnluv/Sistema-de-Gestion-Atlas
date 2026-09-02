import { useState } from "react";
import {
  Button,
  CardContent,
  Stack,
  TextField,
  Typography,
  Divider,
  MenuItem,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function UsuariosTabCreate({ onSuccess, onLoad }) {
  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    contrasena_hash: "",
    rol_id: 1, // Valor por defecto: administrador
  });

  const onCreate = async () => {
    await api.post("/empresa-usuarios", form);
    toast.success("Usuario creado");
    setForm({ nombre_usuario: "", correo: "", contrasena_hash: "", rol_id: 1 });
    onLoad();
    onSuccess(); // Cambiar a la pestaña de listar después de crear
  };

  return (
    <CardContent className="!p-6">
      <div className="py-2">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Crear nuevo usuario
        </Typography>
        <Typography variant="body" color="text.secondary">
          Ingresa los datos del nuevo usuario para crearlo en el sistema.
        </Typography>
      </div>
      <Divider sx={{ mb: 3, mt: 2 }} />
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Nombre de usuario"
            value={form.nombre_usuario}
            onChange={(e) =>
              setForm((f) => ({ ...f, nombre_usuario: e.target.value }))
            }
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Correo electrónico"
            type="email"
            value={form.correo}
            onChange={(e) =>
              setForm((f) => ({ ...f, correo: e.target.value }))
            }
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Contraseña"
            type="password"
            value={form.contrasena_hash}
            onChange={(e) =>
              setForm((f) => ({ ...f, contrasena_hash: e.target.value }))
            }
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
          />
          <TextField
            select
            label="Rol"
            value={form.rol_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, rol_id: Number(e.target.value) }))
            }
            sx={{ flex: 1, minWidth: 200 }}
            variant="outlined"
            fullWidth
          >
            <MenuItem value={1}>Administrador</MenuItem>
            <MenuItem value={2}>Editor</MenuItem>
          </TextField>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
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
            Crear Usuario
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  );
}

