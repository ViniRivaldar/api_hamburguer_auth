import Sequelize from 'sequelize';
import databaseConfig from '../config/database.js';
import User from '../app/model/User.js';

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);
    this.init();
  }

  init() {
    // Inicializa todos os modelos
    User.init(this.connection);
  }
}

export default new Database();