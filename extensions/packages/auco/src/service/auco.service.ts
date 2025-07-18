import { StarknetIndexer, IndexerConfig } from "auco";
import deployedContracts from "../contracts/deployedContracts";
import Database from "better-sqlite3";

export class AucoService {
  private indexer: StarknetIndexer | null = null;
  private db: Database.Database;

  constructor() {
    this.db = new Database(process.env.SQLITE_DB_PATH || "./indexer.db");
    this.createGreetingTable();
    this.initializeIndexer();
  }

  private createGreetingTable() {
    this.db.prepare(`CREATE TABLE IF NOT EXISTS Greeting (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      greeting_setter TEXT,
      greeting TEXT,
      premium INTEGER,
      value INTEGER,
      timestamp TEXT
    )`).run();
  }

  private async initializeIndexer() {
    try {
      // Create a simple configuration that should work
      const config: IndexerConfig = {
        rpcNodeUrl: process.env.RPC_URL || 'http://127.0.0.1:5050',
        wsNodeUrl: process.env.WS_URL || 'ws://127.0.0.1:5050/ws',
        database: {
          type: 'sqlite',
          config: {
            dbInstance: this.db,
          }
        },
        startingBlockNumber: process.env.STARTING_BLOCK_NUMBER === "latest" ? "latest" : parseInt(process.env.STARTING_BLOCK_NUMBER || '0'),
      };

      this.indexer = new StarknetIndexer(config);

      // Add more events to index here using onEvent function
      this.indexer.onEvent({
        contractAddress: deployedContracts.devnet.YourContract.address,
        abi: deployedContracts.devnet.YourContract.abi,
        eventName: "contracts::YourContract::YourContract::GreetingChanged",
        handler: async (event) => {
          const { greeting_setter, new_greeting, premium, value } = event.parsed;
          const greetingSetterAddress = `0x${(greeting_setter as unknown as number).toString(16)}`;
    
          this.db.prepare(
            `INSERT INTO Greeting (greeting_setter, greeting, premium, value, timestamp) VALUES (?, ?, ?, ?, ?)`
          ).run(
            greetingSetterAddress,
            new_greeting,
            premium ? 1 : 0,
            value.None ? 0 : value.Some,
            new Date().toISOString()
          );
        }
      })
      
      console.log('✅ Indexer initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize indexer:', error);
    }
  }

  async startIndexer(): Promise<boolean> {
    if (!this.indexer) {
      console.error('❌ Indexer not initialized');
      return false;
    }

    try {
      await this.indexer.start();
      console.log('🚀 Indexer started successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to start indexer:', error);
      return false;
    }
  }

  async stopIndexer(): Promise<boolean> {
    if (!this.indexer) {
      return false;
    }

    try {
      await this.indexer.stop();
      console.log('⏹️ Indexer stopped successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to stop indexer:', error);
      return false;
    }
  }

  async getIndexedData() {
    const rows = this.db.prepare(
      `SELECT id, greeting_setter, greeting, premium, value, timestamp FROM Greeting ORDER BY id`
    ).all();

    return {
      events: rows,
      total: rows.length,
    };
  }} 