import { Sequelize } from './node_modules/sequelize-typescript';
import { Stock } from './model/stock';
import { protfolio } from './model/protfolio';
import { history } from './model/history';

export const sequelized = new Sequelize({
    database: 'shiamkaStock',
    dialect: 'postgres',
    username: 'shiamkastock',
    password: '291085',
    host: 'localhost',
    port: 5432,
    logging: false,
    operatorsAliases: false
});

sequelized.addModels([Stock])
sequelized.addModels([history])
sequelized.addModels([protfolio])

