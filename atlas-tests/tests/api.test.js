// Bateria de pruebas de integracion y seguridad: Sistema de Gestion Atlas.
// ISY1102 - Encargo 2. Cada describe() es un caso de prueba (CP-xx) trazado a un
// requisito del ERS. Las pruebas son de caja negra (HTTP contra la API real)
// y consultan PostgreSQL directamente cuando el caso lo exige.
const fs = require("fs");
const path = require("path");
const H = require("./helpers");
const { api, pool, unico, registrar: rec, login, auth, jwt } = H;

const REPO = process.env.ATLAS_REPO || "";
const SERVER_LOG = process.env.SERVER_LOG || "";
const hoy = new Date();
const fechaMas = (dias) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + dias);
  return d.toISOString().split("T")[0];
};

let tokenAdmin, tokenEditor, tokenB, empresaB, clienteB, correoEmpresaB;
const S = unico();

beforeAll(async () => {
  tokenAdmin = (await login("admin", "admin")).token;
  tokenEditor = (await login("editor", "editor")).token;
  // Empresa B (segundo inquilino) para pruebas de aislamiento
  correoEmpresaB = `empresab_${S}@test.cl`;
  const r = await api()
    .post("/empresas")
    .send({
      usuario: {
        nombre_usuario: `adminB_${S}`,
        contrasena_hash: "PassB#2026",
        correo: `adminb_${S}@test.cl`,
      },
      empresa: { nombre: "Empresa B", correo: correoEmpresaB },
    });
  empresaB = r.body.empresa;
  tokenB = (await login(`adminB_${S}`, "PassB#2026")).token;
  const c = await api()
    .post("/clientes")
    .set(auth(tokenB))
    .send({ nombre: "Cliente de B", correo: `clienteb_${S}@test.cl` });
  clienteB = c.body;
});

afterAll(async () => {
  H.guardarResultados();
  await pool.end();
});

describe("CP-01 Contrasena no se almacena en texto plano (NFR-SEG-2)", () => {
  test("la contrasena guardada es un hash bcrypt", async () => {
    const plano = "Prueba#2026";
    const r = await api()
      .post("/usuarios")
      .send({
        nombre_usuario: `usuario_prueba_${S}`,
        contrasena_hash: plano,
        correo: `prueba_${S}@atlas.cl`,
      });
    const { rows } = await pool.query(
      "SELECT contrasena_hash FROM usuarios WHERE id=$1",
      [r.body.id]
    );
    const guardado = rows[0].contrasena_hash;
    const semilla = (
      await pool.query(
        "SELECT nombre_usuario, contrasena_hash FROM usuarios WHERE id IN (1,2) ORDER BY id"
      )
    ).rows
      .map((u) => `${u.nombre_usuario}='${u.contrasena_hash}'`)
      .join(", ");
    const ok = /^\$2[aby]\$/.test(guardado) && guardado !== plano;
    rec(
      "CP-01",
      "Hash bcrypt en BD tras POST /usuarios",
      ok,
      `HTTP ${r.status}; valor almacenado='${guardado}'; usuarios semilla: ${semilla}`
    );
    expect(ok).toBe(true);
  });
});

describe("CP-02 Editor no puede escribir (RB-4)", () => {
  test("editor recibe 403 al crear, editar y eliminar clientes", async () => {
    const payload = jwt.decode(tokenEditor);
    const cAdmin = await api()
      .post("/clientes")
      .set(auth(tokenAdmin))
      .send({ nombre: "Cliente para editor", correo: `ce_${S}@test.cl` });
    const idc = cAdmin.body.id;
    const crear = await api()
      .post("/clientes")
      .set(auth(tokenEditor))
      .send({ nombre: "Creado por editor", correo: `ce2_${S}@test.cl` });
    const editar = await api()
      .put(`/clientes/${idc}`)
      .set(auth(tokenEditor))
      .send({ nombre: "Modificado por editor", correo: `ce_${S}@test.cl` });
    const eliminar = await api()
      .delete(`/clientes/${idc}`)
      .set(auth(tokenEditor));
    const existe = (await pool.query("SELECT 1 FROM clientes WHERE id=$1", [idc]))
      .rowCount;
    const info = `payload JWT editor=${JSON.stringify(payload)}`;
    const o1 = rec("CP-02", "Editor: POST /clientes rechazado (403)", [401, 403].includes(crear.status), `HTTP ${crear.status}. ${info}`);
    const o2 = rec("CP-02", "Editor: PUT /clientes/:id rechazado (403)", [401, 403].includes(editar.status), `HTTP ${editar.status}`);
    const o3 = rec("CP-02", "Editor: DELETE /clientes/:id rechazado (403)", [401, 403].includes(eliminar.status), `HTTP ${eliminar.status}; cliente existe despues=${existe === 1}`);
    expect(o1 && o2 && o3).toBe(true);
  });
});

describe("CP-03 Estado de contrato segun fechas (RF-5.4)", () => {
  test("el sistema expone estado activo / por vencer / vencido", async () => {
    const mk = async (titulo, ini, fin) =>
      (
        await api()
          .post("/contratos")
          .set(auth(tokenAdmin))
          .send({ cliente_id: 1, titulo, fecha_inicio: ini, fecha_fin: fin })
      ).body;
    const activo = await mk(`C-activo-${S}`, fechaMas(-30), fechaMas(180));
    const vencido = await mk(`C-vencido-${S}`, "2024-01-01", "2024-12-31");
    const porVencer = await mk(`C-porvencer-${S}`, fechaMas(-300), fechaMas(15));
    const est = await api().get("/contratos/estados").set(auth(tokenAdmin));
    const detalle = await api().get(`/contratos/${activo.id}`);
    const porId = (id) => est.body.find((c) => c.id === id);
    const o1 = rec("CP-03", "Contrato con fin en el pasado figura como 'vencido'", porId(vencido.id)?.estado === "vencido", `estado=${porId(vencido.id)?.estado}`);
    const o2 = rec("CP-03", "Contrato que termina en 15 dias figura como 'por_vencer'", porId(porVencer.id)?.estado === "por_vencer", `estado=${porId(porVencer.id)?.estado}`);
    const o3 = rec("CP-03", "Contrato vigente figura como 'activo'", porId(activo.id)?.estado === "activo" || detalle.body.estado === "activo", `/contratos/estados=${JSON.stringify(porId(activo.id) || "no listado")}; GET /contratos/:id campos=${Object.keys(detalle.body).join(",")}`);
    expect(o1 && o2 && o3).toBe(true);
  });
});

describe("CP-04 Tiempo de respuesta CRUD < 300 ms (NFR-PERF-1)", () => {
  test("promedio < 300 ms y p95 < 450 ms por operacion", async () => {
    const medir = async (n, fn) => {
      const m = [];
      for (let i = 0; i < n; i++) {
        const t = Date.now();
        await fn(i);
        m.push(Date.now() - t);
      }
      return H.estadisticas(m);
    };
    const ids = [];
    const post = await medir(50, async (i) => {
      const r = await api().post("/clientes").set(auth(tokenAdmin)).send({ nombre: `Perf ${i}`, correo: `perf_${S}_${i}@t.cl` });
      ids.push(r.body.id);
    });
    const get1 = await medir(50, () => api().get(`/clientes/${ids[0]}`).set(auth(tokenAdmin)));
    const put = await medir(50, () => api().put(`/clientes/${ids[0]}`).set(auth(tokenAdmin)).send({ nombre: "Perf upd", correo: `perf_${S}_0@t.cl` }));
    const del = await medir(50, (i) => api().delete(`/clientes/${ids[i]}`).set(auth(tokenAdmin)));
    const lista = await medir(10, () => api().get("/clientes").set(auth(tokenAdmin)));
    const contr = await medir(3, () => api().get("/contratos").set(auth(tokenAdmin)));
    const logins = await medir(3, () => api().post("/autenticacion/login").send({ nombre_usuario: "admin", password: "admin" }));
    const fila = (n, e) => `${n}: n=${e.n} prom=${e.promedio}ms p95=${e.p95}ms p99=${e.p99}ms max=${e.max}ms`;
    const ok = (e) => e.promedio < 300 && e.p95 < 450;
    const todo = [
      ["POST /clientes (50 it.)", post],
      ["GET /clientes/:id (50 it.)", get1],
      ["PUT /clientes/:id (50 it.)", put],
      ["DELETE /clientes/:id (50 it.)", del],
      ["GET /clientes lista (10 it.)", lista],
      ["GET /contratos lista (3 it.)", contr],
      ["POST /autenticacion/login (3 it.)", logins],
    ];
    const res = todo.map(([n, e]) => rec("CP-04", n, ok(e), fila(n, e)));
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-05 Aislamiento de clientes entre empresas (RB-2)", () => {
  test("usuario de la empresa A no accede a un cliente de la empresa B", async () => {
    const get = await api().get(`/clientes/${clienteB.id}`).set(auth(tokenAdmin));
    const put = await api().put(`/clientes/${clienteB.id}`).set(auth(tokenAdmin)).send({ nombre: "hack", correo: "h@h.cl" });
    const del = await api().delete(`/clientes/${clienteB.id}`).set(auth(tokenAdmin));
    const lista = await api().get("/clientes").set(auth(tokenAdmin));
    const filtrado = !lista.body.some((c) => c.id === clienteB.id);
    const sigue = (await pool.query("SELECT nombre FROM clientes WHERE id=$1", [clienteB.id])).rows[0];
    const o = [
      rec("CP-05", "GET cliente de B con token de A rechazado (403/404)", [403, 404].includes(get.status), `HTTP ${get.status}`),
      rec("CP-05", "PUT cliente de B con token de A rechazado", [403, 404].includes(put.status), `HTTP ${put.status}`),
      rec("CP-05", "DELETE cliente de B con token de A rechazado", [403, 404].includes(del.status), `HTTP ${del.status}; cliente de B sigue en BD='${sigue && sigue.nombre}'`),
      rec("CP-05", "Listado de A no incluye clientes de B", filtrado, `listado de A: ${lista.body.length} clientes; incluye id ${clienteB.id}=${!filtrado}`),
    ];
    expect(o.every(Boolean)).toBe(true);
  });
});

describe("CP-06 Rechazo de tokens JWT invalidos (RF-1)", () => {
  test("token ausente, malformado, alterado, expirado, alg=none o firmado con otra clave", async () => {
    const secreto = H.SECRETO_PUBLICADO;
    const payloadOk = jwt.decode(tokenAdmin);
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const alterado = (() => {
      const [h, p, s] = tokenAdmin.split(".");
      const pl = JSON.parse(Buffer.from(p, "base64url").toString());
      pl.empresaId = 999;
      return `${h}.${b64(pl)}.${s}`;
    })();
    const expirado = jwt.sign({ usuarioId: 1, nombreUsuario: "admin", empresaUsuarioId: 1, empresaId: 1 }, secreto, { expiresIn: -60 });
    const algNone = `${b64({ alg: "none", typ: "JWT" })}.${b64(payloadOk)}.`;
    const otraClave = jwt.sign({ usuarioId: 1, empresaId: 1 }, "otra-clave", { expiresIn: "1h" });
    const casos = [
      ["sin token", {}],
      ["token malformado 'Bearer abc'", { Authorization: "Bearer abc" }],
      ["payload alterado (empresaId=999)", auth(alterado)],
      ["token expirado", auth(expirado)],
      ["alg=none", auth(algNone)],
      ["firmado con otra clave", auth(otraClave)],
    ];
    const resultados = [];
    for (const [nombre, headers] of casos) {
      const r = await api().get("/clientes/1").set(headers);
      resultados.push(rec("CP-06", `Rechaza ${nombre} (401)`, r.status === 401, `HTTP ${r.status}`));
    }
    const valido = await api().get("/clientes/1").set(auth(tokenAdmin));
    resultados.push(rec("CP-06", "Acepta token valido (200)", valido.status === 200, `HTTP ${valido.status}`));
    expect(resultados.every(Boolean)).toBe(true);
  });
});

describe("CP-07 Cierre de sesion y revocacion de token (RF-1)", () => {
  test("existe logout y el token queda invalidado", async () => {
    const p = jwt.decode(tokenAdmin);
    const out = await api().post("/autenticacion/logout").set(auth(tokenAdmin));
    const despues = await api().get("/clientes/1").set(auth(tokenAdmin));
    const vigenciaH = (p.exp - p.iat) / 3600;
    const o1 = rec("CP-07", "Existe endpoint de cierre de sesion (2xx)", out.status >= 200 && out.status < 300, `POST /autenticacion/logout -> HTTP ${out.status}`);
    const o2 = rec("CP-07", "Token deja de ser valido tras cerrar sesion (401)", despues.status === 401, `GET /clientes/1 con el mismo token -> HTTP ${despues.status}`);
    rec("CP-07", "Vigencia del token (referencia: corta vigencia)", vigenciaH <= 2, `exp-iat=${vigenciaH} h`);
    expect(o1 && o2).toBe(true);
  });
});

describe("CP-08 Acceso anonimo a endpoints sensibles (NFR-SEG-4)", () => {
  test("sin token, los endpoints internos responden 401/403", async () => {
    const u = await api().post("/usuarios").send({ nombre_usuario: `victima_${S}`, contrasena_hash: "x", correo: `v_${S}@t.cl` });
    const idVictima = u.body.id;
    const casos = [
      ["GET /usuarios/1", () => api().get("/usuarios/1")],
      ["GET /auditoria", () => api().get("/auditoria")],
      ["GET /empresas", () => api().get("/empresas")],
      ["GET /roles", () => api().get("/roles")],
      ["GET /empresa-usuarios/1", () => api().get("/empresa-usuarios/1")],
      ["GET /contratos/1", () => api().get("/contratos/1")],
      ["POST /usuarios", () => api().post("/usuarios").send({ nombre_usuario: `anon_${S}`, contrasena_hash: "x", correo: `a_${S}@t.cl` })],
      ["PUT /usuarios/:id", () => api().put(`/usuarios/${idVictima}`).send({ nombre_usuario: `hack_${S}`, contrasena_hash: "hack", correo: `v_${S}@t.cl` })],
      ["DELETE /usuarios/:id", () => api().delete(`/usuarios/${idVictima}`)],
    ];
    const res = [];
    for (const [n, f] of casos) {
      const r = await f();
      const extra = n.startsWith("GET /usuarios") ? ` cuerpo=${JSON.stringify(r.body).slice(0, 90)}` : n === "GET /auditoria" ? ` filas=${Array.isArray(r.body) ? r.body.length : "-"}` : "";
      res.push(rec("CP-08", `${n} sin token rechazado`, [401, 403].includes(r.status), `HTTP ${r.status}${extra}`));
    }
    const sigue = (await pool.query("SELECT 1 FROM usuarios WHERE id=$1", [idVictima])).rowCount;
    rec("CP-08", "Usuario victima sigue existiendo tras DELETE anonimo", sigue === 1, `existe en BD=${sigue === 1}`);
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-09 Acceso a contratos de otra empresa (RB-2)", () => {
  test("usuario de la empresa B no lee ni elimina contratos de la empresa A", async () => {
    const c = await api().post("/contratos").set(auth(tokenAdmin))
      .field("cliente_id", "1").field("titulo", `Confidencial A ${S}`)
      .field("fecha_inicio", fechaMas(-10)).field("fecha_fin", fechaMas(300))
      .attach("file", H.pdfDePrueba(), "contrato.pdf");
    const idc = c.body.id;
    const get = await api().get(`/contratos/${idc}`).set(auth(tokenB));
    const file = await api().get(`/contratos/${idc}/file`).set(auth(tokenB));
    const put = await api().put(`/contratos/${idc}`).set(auth(tokenB)).send({ titulo: "hack" });
    const del = await api().delete(`/contratos/${idc}`).set(auth(tokenB));
    const sigue = (await pool.query("SELECT 1 FROM contratos WHERE id=$1", [idc])).rowCount;
    const res = [
      rec("CP-09", "GET /contratos/:id de otra empresa rechazado", [403, 404].includes(get.status), `HTTP ${get.status}; titulo expuesto='${get.body.titulo || ""}'`),
      rec("CP-09", "GET /contratos/:id/file de otra empresa rechazado", [403, 404].includes(file.status), `HTTP ${file.status}; bytes recibidos=${file.body && file.body.length ? file.body.length : 0}`),
      rec("CP-09", "PUT /contratos/:id de otra empresa rechazado", [403, 404].includes(put.status), `HTTP ${put.status}`),
      rec("CP-09", "DELETE /contratos/:id de otra empresa rechazado", [403, 404].includes(del.status), `HTTP ${del.status}; contrato sigue en BD=${sigue === 1}`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-10 Registro de empresa, rol administrador y gestion de usuarios (RF-2, RF-3)", () => {
  test("registro crea empresa y asigna rol administrador; el admin agrega un editor", async () => {
    const r = await api().post("/empresas").send({
      usuario: { nombre_usuario: `adminC_${S}`, contrasena_hash: "PassC#2026", correo: `adminc_${S}@t.cl` },
      empresa: { nombre: "Empresa C", correo: `empresac_${S}@t.cl` },
    });
    const eu = (await pool.query("SELECT rol_id FROM empresa_usuarios WHERE empresa_id=$1 AND usuario_id=$2", [r.body.empresa?.id, r.body.usuario?.id])).rows[0];
    const lg = await login(`adminC_${S}`, "PassC#2026");
    const claims = jwt.decode(lg.token) || {};
    const ed = await api().post("/empresa-usuarios").set(auth(lg.token)).send({ nombre_usuario: `editorC_${S}`, contrasena_hash: "EdC#2026", correo: `editorc_${S}@t.cl`, rol_id: 2 });
    const lista = await api().get("/empresa-usuarios").set(auth(lg.token));
    const filaEd = (lista.body || []).find((u) => u.nombre_usuario === `editorC_${S}`);
    const res = [
      rec("CP-10", "POST /empresas (usuario+empresa) responde 201", r.status === 201, `HTTP ${r.status}`),
      rec("CP-10", "Se asigna rol administrador (rol_id=1) al registrante", eu && Number(eu.rol_id) === 1, `rol_id en empresa_usuarios=${eu && eu.rol_id}`),
      rec("CP-10", "El nuevo administrador inicia sesion y su token incluye empresaId", lg.status === 200 && !!claims.empresaId, `login HTTP ${lg.status}; empresaId=${claims.empresaId}`),
      rec("CP-10", "Administrador agrega usuario editor a su empresa (RF-3)", ed.status === 201, `HTTP ${ed.status}`),
      rec("CP-10", "Listado muestra el rol 'editor' del nuevo usuario", filaEd && filaEd.rol_nombre === "editor", `rol_nombre=${filaEd && filaEd.rol_nombre}`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-11 Unicidad de correo y manejo de errores (RB-1, NFR-SEG-5)", () => {
  test("correo de empresa duplicado se rechaza con error controlado y sin dejar datos huerfanos", async () => {
    const nombre = `huerfano_${S}`;
    const r = await api().post("/empresas").send({
      usuario: { nombre_usuario: nombre, contrasena_hash: "x", correo: `huerfano_${S}@t.cl` },
      empresa: { nombre: "Duplicada", correo: correoEmpresaB },
    });
    const huerfano = (await pool.query("SELECT 1 FROM usuarios WHERE nombre_usuario=$1", [nombre])).rowCount;
    const txt = JSON.stringify(r.body);
    const res = [
      rec("CP-11", "El correo duplicado no genera una segunda empresa", r.status >= 400, `HTTP ${r.status}`),
      rec("CP-11", "Responde error de cliente 4xx (400/409), no 500", r.status >= 400 && r.status < 500, `HTTP ${r.status}`),
      rec("CP-11", "La respuesta no expone detalles internos de la BD", !/duplicate key|constraint|violates/i.test(txt), `cuerpo=${txt}`),
      rec("CP-11", "No queda un usuario huerfano si falla la creacion de la empresa", huerfano === 0, `usuarios huerfanos en BD=${huerfano}`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-12 Resistencia a inyeccion SQL (NFR-SEG-5)", () => {
  test("payloads SQLi no evaden login ni alteran la BD", async () => {
    const antes = (await pool.query("SELECT count(*)::int n FROM clientes")).rows[0].n;
    const l1 = await api().post("/autenticacion/login").send({ nombre_usuario: "admin' OR '1'='1' --", password: "x" });
    const l2 = await api().post("/autenticacion/login").send({ nombre_usuario: "admin", password: "' OR '1'='1" });
    const s1 = await api().get("/clientes/search").query({ name: "' OR 1=1; DROP TABLE clientes; --" }).set(auth(tokenAdmin));
    const s2 = await api().get("/clientes/1%20OR%201=1").set(auth(tokenAdmin));
    const despues = (await pool.query("SELECT count(*)::int n FROM clientes")).rows[0].n;
    const res = [
      rec("CP-12", "Login con ' OR '1'='1 en usuario rechazado (401)", l1.status === 401 && !l1.body.token, `HTTP ${l1.status}`),
      rec("CP-12", "Login con ' OR '1'='1 en contrasena rechazado (401)", l2.status === 401 && !l2.body.token, `HTTP ${l2.status}`),
      rec("CP-12", "Busqueda con DROP TABLE no devuelve datos ajenos", s1.status === 200 && s1.body.length === 0, `HTTP ${s1.status}; filas=${s1.body.length}`),
      rec("CP-12", "Parametro id con 'OR 1=1' no devuelve datos de otras filas", s2.status !== 200, `HTTP ${s2.status}`),
      rec("CP-12", "Tabla clientes intacta tras los intentos", despues >= antes, `clientes antes=${antes}, despues=${despues}`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-13 Saneamiento de entradas / XSS almacenado (NFR-SEG-5)", () => {
  test("el backend sanea o rechaza etiquetas script", async () => {
    const xss = `<script>alert('XSS')</script>`;
    const c = await api().post("/clientes").set(auth(tokenAdmin)).send({ nombre: xss, correo: `xss_${S}@t.cl` });
    const g = await api().get(`/clientes/${c.body.id}`).set(auth(tokenAdmin));
    let sinSinks = "n/a";
    if (REPO) {
      sinSinks = String(H.buscarEnArchivos(path.join(REPO, "FRONTEND", "src"), /dangerouslySetInnerHTML|innerHTML/));
    }
    const guardadoCrudo = g.body.nombre === xss;
    const r1 = rec("CP-13", "El backend sanea o rechaza <script> en el nombre del cliente", !guardadoCrudo, `HTTP ${c.status}; nombre devuelto='${g.body.nombre}'`);
    rec("CP-13", "Mitigacion en el frontend (sin dangerouslySetInnerHTML/innerHTML)", sinSinks === "0", `usos de sinks de HTML en FRONTEND/src=${sinSinks}`);
    expect(r1).toBe(true);
  });
});

describe("CP-14 Carga y descarga de documentos (RF-5, NFR-PERF)", () => {
  test("acepta solo formatos permitidos y cumple 10 s", async () => {
    const mk = (buf, nombre) =>
      api().post("/contratos").set(auth(tokenAdmin))
        .field("cliente_id", "1").field("titulo", `Doc ${nombre} ${S}`)
        .field("fecha_inicio", fechaMas(-1)).field("fecha_fin", fechaMas(200))
        .attach("file", buf, nombre);
    const pdf5 = H.pdfDePrueba(5 * 1024 * 1024);
    let t = Date.now();
    const up = await mk(pdf5, "contrato.pdf");
    const msUp = Date.now() - t;
    t = Date.now();
    const down = await api().get(`/contratos/${up.body.id}/file`).buffer(true).parse((res, cb) => { const d = []; res.on("data", (x) => d.push(x)); res.on("end", () => cb(null, Buffer.concat(d))); });
    const msDown = Date.now() - t;
    const identico = Buffer.isBuffer(down.body) && down.body.equals(pdf5);
    const exe = await mk(Buffer.from("MZ\x90\x00 programa ejecutable simulado"), "malware.exe");
    const html = await mk(Buffer.from("<html><script>alert(1)</script></html>"), "pagina.html");
    const grande = await mk(H.pdfDePrueba(25 * 1024 * 1024), "enorme.pdf");
    const png = await mk(Buffer.from("\x89PNG\r\n\x1a\n datos de imagen"), "foto.png");
    const dpng = await api().get(`/contratos/${png.body.id}/file`);
    const res = [
      rec("CP-14", "Subida de PDF de 5 MB responde 201", up.status === 201, `HTTP ${up.status}`),
      rec("CP-14", "Subida de PDF de 5 MB en menos de 10 s", msUp < 10000, `${msUp} ms`),
      rec("CP-14", "Descarga identica byte a byte y en menos de 10 s", identico && msDown < 10000, `${msDown} ms; identico=${identico}`),
      rec("CP-14", "Rechaza ejecutable (.exe)", exe.status >= 400, `HTTP ${exe.status}`),
      rec("CP-14", "Rechaza HTML (.html)", html.status >= 400, `HTTP ${html.status}`),
      rec("CP-14", "Rechaza archivo de 25 MB (limite de tamano)", grande.status >= 400, `HTTP ${grande.status}`),
      rec("CP-14", "Content-Type de la descarga corresponde al archivo (PNG)", /png/.test(dpng.headers["content-type"] || ""), `Content-Type devuelto='${dpng.headers["content-type"]}' para un PNG`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-15 Auditoria de acciones criticas (RF-6)", () => {
  test("crear, editar, eliminar, subir y descargar quedan registrados", async () => {
    const inicio = (await pool.query("SELECT coalesce(max(id),0)::int m FROM auditoria")).rows[0].m;
    const c = await api().post("/clientes").set(auth(tokenAdmin)).send({ nombre: "Auditado", correo: `aud_${S}@t.cl` });
    await api().put(`/clientes/${c.body.id}`).set(auth(tokenAdmin)).send({ nombre: "Auditado 2", correo: `aud_${S}@t.cl` });
    await api().delete(`/clientes/${c.body.id}`).set(auth(tokenAdmin));
    const k = await api().post("/contratos").set(auth(tokenAdmin)).field("cliente_id", "1").field("titulo", `Aud ${S}`).field("fecha_inicio", fechaMas(-1)).field("fecha_fin", fechaMas(100)).attach("file", H.pdfDePrueba(), "a.pdf");
    await api().get(`/contratos/${k.body.id}/file`);
    const { rows } = await pool.query("SELECT usuario_id, accion FROM auditoria WHERE id>$1 ORDER BY id", [inicio]);
    const tiene = (re) => rows.some((r) => re.test(r.accion) && r.usuario_id === "admin");
    const listado = rows.map((r) => `${r.usuario_id}|${r.accion}`).join(" ;; ");
    const res = [
      rec("CP-15", "Registra creacion de cliente con el usuario", tiene(/CLIENTES_CREAR/), "ver listado"),
      rec("CP-15", "Registra edicion de cliente con el usuario", tiene(/CLIENTES_ACTUALIZAR/), "ver listado"),
      rec("CP-15", "Registra eliminacion de cliente con el usuario", tiene(/CLIENTES_ELIMINAR/), "ver listado"),
      rec("CP-15", "Registra creacion de contrato con el usuario", tiene(/CONTRATOS_CREAR/), "ver listado"),
      rec("CP-15", "Registra la SUBIDA de documento", rows.some((r) => /document|archivo|SUBIR|SUBIDA|UPLOAD/i.test(r.accion)), "ver listado"),
      rec("CP-15", "Registra la DESCARGA de documento", rows.some((r) => /DESCARG|DOWNLOAD/i.test(r.accion)), "ver listado"),
    ];
    rec("CP-15", "Entradas generadas durante la prueba", true, listado);
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-16 Logs sin datos sensibles (NFR-SEG-6)", () => {
  test("el log del servidor no contiene contrasenas ni tokens", async () => {
    if (!SERVER_LOG || !fs.existsSync(SERVER_LOG)) {
      rec("CP-16", "Log del servidor disponible", false, "definir SERVER_LOG");
      return expect(false).toBe(true);
    }
    const log = fs.readFileSync(SERVER_LOG, "utf8");
    const conTokens = /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/.test(log);
    const conPass = ["PassB#2026", "PassC#2026", "Prueba#2026", "EdC#2026"].some((p) => log.includes(p));
    const pii = ((log.match(/authUser \{[\s\S]*?\}/g) || [])[0] || "sin coincidencias").replace(/\s+/g, " ");
    const res = [
      rec("CP-16", "El log no contiene contrasenas", !conPass, `lineas=${log.split("\n").length}`),
      rec("CP-16", "El log no contiene tokens JWT completos", !conTokens, `lineas=${log.split("\n").length}`),
    ];
    rec("CP-16", "Observacion: el log imprime el payload del token (identificadores)", true, pii);
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-17 Cifrado de datos sensibles en reposo (NFR-SEG-3)", () => {
  test("datos bancarios no se almacenan en texto plano", async () => {
    const { rows } = await pool.query("SELECT nombre_banco, numero_cuenta, titular_cuenta FROM clientes WHERE id=2");
    const num = rows[0].numero_cuenta;
    const ok = !/^\d{6,}$/.test(num);
    rec("CP-17", "numero_cuenta almacenado cifrado", ok, `numero_cuenta='${num}', banco='${rows[0].nombre_banco}', titular='${rows[0].titular_cuenta}'`);
    expect(ok).toBe(true);
  });
});

describe("CP-18 TLS y cabeceras de seguridad HTTP (NFR-SEG-1, NFR-SEG-5)", () => {
  test("HTTPS disponible y cabeceras recomendadas presentes", async () => {
    const https = require("https");
    const url = new URL(H.BASE);
    const tls = await new Promise((resolve) => {
      const rq = https.request({ host: url.hostname, port: url.port, path: "/", rejectUnauthorized: false, timeout: 3000 }, () => resolve("responde HTTPS"));
      rq.on("error", (e) => resolve(`sin TLS (${e.code || e.message})`));
      rq.on("timeout", () => { rq.destroy(); resolve("sin TLS (timeout)"); });
      rq.end();
    });
    const r = await api().get("/");
    const h = r.headers;
    const faltan = ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options"].filter((k) => !h[k]);
    const res = [
      rec("CP-18", "La API acepta conexiones HTTPS", tls === "responde HTTPS", tls),
      rec("CP-18", "Cabeceras de seguridad presentes (CSP, HSTS, nosniff, X-Frame-Options)", faltan.length === 0, `faltan: ${faltan.join(", ") || "ninguna"}`),
      rec("CP-18", "No se revela la tecnologia (X-Powered-By ausente)", !h["x-powered-by"], `X-Powered-By='${h["x-powered-by"]}'`),
      rec("CP-18", "CORS restringido (no '*')", h["access-control-allow-origin"] !== "*", `Access-Control-Allow-Origin='${h["access-control-allow-origin"]}'`),
    ];
    rec("CP-18", "CSRF: la sesion no usa cookies (token en cabecera Authorization)", !h["set-cookie"], `Set-Cookie=${h["set-cookie"] || "ausente"}`);
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-19 Gestion del secreto JWT (NFR-SEG-9)", () => {
  test("el secreto no es predecible ni esta publicado", async () => {
    const forjadoDefecto = jwt.sign({ usuarioId: 1, nombreUsuario: "admin", empresaUsuarioId: 1, empresaId: 1 }, "inseguro", { expiresIn: "1h" });
    const forjadoPublico = jwt.sign({ usuarioId: 1, nombreUsuario: "admin", empresaUsuarioId: 1, empresaId: 1 }, H.SECRETO_PUBLICADO, { expiresIn: "1h" });
    const a = await api().get("/clientes/1").set(auth(forjadoDefecto));
    const b = await api().get("/clientes/1").set(auth(forjadoPublico));
    let fallback = "n/a", readme = "n/a";
    if (REPO) {
      fallback = String(H.buscarEnArchivos(path.join(REPO, "BACKEND", "src"), /\|\|\s*["']inseguro["']/));
      readme = ["README.md", ".env"].map((f) => `${f}=${fs.readFileSync(path.join(REPO, f), "utf8").includes(H.SECRETO_PUBLICADO) ? "contiene el secreto" : "no"}`).join(", ");
    }
    const res = [
      rec("CP-19", "Token firmado con el secreto por defecto 'inseguro' es rechazado", a.status === 401, `HTTP ${a.status}`),
      rec("CP-19", "Token firmado con el secreto publicado en el repositorio es rechazado", b.status === 401, `HTTP ${b.status} (secreto presente en README.md/.env del repositorio: ${readme})`),
      rec("CP-19", "El codigo no contiene secreto de respaldo 'inseguro'", fallback === "0", `ocurrencias de || "inseguro" en BACKEND/src=${fallback}`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-20 Validacion de entradas, filtros y paginacion de clientes (RF-4)", () => {
  test("valida campos obligatorios y formato, filtra y pagina", async () => {
    const vacio = await api().post("/clientes").set(auth(tokenAdmin)).send({});
    const malCorreo = await api().post("/clientes").set(auth(tokenAdmin)).send({ nombre: "Mal Correo", correo: "esto-no-es-un-correo" });
    const busq = await api().get("/clientes/search").query({ name: "Mar" }).set(auth(tokenAdmin));
    const pag = await api().get("/clientes").query({ page: 1, limit: 2 }).set(auth(tokenAdmin));
    const res = [
      rec("CP-20", "Cliente sin campos obligatorios rechazado con 400", vacio.status === 400, `HTTP ${vacio.status}; cuerpo=${JSON.stringify(vacio.body).slice(0, 120)}`),
      rec("CP-20", "Correo con formato invalido rechazado con 400", malCorreo.status === 400, `HTTP ${malCorreo.status}`),
      rec("CP-20", "Filtro por nombre devuelve coincidencias", busq.status === 200 && busq.body.some((c) => /Mar/i.test(c.nombre)), `HTTP ${busq.status}; resultados=${busq.body.length}`),
      rec("CP-20", "Paginacion (limit=2) devuelve como maximo 2 clientes", Array.isArray(pag.body) && pag.body.length <= 2, `HTTP ${pag.status}; filas devueltas=${pag.body.length}`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});

describe("CP-21 Respaldo y recuperacion (NFR-SEG-7)", () => {
  test("se puede respaldar y restaurar y existe una politica automatizada", async () => {
    const dump = path.join(__dirname, "..", "evidence", "backup-atlas.sql");
    fs.writeFileSync(dump, H.pg("pg_dump", ["atlas"]));
    H.pg("dropdb", ["--if-exists", "atlas_restore"]);
    H.pg("createdb", ["atlas_restore"]);
    H.pg("psql", ["-q", "-d", "atlas_restore"], fs.readFileSync(dump));
    const q = (db, t) => H.pg("psql", ["-t", "-A", "-d", db, "-c", `select count(*) from ${t}`]).toString().trim();
    const tablas = ["usuarios", "clientes", "contratos", "auditoria"];
    const comp = tablas.map((t) => `${t}: origen=${q("atlas", t)} restaurado=${q("atlas_restore", t)}`);
    const iguales = tablas.every((t) => q("atlas", t) === q("atlas_restore", t));
    let automatizado = "n/a";
    if (REPO) {
      const re = /pg_dump|backup|cron|respaldo/i;
      automatizado = String(
        ["docker-compose.yml", "package.json", "BACKEND/Dockerfile", "FRONTEND/Dockerfile", "BACKEND/sql/init-db.sh"].reduce((n, f) => {
          const ruta = path.join(REPO, f);
          return n + (fs.existsSync(ruta) ? fs.readFileSync(ruta, "utf8").split(/\r?\n/).filter((l) => re.test(l)).length : 0);
        }, 0)
      );
    }
    const res = [
      rec("CP-21", "Respaldo con pg_dump y restauracion en otra BD con datos identicos", iguales, comp.join("; ")),
      rec("CP-21", "Existe un respaldo periodico automatizado en el proyecto", automatizado !== "0", `referencias a backup/cron/pg_dump en docker-compose, Dockerfile y scripts=${automatizado}`),
    ];
    expect(res.every(Boolean)).toBe(true);
  });
});
