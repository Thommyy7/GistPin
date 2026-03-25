import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GeoModule } from './geo/geo.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { SorobanModule } from './soroban/soroban.module';
import { GistsModule } from './gists/gists.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GeoModule,
    IpfsModule,
    SorobanModule,
    GistsModule,
    HealthModule,
  ],
})
export class AppModule {}
