const express = require("express");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "inseguro";

// Función helper para simular latencia
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Login simple: usuario + contraseña en texto plano
router.post("/login", async (req, res) => {
  const { nombre_usuario, password } = req.body;
  try {
    // Simular latencia de 4 segundos
    await delay(4000);
    const result = await pool.query(
      "SELECT id, nombre_usuario, contrasena_hash FROM usuarios WHERE nombre_usuario = $1",
      [nombre_usuario]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const user = result.rows[0];
    if (user.contrasena_hash !== password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Obtener el empresa_usuario id y empresa_id más reciente para este usuario
    const empresaUsuarioResult = await pool.query(
      "SELECT id, empresa_id FROM empresa_usuarios WHERE usuario_id = $1 ORDER BY id DESC LIMIT 1",
      [user.id]
    );
    const empresaUsuarioId = empresaUsuarioResult.rows.length > 0 
      ? empresaUsuarioResult.rows[0].id 
      : null;
    const empresaId = empresaUsuarioResult.rows.length > 0 
      ? empresaUsuarioResult.rows[0].empresa_id 
      : null;

    const token = jwt.sign(
      { 
        usuarioId: user.id, 
        nombreUsuario: user.nombre_usuario,
        empresaUsuarioId: empresaUsuarioId,
        empresaId: empresaId
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Registrar en auditoría
    await pool.query(
      "INSERT INTO auditoria (usuario_id, accion) VALUES ($1, $2)",
      [user.nombre_usuario, "LOGIN: usuario inició sesión"]
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error en login", glosa: err.message || err.toString() });
  }
});

module.exports = router;
