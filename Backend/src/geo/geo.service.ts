import { Injectable } from '@nestjs/common';

@Injectable()
export class GeoService {
  private readonly BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

  /**
   * Encode lat/lon into a geohash cell string.
   * Precision 7 → ~153m x 153m cells (used for location_cell on-chain).
   */
  encode(lat: number, lon: number, precision = 7): string {
    let minLat = -90,
      maxLat = 90;
    let minLon = -180,
      maxLon = 180;
    let hash = '';
    let bits = 0;
    let charIndex = 0;
    let isEven = true;

    while (hash.length < precision) {
      if (isEven) {
        const mid = (minLon + maxLon) / 2;
        if (lon > mid) {
          charIndex = (charIndex << 1) + 1;
          minLon = mid;
        } else {
          charIndex = charIndex << 1;
          maxLon = mid;
        }
      } else {
        const mid = (minLat + maxLat) / 2;
        if (lat > mid) {
          charIndex = (charIndex << 1) + 1;
          minLat = mid;
        } else {
          charIndex = charIndex << 1;
          maxLat = mid;
        }
      }

      isEven = !isEven;
      bits++;

      if (bits === 5) {
        hash += this.BASE32[charIndex];
        bits = 0;
        charIndex = 0;
      }
    }

    return hash;
  }

  /**
   * Decode a geohash string back to { lat, lon } center coordinates.
   */
  decode(hash: string): { lat: number; lon: number } {
    let minLat = -90,
      maxLat = 90;
    let minLon = -180,
      maxLon = 180;
    let isEven = true;

    for (const char of hash) {
      const idx = this.BASE32.indexOf(char);
      for (let bits = 4; bits >= 0; bits--) {
        const bitN = (idx >> bits) & 1;
        if (isEven) {
          const mid = (minLon + maxLon) / 2;
          if (bitN === 1) minLon = mid;
          else maxLon = mid;
        } else {
          const mid = (minLat + maxLat) / 2;
          if (bitN === 1) minLat = mid;
          else maxLat = mid;
        }
        isEven = !isEven;
      }
    }

    return {
      lat: (minLat + maxLat) / 2,
      lon: (minLon + maxLon) / 2,
    };
  }
}