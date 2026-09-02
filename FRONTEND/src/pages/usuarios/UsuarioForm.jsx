import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "sonner";
import PageHeader from "../../components/PageHeader";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usuarioInfo, setUsuarioInfo] = useState({
    nombre_usuario: "",
    correo: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    contrasena_hash: "",
    confirmar_contrasena: "",
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/usuarios/${id}`);
        setUsuarioInfo({
          nombre_usuario: data.nombre_usuario || "",
          correo: data.correo || "",
        });
      } catch (error) {
        toast.error("Error al cargar usuario");
      }
    })();
  }, [id]);

  const onUpdateUsuario = async () => {
    if (!usuarioInfo.correo) {
      toast.error("Por favor completa el campo de correo");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/usuarios/${id}`, {
        correo: usuarioInfo.correo,
      });
      toast.success("Información del usuario actualizada");
    } catch (error) {
      // El error ya se maneja en el interceptor
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePassword = async () => {
    if (!passwordForm.contrasena_hash || !passwordForm.confirmar_contrasena) {
      toast.error("Por favor completa ambos campos de contraseña");
      return;
    }

    if (passwordForm.contrasena_hash !== passwordForm.confirmar_contrasena) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/usuarios/${id}`, {
        contrasena_hash: passwordForm.contrasena_hash,
      });
      toast.success("Contraseña actualizada");
      setPasswordForm({ contrasena_hash: "", confirmar_contrasena: "" });
    } catch (error) {
      // El error ya se maneja en el interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Editar Usuario"
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            data-testid="button-usuario-volver"
            onClick={() => navigate("/usuarios")}
            sx={{
              borderColor: "divider",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            Volver
          </Button>
        }
      />

      {/* Card informativa */}
      <Card
        sx={{
          background: "#1B7576",
          color: "white",
          boxShadow: "0 10px 30px rgba(27, 117, 118, 0.3)",
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <PersonIcon sx={{ fontSize: 48, opacity: 0.9 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Editar Información del Usuario
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Actualiza los datos del usuario y cambia su contraseña en el
                sistema.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Información del usuario */}
      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <EditIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Información del Usuario
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                label="Nombre de usuario"
                value={usuarioInfo.nombre_usuario}
                InputProps={{
                  readOnly: true,
                }}
                inputProps={{ "data-testid": "input-usuario-nombre" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Correo electrónico"
                type="email"
                value={usuarioInfo.correo}
                onChange={(e) =>
                  setUsuarioInfo({ ...usuarioInfo, correo: e.target.value })
                }
                inputProps={{ "data-testid": "input-usuario-correo" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                data-testid="button-usuario-cancelar"
                onClick={() => navigate("/usuarios")}
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
                data-testid="button-usuario-actualizar"
                onClick={onUpdateUsuario}
                disabled={loading}
                startIcon={<EditIcon />}
                sx={{
                  minWidth: 180,
                  backgroundColor: "#1B7576",
                  "&:hover": {
                    backgroundColor: "#155a5b",
                  },
                }}
              >
                Actualizar Información
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Cambiar contraseña */}
      <Card
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <LockIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Cambiar Contraseña
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                label="Nueva contraseña"
                type="password"
                value={passwordForm.contrasena_hash}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    contrasena_hash: e.target.value,
                  })
                }
                inputProps={{ "data-testid": "input-usuario-password" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Confirmar contraseña"
                type="password"
                value={passwordForm.confirmar_contrasena}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmar_contrasena: e.target.value,
                  })
                }
                inputProps={{ "data-testid": "input-usuario-confirmar-password" }}
                sx={{ flex: 1, minWidth: 200 }}
                variant="outlined"
                fullWidth
                required
              />
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                data-testid="button-usuario-actualizar-password"
                onClick={onUpdatePassword}
                disabled={loading}
                startIcon={<LockIcon />}
                sx={{
                  minWidth: 180,
                  backgroundColor: "#1B7576",
                  "&:hover": {
                    backgroundColor: "#155a5b",
                  },
                }}
              >
                Actualizar Contraseña
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
