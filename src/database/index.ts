import databaseConfig from "../config/config";
import { Sequelize } from "sequelize";
import { configInterface } from "../types/databaseInterface";

const dbconnection=()=>{
    const db_config=databaseConfig() as configInterface;
    const sequelize=new Sequelize({...db_config,dialect:'postgres'});
    return sequelize;
}

export const database=dbconnection();