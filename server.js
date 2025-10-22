import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Ruta para probar conexión
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente ✅");
});

// ✅ Endpoint para enviar correos
app.post("/send-code", async (req, res) => {
  const { correo, codigo, rol } = req.body;

  if (!correo || !codigo || !rol) {
    return res.status(400).json({ success: false, error: "Faltan datos" });
  }

  const msg = {
    to: correo,
    from: "informatica@reque.gob.pe", // tu remitente verificado en SendGrid
    subject: "Código de registro - Municipalidad de Reque",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Municipalidad Distrital de Reque</h2>
        <p>Estimado(a),</p>
        <p>Su código de registro es:</p>
        <h1 style="color:#007BFF;">${codigo}</h1>
        <p>Rol asignado: <strong>${rol}</strong></p>
        <p>Por favor, ingrese este código en la app móvil para continuar con su registro.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">Este mensaje fue enviado automáticamente. No responda a este correo.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔁 Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
