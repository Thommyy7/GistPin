import { Injectable, Logger } from '@nestjs/common';
import { CreateGistDto } from './dto/create-gist.dto';
import { QueryGistsDto } from './dto/query-gists.dto';
import { GistRepository } from './gist.repository';
import { GeoService } from '../geo/geo.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { SorobanService } from '../soroban/soroban.service';
import { Gist } from './entities/gist.entity';

@Injectable()
export class GistsService {
  private readonly logger = new Logger(GistsService.name);

  constructor(
    private readonly gistRepository: GistRepository,
    private readonly geoService: GeoService,
    private readonly ipfsService: IpfsService,
    private readonly sorobanService: SorobanService,
  ) {}

  async create(dto: CreateGistDto): Promise<Gist> {
    // 1. Encode location cell (precision 7 ~ 153m)
    const locationCell = this.geoService.encode(dto.lat, dto.lon);

    // 2. Pin content to IPFS
    const { cid } = await this.ipfsService.pinJson({
      content: dto.content,
      lat: dto.lat,
      lon: dto.lon,
      location_cell: locationCell,
      created_at: new Date().toISOString(),
    });

    // 3. Post to Soroban contract (mock in dev)
    const { gistId, txHash } = await this.sorobanService.postGist(
      locationCell,
      cid,
      dto.author,
    );

    this.logger.log(`Gist posted → cell=${locationCell} cid=${cid} gistId=${gistId}`);

    // 4. Persist to Postgres
    return this.gistRepository.create({
      content: dto.content,
      lat: dto.lat,
      lon: dto.lon,
      location_cell: locationCell,
      content_hash: cid,
      stellar_gist_id: gistId,
      tx_hash: txHash,
    });
  }

  async findNearby(query: QueryGistsDto): Promise<Gist[]> {
    return this.gistRepository.findNearby({
      lat: query.lat,
      lon: query.lon,
      radiusMeters: query.radius,
      limit: query.limit,
      cursor: query.cursor,
    });
  }

  async findOne(id: string): Promise<Gist | null> {
    return this.gistRepository.findByGistId(id);
  }
}