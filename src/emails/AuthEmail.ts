import { transporter } from "../config/nodeMailer"

interface IEmail{
    email:string
    name:string,
    token:string
}


export class AuthEmail {

    static async sendConfirmationEmail(user:IEmail) {

      await transporter.sendMail({
            from: "UpTask <admin@uptask.com>",
            to: user.email,
            subject: "Uptask - Confirmar tu cuenta",
            text: "UpTask - Confirma tu cuenta",
            html: `<p>Hola ${user.name},bienvenido a upTask, confirma tu cuenta para ingresar.</p>
                    <p>Visita el siguiente enlace:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirnma tu cuenta</a>
                    <p>Ingresa el código: <b>${user.token}</b></p>
                    <p>El token expirará en 10 minutos</p>
            `

         
        })

    }

    static async sendPasswordResetToken(user:IEmail) {

        await transporter.sendMail({
              from: "UpTask <admin@uptask.com>",
              to: user.email,
              subject: "Uptask - Restablecer password",
              text: "UpTask - Restablecer password",
              html: `<p>Hola ${user.name},bienvenido a upTask, has solicitado reestablecer el password.</p>
                      <p>Visita el siguiente enlace:</p>
                      <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer contraseña</a>
                      <p>Ingresa el código: <b>${user.token}</b></p>
                      <p>El token expirará en 10 minutos</p>
              `
  
           
          })
  
      }



}