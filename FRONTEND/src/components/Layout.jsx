import {
  Avatar,
  Box,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../assets/logo.svg";

const drawerWidth = 240;

export default function Layout() {
  const { role, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { to: "/home", label: "Inicio", icon: <HomeIcon /> },
    { to: "/clientes", label: "Clientes", icon: <BusinessIcon /> },
    { to: "/contratos", label: "Contratos", icon: <DescriptionIcon /> },
    { to: "/auditoria", label: "Auditoría", icon: <HistoryIcon /> },
  ];
  const adminItems = [
    { to: "/usuarios", label: "Usuarios", icon: <PeopleIcon /> },
  ];

  const handleEditAccount = () => {
    navigate(`/usuarios/${user?.id || 1}/editar`);
  };

  const handleLogout = () => {
    logout();
  };

  const DrawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo al inicio */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 3,
          px: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <img src={Logo} alt="Logo" width={160} />
      </Box>

      {/* Listado de accesos */}
      <List sx={{ flex: 1, py: 2 }}>
        {[...menuItems, ...(role === "administrador" ? adminItems : [])].map(
          (item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <ListItemButton
                key={item.to}
                selected={active}
                component={Link}
                to={item.to}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                sx={{ mx: 1, mb: 0.5, borderRadius: 1 }}
              >
                <ListItemIcon className="!text-primary">
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: '"Rubik", sans-serif',
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                />
              </ListItemButton>
            );
          }
        )}
      </List>

      {/* Cuadro con información del usuario */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                fontSize: "0.875rem",
                color: "white",
              }}
            >
              {user?.nombre_usuario?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontFamily: '"Rubik", sans-serif',
                  fontSize: 14,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.nombre_usuario || "Usuario"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontFamily: '"Rubik", sans-serif',
                  fontSize: 12,
                  lineHeight: 1.2,
                  textTransform: "capitalize",
                  display: "block",
                }}
              >
                {role || "Usuario"}
              </Typography>
            </Box>
          </Box>

          {/* Botones de acción */}
          <Stack spacing={1}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<EditIcon />}
              data-testid="button-layout-editar-cuenta"
              onClick={handleEditAccount}
              sx={{
                fontFamily: '"Rubik", sans-serif',
                fontSize: 13,
                textTransform: "none",
                justifyContent: "flex-start",
              }}
            >
              Editar cuenta
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              data-testid="button-layout-logout"
              onClick={handleLogout}
              sx={{
                fontFamily: '"Rubik", sans-serif',
                fontSize: 13,
                textTransform: "none",
                justifyContent: "flex-start",
                color: "error.main",
                borderColor: "error.main",
                "&:hover": {
                  borderColor: "error.dark",
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              Cerrar Sesión
            </Button>
          </Stack>
        </Paper>
        <div className="flex justify-center items-center mt-2">
          <span className="text-xs text-gray-500">Versión 1.0.0</span>
        </div>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {DrawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f2f2f2",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Container sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
