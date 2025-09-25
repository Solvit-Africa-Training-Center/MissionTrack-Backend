import bcrypt from "bcrypt";
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const secretkey = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  file: any;
  user?: {
    id: string,
    role: string,
    fullName: string,
    email: string,
    companyId: string,
    companyStatus: string | null
  }
}