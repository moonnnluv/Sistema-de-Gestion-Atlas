import {
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Alert,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import InboxIcon from "@mui/icons-material/Inbox";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    totalUsuarios: 0,
    totalClientes: 0,
    contratos7Dias: 0,
    contratos15Dias: 0,
    contratos30Dias: 0,
  });
  const [contratosProximosAVencer, setContratosProximosAVencer] = useState([]);
  const [contratosVencidos, setContratosVencidos] = useState([]);

  // Valores mockup - En producción estos vendrían de la API
  const empresaId = user.empresaId; // Mockup ID de empresa
  const usuarioId = user.usuarioId; // Mockup ID de usuario

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/metricas");

        // Adaptar la estructura de respuesta
        if (data) {
          setMetricas(
            data.metricas || {
              totalUsuarios: 0,
              totalClientes: 0,
              contratos7Dias: 0,
              contratos15Dias: 0,
              contratos30Dias: 0,
            }
          );
          setContratosProximosAVencer(data.contratosProximosAVencer || []);
          setContratosVencidos(data.contratosVencidos || []);
        }
      } catch (error) {
        // El error ya se maneja en el interceptor de api.jsx
        console.error("Error al cargar métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "400px" }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Cargando métricas...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Por favor espera, esto puede tomar unos segundos
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col pt-1">
          <Typography variant="h4" color="primary">
            Bienvenido, <b>{user?.nombre_usuario}</b>
          </Typography>
        </div>
      </div>

      {/* Métricas principales con diseño mejorado */}
      <div className="grid grid-cols-4 gap-6">
        <Card
          sx={{
            background: "#1B7576",
            color: "white",
            boxShadow: "0 10px 30px rgba(27, 117, 118, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 40px rgba(27, 117, 118, 0.4)",
            },
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {metricas.totalUsuarios}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Usuarios de la Empresa
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "#4BBC7F",
            color: "white",
            boxShadow: "0 10px 30px rgba(75, 188, 127, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 40px rgba(75, 188, 127, 0.4)",
            },
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {metricas.totalClientes}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Clientes Creados
                </Typography>
              </Box>
              <PersonIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "#D32F2F",
            color: "white",
            boxShadow: "0 10px 30px rgba(211, 47, 47, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 40px rgba(211, 47, 47, 0.4)",
            },
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {metricas.contratos15Dias}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Vencen en 15 días
                </Typography>
              </Box>
              <WarningIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "#FF9800",
            color: "white",
            boxShadow: "0 10px 30px rgba(255, 152, 0, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 40px rgba(255, 152, 0, 0.4)",
            },
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {metricas.contratos30Dias}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Vencen en 30 días
                </Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BusinessIcon color="primary" />
                <Typography variant="h6">Editar Empresa</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Actualiza la información de tu empresa: nombre, dirección,
                teléfono y correo.
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/empresas/${empresaId}/editar`)}
                sx={{ alignSelf: "flex-start" }}
              >
                Editar Empresa
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon color="primary" />
                <Typography variant="h6">Editar Usuario</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Cambia tu contraseña y actualiza tu información de usuario.
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/usuarios/${usuarioId}/editar`)}
                sx={{ alignSelf: "flex-start" }}
              >
                Editar Usuario
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </div>

      {/* Contratos próximos a vencer y vencidos con pestañas */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label="Próximos a Vencer"
              icon={<WarningIcon />}
              iconPosition="start"
              className="!min-h-[auto] !h-auto !pt-4"
            />
            <Tab
              label="Vencidos"
              icon={<ErrorIcon />}
              iconPosition="start"
              className="!min-h-[auto] !h-auto !pt-4"
            />
          </Tabs>
        </Box>
        <CardContent>
          <Box
            sx={{
              height: "400px",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                },
              },
            }}
          >
            <Stack spacing={1}>
              {tabValue === 0 && contratosProximosAVencer.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    py: 6,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "divider",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      maxWidth: 400,
                      width: "100%",
                    }}
                  >
                    <Stack
                      spacing={3}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "50%",
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DescriptionIcon
                          sx={{
                            fontSize: 56,
                            color: "text.secondary",
                            opacity: 0.6,
                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          color="text.primary"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          No hay contratos próximos a vencer
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}
                        >
                          Actualmente no existen contratos que estén próximos a
                          vencer en los próximos días.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              )}
              {tabValue === 0 &&
                contratosProximosAVencer.length > 0 &&
                contratosProximosAVencer.map((contrato) => (
                  <Alert
                    key={contrato.id}
                    severity="warning"
                    icon={<WarningIcon />}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {contrato.cliente}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Fecha de vencimiento: {contrato.fechaVencimiento} (
                      {contrato.diasRestantes} días restantes)
                    </Typography>
                  </Alert>
                ))}
              {tabValue === 1 && contratosVencidos.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    py: 6,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "divider",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      maxWidth: 400,
                      width: "100%",
                    }}
                  >
                    <Stack
                      spacing={3}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "50%",
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <InboxIcon
                          sx={{
                            fontSize: 56,
                            color: "text.secondary",
                            opacity: 0.6,
                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          color="text.primary"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          No hay contratos vencidos
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}
                        >
                          Actualmente no existen contratos que hayan vencido.
                          Todos los contratos están al día.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              )}
              {tabValue === 1 &&
                contratosVencidos.length > 0 &&
                contratosVencidos.map((contrato) => (
                  <Alert
                    key={contrato.id}
                    severity="error"
                    icon={<ErrorIcon />}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {contrato.cliente}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Fecha de vencimiento: {contrato.fechaVencimiento} (vencido
                      hace {contrato.diasVencidos} días)
                    </Typography>
                  </Alert>
                ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
