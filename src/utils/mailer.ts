// utils/mailer.ts
import nodemailer from "nodemailer";
import { User } from "../database/models/users";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export class Mailer {
  static async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  static async notifyManagerAboutCompany(companyId: string, subject: string, message: string) {
    const manager = await User.findOne({ where: { companyId, role: "manager" } });
    if (manager) {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Hello ${manager.fullName},</h2>
          ${
            message
              ? `<p style="margin-top:10px; padding:10px; background:#f9f9f9; border-left:4px solid #007BFF;">
                  <strong>Admin's Comment:</strong><br/> ${message}
                 </p>`
              : ""
          }
          <br/>
          <p>Best regards,<br/><strong>System Administrator</strong></p>
        </div>
      `;
      await Mailer.sendMail(manager.email, subject, message.replace(/<[^>]+>/g, ""), htmlContent);
    }
  }

  static async notifyEmpAboutMission(creatorEmail: string, creatorName: string, subject: string, message: string, comment?: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Hello ${creatorName},</h2>
        <p>${message}</p>
        ${
          comment
            ? `<p style="margin-top:10px; padding:10px; background:#f9f9f9; border-left:4px solid #007BFF;">
                <strong>Manager's Comment:</strong><br/> <br/> <strong>Comment:  </strong>${comment || 'No comment provided'}

               </p>`
            : ""
        }
        <br/>
        <p>Best regards,<br/><strong>Mission Tracking Team</strong></p>
      </div>
    `;
    await Mailer.sendMail(creatorEmail, subject, message.replace(/<[^>]+>/g, ""), htmlContent);
  }

  static async notifyEmpForExpenseStatus(userEmail:string,userName:string,subject:string,message:string,statusChangeComment?:string){
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Hello ${userName},</h2>
        <p>${message}</p>
        ${
          statusChangeComment
            ? `<p style="margin-top:10px; padding:10px; background:#f9f9f9; border-left:4px solid #007BFF;">
                <strong>Manager's Comment:</strong><br/> ${statusChangeComment}
               </p>`
            : ""
        }
        <br/>
        <p>Best regards,<br/><strong>Financial manager</strong></p>
      </div>
    `;
    await Mailer.sendMail(userEmail, subject, message.replace(/<[^>]+>/g, ""), htmlContent);
  }
}