import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    const { email, nombre, token } = datos;

    //   Send mail
    const info = await transport.sendMail({
        from: "APV - Administrador de Pacientes Veterinarios",
        to: email,
        subject: 'Reestablece tu password',
        text: 'Reestablece tu password',
        html: `<p>Hola: ${nombre}, has solicitado tu password.</p>
            <p>Sigue el siguiente enlace para generar un nuevo password:</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
            <p>Si pediste reestablecer cuenta, puedes ignorar el mensaje</p>`,
    });

    console.log("Mensaje enviado: %s", info.messageId);

};


export default emailOlvidePassword;