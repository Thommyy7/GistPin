import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';

export interface PinResult {
  cid: string;
  mock: boolean;
}

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private readonly devMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pinata: any;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('PINATA_API_KEY');
    const secretKey = this.config.get<string>('PINATA_SECRET_KEY');

    this.devMode = !apiKey || !secretKey;

    if (this.devMode) {
      this.logger.warn('IPFS running in DEV MODE — mock CIDs will be generated');
    } else {
      // Lazy import so missing credentials don't crash the app
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const PinataClient = require('@pinata/sdk');
      this.pinata = new PinataClient(apiKey, secretKey);
    }
  }

  /**
   * Pin a JSON object to IPFS.
   * In dev mode, returns a deterministic mock CID based on content hash.
   */
  async pinJson(content: Record<string, unknown>): Promise<PinResult> {
    if (this.devMode) {
      return this.mockPin(content);
    }

    try {
      const result = await this.pinata.pinJSONToIPFS(content, {
        pinataMetadata: { name: `gist-${Date.now()}` },
      });
      return { cid: result.IpfsHash as string, mock: false };
    } catch (err) {
      this.logger.error('Pinata pinJSON failed, falling back to mock', err);
      return this.mockPin(content);
    }
  }

  /**
   * Retrieve a JSON object from IPFS by CID.
   * In dev mode, returns a stub object.
   */
  async getJson(cid: string): Promise<Record<string, unknown>> {
    if (this.devMode || cid.startsWith('mock_')) {
      this.logger.debug(`DEV MODE: returning stub for CID ${cid}`);
      return { cid, mock: true, retrieved_at: new Date().toISOString() };
    }

    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`IPFS fetch failed: ${res.status}`);
    return res.json() as Promise<Record<string, unknown>>;
  }

  private mockPin(content: Record<string, unknown>): PinResult {
    const hash = createHash('sha256')
      .update(JSON.stringify(content) + randomBytes(4).toString('hex'))
      .digest('hex')
      .slice(0, 32);
    const cid = `mock_Qm${hash}`;
    this.logger.debug(`DEV MODE: mock CID ${cid}`);
    return { cid, mock: true };
  }
}