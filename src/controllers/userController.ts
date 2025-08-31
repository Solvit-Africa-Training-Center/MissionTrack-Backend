import { Request,Response } from "express";
import { ResponseService } from "../utils/response";
import { userInterface } from "../types/userInterface";
import { UserService } from "../services/userSercives";
import { User } from "../database/models/users";


interface IRequestUserData extends Request{
    body:userInterface
}
export const createUser=async(req:IRequestUserData,res:Response)=>{
    try {
        const userData=req.body;
        const userFound = await User.findOne({ where: { email: userData.email } });
        if(userFound){
            return ResponseService({
                data:null,
                status:400,
                success:false,
                message:"User with this email arleady exists",
                res
            })}
            const newUser=await UserService.createUser(userData);
            return ResponseService({
                data:newUser,
                status:201,
                success:true,
                message:"User Created successfully",
                res
            })
        }
        catch (error) {
        const {message,stack}=error as Error;
        return ResponseService({
            data:stack,
            status:500,
            success:false,
            message:message|| "Intenal server error",
            res
        })
        
    }
}


export const getAllUsers=async(req:Request,res:Response)=>{
    try {
        const users=await UserService.getAllUsers();
        if(!users){
            return ResponseService({
                data:[],
                status:404,
                success:false,
                message:"No user found",
                res
            })
        }
        return ResponseService({
            data:users,
            status:200,
            success:true,
            message:"All users fetched successfully",res
        })
    } catch (error) {
        const {message,stack}=error as Error;
        return ResponseService({
            data:stack,
            status:500,
            success:false,
            message:message|| "Internal server error",
            res
        });
    }}


    export const getUserById=async(req:Request,res:Response)=>{
        try {
            const id=req.params.id;
            const user=await UserService.getUserById(id);
            return ResponseService({
                data:user,
                status:200,
                res,
                success:true,
                message:"User fetched successfully"
            }) 
        } catch (error) {
            const {message,stack}=error as Error;
            return ResponseService({
                data:stack,
                status:500,
                success:false,
                message:message|| "Internal server error",
                res
            }); 
        }
    }

export const updateUser=async(req:IRequestUserData,res:Response)=>{
    try {
        const id=req.params.id;
        const updateData=req.body;
        const affectedCount=await UserService.updateUser(id,updateData);
        if(affectedCount===0 || !affectedCount){
            return ResponseService({
                data:null,
                status:404,
                success:false,
                message:"User not Found",
                res
            })
        }
        return ResponseService({
            data:affectedCount,
            status:200,
            success:true,
            message:"User updated successfully",
            res
        })
    } catch (error) {
        const {message,stack}=error as Error;
        return ResponseService({
            data:stack,
            status:500,
            success:false,
            message:message|| "Internal server error",
            res
        });
    }

}

export const deleteUser=async(req:Request,res:Response)=>{
    try {
        const id=req.params.id;
        const deletedUser=await UserService.deleteUser(id);
        if(!deletedUser){
            return ResponseService({
              data:deletedUser,
              status:404,
              success:false,
              message:"User not Found",
              res
            })
        }
        return ResponseService({
            data:deletedUser,
            status:200,
            success:true,
            message:"User deleted successfully",
            res
        })
        
    } catch (error) {
        const {message,stack}=error as Error;
        return ResponseService({
            data:stack,
            status:500,
            success:false,
            message:message|| "Internal server error",
            res
        });   
    }
}
