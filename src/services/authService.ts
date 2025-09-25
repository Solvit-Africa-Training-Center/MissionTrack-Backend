// src/services/userService.ts

import { database } from "../database";
import {ChangePasswordData,ForgotPasswordPayload,ResetPassPayload} from "../types/authInterface";
import jwt from "jsonwebtoken";
import { redisClient } from "../utils/redisClient";
import {Company} from "../database/models/company";

import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
export class AuthServices {
  /**
   * Authenticate user login
   */
   static async login(email:string,password:string) {
     const user = await database.User.findOne({ where: { email },include:[{model:Company,as:'company',attributes:['id','status','state']}] });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }
const companyStatus = user.company? user.company.status : null;
 const token = jwt.sign(
  {
    id: user.id.toString(),
    role: user.role,
    fullName:user.fullName,
    email: user.email,
    companyId: user.companyId,
    companyStatus: companyStatus,
  },
  JWT_SECRET,
  { expiresIn: "1d" }
);
  return {token,user};


  }

  static async logoutUser(token:string){
    const decoded=jwt.decode(token) as {exp?:number};
    if(!decoded || !decoded.exp) throw new Error("Invalid token");

    const expiresIn=decoded.exp-Math.floor(Date.now()/1000);
     await redisClient.setEx(`blacklist:${token}`, expiresIn, "true");
    return {message:"Logged out successfully"};
  }
  static async isTokenBlacklisted(token:string):Promise<boolean>{
    const result=await redisClient.get(token);
    return result==="true";
  }

  static async changePassword(data: ChangePasswordData){
    const user=await database.User.findOne({where:{email:data.email}});
    if(!user){
      throw new Error("User not found");
    }
    const isValidPassword=await bcrypt.compare(data.currentPassword,user.password);
    if(!isValidPassword){
      throw new Error(" passwords are not matching");
    }
     user.password = await bcrypt.hash(data.newPassword, 10);
     await user.save();
     return user;
  }

  static async forgotPassword(email:string){
    const user=await database.User.findOne({where:{email}});
    if(!user){throw new Error("User not found")}
     const resetToken = jwt.sign({email },JWT_SECRET, { expiresIn: "15m" });
       await user.update({
        resetToken,
       resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
  });
    return resetToken;
  }

  static async resetPassword(data:ResetPassPayload){
    try{
      jwt.verify(data.resetToken,JWT_SECRET);
    const user=await database.User.findOne({where:{email:data.email}});
    if(!user){throw new Error("User not found")};
    user.password=await bcrypt.hash(data.newPassword,10);
    await user.save();
    return user;
    }
    catch(error){
      throw new Error("Invalid or expired token");
    }

  }


 }