import { DataTypes, Model } from "sequelize";
import { sequelize } from "..";
import { CompanyAttributes } from "../../types/companyInterface";
import { User } from "./users";

interface CompanyCreationAttributes extends Omit<CompanyAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
    public id!: string;
    public email!: string;
    public state!: 'active' | 'inactive';
    public status!: 'pending' | 'approved' | 'rejected';
    public proofDocument!: string;
    public approveComment!: string;
    public blockUnblockComment!:string;
    public phone!: string;
    public province!: string;
    public district!: string;
    public sector!: string;
    public companyName!: string;
    public companyEmail!: string;
    public companyContact!: string;

}

Company.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    companyEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    proofDocument: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyContact: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: "active"
    },
    blockUnblockComment:{
        type:DataTypes.TEXT,
        allowNull:true
    },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    approveComment:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW

    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    paranoid: false
});


export { Company };
