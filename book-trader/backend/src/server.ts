import express, { Express } from "express";
import cors from "cors";
import { registerBookHandler } from "./book-handler/bookHandler";



export class ServerApp {
  public app: Express;
  private port: number;
  private register: boolean | undefined;
  private server: any;

   /**
    * Creates a new ServerApp instance.
    *
    * @param port - The port number the server listens on (default: 8080).
    * @param options - Configuration options for the server
    */
    constructor(port: number = 8080, registerArrestHandler?: boolean) {
        this.app = express();
        this.port = port;

        this.configureMiddleware();
        this.registerPaths();
    }

    private registerPaths(){
      registerBookHandler(this.app);
    }

  /**
   * Configures global middleware for the Express app.
   */
    private configureMiddleware() {
        this.app.use(cors());
        this.app.use(express.json({ limit: "5mb" }));
    }    

    public start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Backend running at http://localhost:${this.port}`);
        });
    }

  /**
   * Returns the underlying Express app instance.
   *
   * @returns The Express application.
   */
  public getApp(): Express {
    return this.app;
  }
}


const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const server = new ServerApp();
  server.start();
}