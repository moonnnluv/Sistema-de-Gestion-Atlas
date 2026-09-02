const express = require("express");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "inseguro";

// Función helper para simular latencia
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    const token = auth.substring(7);
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Función auxiliar para calcular días entre dos fechas
// Retorna la diferencia en días (puede ser positiva o negativa)
function calcularDiasEntreFechas(fecha1, fecha2) {
  const date1 = new Date(fecha1);
  const date2 = new Date(fecha2);
  // Normalizar a medianoche para evitar problemas con horas
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  const diffTime = date2 - date1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Endpoint de métricas
router.get("/", async (req, res) => {
  try {
    // Simular latencia de 4 segundos
    await delay(4000);
    const authUser = getUserFromAuthHeader(req);

    // Validar token y empresaId
    if (!authUser || !authUser.empresaId) {
      return res.status(401).json({
        error: "No autorizado",
        glosa: "Token inválido o sin empresa asociada",
      });
    }

    const empresaId = authUser.empresaId;
    const hoy = new Date();
    const hoyFormateado = hoy.toISOString().split("T")[0]; // YYYY-MM-DD

    // Fechas para los próximos 15 y 30 días
    const fecha15Dias = new Date(hoy);
    fecha15Dias.setDate(fecha15Dias.getDate() + 15);
    const fecha15DiasFormateada = fecha15Dias.toISOString().split("T")[0];

    const fecha30Dias = new Date(hoy);
    fecha30Dias.setDate(fecha30Dias.getDate() + 30);
    const fecha30DiasFormateada = fecha30Dias.toISOString().split("T")[0];

    // 1. Obtener 10 contratos próximos a vencer (fecha_fin >= hoy y <= 30 días)
    const contratosProximosAVencerResult = await pool.query(
      `SELECT 
        c.id, 
        c.fecha_fin,
        cl.nombre AS cliente
      FROM contratos c
      INNER JOIN clientes cl ON cl.id = c.cliente_id
      WHERE cl.empresa_id = $1 
        AND c.fecha_fin >= $2 
        AND c.fecha_fin <= $3
      ORDER BY c.fecha_fin ASC
      LIMIT 10`,
      [empresaId, hoyFormateado, fecha30DiasFormateada]
    );

    // Formatear contratos próximos a vencer con días restantes
    const contratosProximosAVencer = contratosProximosAVencerResult.rows.map(
      (contrato) => {
        const diasRestantes = calcularDiasEntreFechas(
          hoyFormateado,
          contrato.fecha_fin
        );
        return {
          id: contrato.id,
          cliente: contrato.cliente,
          fechaVencimiento: contrato.fecha_fin,
          diasRestantes: diasRestantes,
        };
      }
    );

    // 2. Obtener 10 contratos ya vencidos (fecha_fin < hoy)
    const contratosVencidosResult = await pool.query(
      `SELECT 
        c.id, 
        c.fecha_fin,
        cl.nombre AS cliente
      FROM contratos c
      INNER JOIN clientes cl ON cl.id = c.cliente_id
      WHERE cl.empresa_id = $1 
        AND c.fecha_fin < $2
      ORDER BY c.fecha_fin DESC
      LIMIT 10`,
      [empresaId, hoyFormateado]
    );

    // Formatear contratos vencidos con días vencidos
    const contratosVencidos = contratosVencidosResult.rows.map((contrato) => {
      const diasVencidos = Math.abs(
        calcularDiasEntreFechas(contrato.fecha_fin, hoyFormateado)
      );
      return {
        id: contrato.id,
        cliente: contrato.cliente,
        fechaVencimiento: contrato.fecha_fin,
        diasVencidos: diasVencidos,
      };
    });

    // 3. Métricas por empresa

    // Total de usuarios asociados a la empresa
    const totalUsuariosResult = await pool.query(
      "SELECT COUNT(*) as total FROM empresa_usuarios WHERE empresa_id = $1",
      [empresaId]
    );
    const totalUsuarios = parseInt(totalUsuariosResult.rows[0].total);

    // Total de clientes de la empresa
    const totalClientesResult = await pool.query(
      "SELECT COUNT(*) as total FROM clientes WHERE empresa_id = $1",
      [empresaId]
    );
    const totalClientes = parseInt(totalClientesResult.rows[0].total);

    // Contratos que vencen en los próximos 15 días
    const contratos15DiasResult = await pool.query(
      `SELECT COUNT(*) as total 
       FROM contratos c
       INNER JOIN clientes cl ON cl.id = c.cliente_id
       WHERE cl.empresa_id = $1 
         AND c.fecha_fin >= $2 
         AND c.fecha_fin <= $3`,
      [empresaId, hoyFormateado, fecha15DiasFormateada]
    );
    const contratos15Dias = parseInt(contratos15DiasResult.rows[0].total);

    // Contratos que vencen en los próximos 30 días
    const contratos30DiasResult = await pool.query(
      `SELECT COUNT(*) as total 
       FROM contratos c
       INNER JOIN clientes cl ON cl.id = c.cliente_id
       WHERE cl.empresa_id = $1 
         AND c.fecha_fin >= $2 
         AND c.fecha_fin <= $3`,
      [empresaId, hoyFormateado, fecha30DiasFormateada]
    );
    const contratos30Dias = parseInt(contratos30DiasResult.rows[0].total);

    // Respuesta final
    res.json({
      contratosProximosAVencer,
      contratosVencidos,
      metricas: {
        totalUsuarios,
        totalClientes,
        contratos15Dias,
        contratos30Dias,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error al obtener métricas",
      glosa: err.message || err.toString(),
    });
  }
});

module.exports = router;
