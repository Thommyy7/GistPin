import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

export interface PostGistResult {
  gistId: string;
  txHash: string;
  mock: boolean;
}

export interface GetGistResult {
  gistId: string;
  locationCell: string;
  contentHash: string;
  createdAt: number;
  mock: boolean;
}

export interface GistEvent {
  gistId: string;
  locationCell: string;
  contentHash: string;
  author: string | null;
  ledger: number;
  createdAt: number;
}

@Injectable()
export class SorobanService {
  private readonly logger = new Logger(SorobanService.name);
  private readonly mockMode: boolean;

  constructor(private readonly config: ConfigService) {
    const contractId = this.config.get<string>('CONTRACT_ID_GIST_REGISTRY');
    this.mockMode = !contractId;

    if (this.mockMode) {
      this.logger.warn('Soroban running in MOCK MODE — no blockchain calls will be made');
    }
  }

  /**
   * Post a gist to the GistRegistry contract.
   * In mock mode, returns a fake transaction hash and gist ID after a short delay.
   */
  async postGist(
    locationCell: string,
    contentHash: string,
    author?: string,
  ): Promise<PostGistResult> {
    if (this.mockMode) {
      await this.simulateDelay();
      const gistId = String(Date.now());
      const txHash = `mock_tx_${randomBytes(16).toString('hex')}`;
      this.logger.debug(`MOCK postGist → gistId=${gistId} txHash=${txHash}`);
      return { gistId, txHash, mock: true };
    }

    throw new Error('Real Soroban integration not yet implemented');
  }

  /**
   * Retrieve a gist record from the GistRegistry contract by ID.
   */
  async getGist(gistId: string): Promise<GetGistResult> {
    if (this.mockMode) {
      await this.simulateDelay();
      return {
        gistId,
        locationCell: 'mock_cell',
        contentHash: `mock_Qm${randomBytes(16).toString('hex')}`,
        createdAt: Math.floor(Date.now() / 1000),
        mock: true,
      };
    }

    throw new Error('Real Soroban integration not yet implemented');
  }

  /**
   * Fetch contract events since a given ledger sequence number.
   * Used by the IndexerService to poll for new on-chain gists.
   * In mock mode, returns an empty array (indexer has nothing to process in dev).
   */
  async getEventsSince(ledger: number): Promise<GistEvent[]> {
    if (this.mockMode) {
      this.logger.debug(`MOCK getEventsSince(${ledger}) → []`);
      return [];
    }

    // TODO: real Soroban RPC getEvents call when CONTRACT_ID_GIST_REGISTRY is set
    throw new Error('Real Soroban getEvents not yet implemented');
  }

  /** Simulates 100–300ms network latency */
  private simulateDelay(): Promise<void> {
    const ms = 100 + Math.floor(Math.random() * 200);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}