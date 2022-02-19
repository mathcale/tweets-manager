import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default class Database {
  private static connection: Connection;

  public static async getConnection() {
    if (!this.connection) {
      const connectionOptions = await getConnectionOptions();

      Object.assign(connectionOptions, {
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        entities: [__dirname + '/entities/*'],
      });

      this.connection = await createConnection(connectionOptions);
      console.info('Connected to database!');
    }

    return this.connection;
  }
}
