import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4450";

export const api = axios.create({
  baseURL: API_URL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Interceptor para agregar el token automáticamente a todas las peticiones (excepto login y registro)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const url = config.url || "";

    // Rutas públicas que no requieren token
    const isLogin = url.includes("/autenticacion/login");
    // El registro es POST a /empresas cuando no hay token (usuario nuevo)
    const isRegister =
      url.includes("/empresas") &&
      config.method?.toLowerCase() === "post" &&
      !token;

    // Si no es login ni registro, agregar el token si existe
    if (!isLogin && !isRegister && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y mostrar toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si hay respuesta del servidor
    if (error.response) {
      const { data } = error.response;

      // Si el error tiene el formato esperado { error, glosa }
      if (data && data.error && data.glosa) {
        // Mostrar toast con título y descripción
        toast.error(data.error, {
          description: data.glosa,
          duration: 5000,
        });
      } else if (data && data.error) {
        // Si solo hay error sin glosa
        toast.error(data.error);
      } else if (data && data.message) {
        // Si hay un mensaje genérico
        toast.error(data.message);
      } else {
        // Mensaje de error genérico
        toast.error(
          `Error: ${error.response.status} - ${
            error.response.statusText || "Error en la petición"
          }`
        );
      }
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      toast.error("Error de conexión. Verifica tu conexión a internet.");
    } else {
      // Otro tipo de error
      toast.error(error.message || "Ocurrió un error inesperado");
    }

    // Rechazar la promesa para que el código que llama pueda manejarla si lo necesita
    return Promise.reject(error);
  }
);
