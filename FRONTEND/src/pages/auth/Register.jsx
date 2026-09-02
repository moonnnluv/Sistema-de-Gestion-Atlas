import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api.jsx";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import bgRegistro from "../../assets/bg-registro.jpg";

export default function Register() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const userForm = useForm({
    defaultValues: {
      nombre_usuario: "",
      correo: "",
      contrasena_hash: "",
    },
  });

  const empresaForm = useForm({
    defaultValues: {
      nombre: "",
      calle: "",
      comuna: "",
      region: "",
      telefono: "",
      correo: "",
    },
  });

  const onUserSubmit = (values) => {
    setUserData(values);
    setStep(2);
  };

  const onEmpresaSubmit = async (values) => {
    try {
      // Construir la dirección completa
      const direccion = `${values.calle}, ${values.comuna}, ${values.region}`;

      // Estructurar los datos según el formato requerido
      const payload = {
        usuario: {
          nombre_usuario: userData.nombre_usuario,
          contrasena_hash: userData.contrasena_hash,
          correo: userData.correo,
        },
        empresa: {
          nombre: values.nombre,
          direccion: direccion,
          telefono: values.telefono,
          correo: values.correo,
        },
      };

      await api.post("/empresas", payload);
      toast.success("Cuenta creada exitosamente, ahora inicia sesión");
      navigate("/login");
    } catch {
      // El interceptor de api ya maneja los toasts de error
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden p-0">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${bgRegistro})` }}
      ></div>

      <div className="w-full md:w-6/12 min-h-screen relative z-10 bg-white flex items-center justify-center shadow-lg overflow-y-auto">
        <div className="px-8 py-8 md:py-4 w-full max-w-2xl my-auto">
          {/* Indicador de pasos */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1
                    ? "bg-secondary text-primary"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div className="w-20 h-1 mx-2 bg-gray-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    step >= 2 ? "bg-secondary" : "bg-gray-200"
                  }`}
                  style={{ width: step >= 2 ? "100%" : "0%" }}
                ></div>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2
                    ? "bg-secondary text-primary"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
            </div>
          </div>

          <h2 className="font-bold text-4xl text-center mb-2 text-primary">
            {step === 1
              ? "Información del Usuario"
              : "Información de la Empresa"}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {step === 1
              ? "Ingresa tus datos de usuario"
              : "Completa la información de tu empresa"}
          </p>

          {step === 1 ? (
            <form
              key="user-form"
              onSubmit={userForm.handleSubmit(onUserSubmit)}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="nombre_usuario"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre de usuario *
                </label>
                <input
                  id="nombre_usuario"
                  type="text"
                  data-testid="input-registro-nombre-usuario"
                  {...userForm.register("nombre_usuario", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Correo electrónico *
                </label>
                <input
                  id="correo"
                  type="email"
                  data-testid="input-registro-correo"
                  {...userForm.register("correo", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contrasena_hash"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña *
                </label>
                <input
                  id="contrasena_hash"
                  type="password"
                  data-testid="input-registro-password"
                  {...userForm.register("contrasena_hash", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                />
              </div>

              <button
                type="submit"
                data-testid="button-registro-continuar"
                className="w-full mt-4 py-3 text-lg font-semibold bg-secondary text-primary rounded-lg hover:bg-[#e6a600] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Continuar
              </button>

              <p className="text-center mt-4 text-gray-600 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  data-testid="link-login"
                  className="text-primary font-semibold no-underline hover:text-secondary hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
          ) : (
            <form
              key="empresa-form"
              onSubmit={empresaForm.handleSubmit(onEmpresaSubmit)}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="nombre_empresa"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre de la empresa *
                </label>
                <input
                  id="nombre_empresa"
                  type="text"
                  data-testid="input-registro-nombre-empresa"
                  {...empresaForm.register("nombre", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="calle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Calle *
                  </label>
                  <input
                    id="calle"
                    type="text"
                    data-testid="input-registro-calle"
                    {...empresaForm.register("calle", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="comuna"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Comuna *
                  </label>
                  <input
                    id="comuna"
                    type="text"
                    data-testid="input-registro-comuna"
                    {...empresaForm.register("comuna", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Región *
                  </label>
                  <input
                    id="region"
                    type="text"
                    data-testid="input-registro-region"
                    {...empresaForm.register("region", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono *
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    data-testid="input-registro-telefono"
                    {...empresaForm.register("telefono", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="correo_empresa"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Correo corporativo *
                  </label>
                  <input
                    id="correo_empresa"
                    type="email"
                    data-testid="input-registro-correo-empresa"
                    {...empresaForm.register("correo", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  data-testid="button-registro-volver"
                  className="flex-1 mt-4 py-3 text-lg font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  data-testid="button-registro-crear-cuenta"
                  className="flex-1 mt-4 py-3 text-lg font-semibold bg-secondary text-primary rounded-lg hover:bg-[#e6a600] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Crear cuenta
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
