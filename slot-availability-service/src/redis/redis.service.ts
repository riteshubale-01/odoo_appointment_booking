import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private locks = new Map<string, boolean>();

  onModuleInit() {
    this.logger.log('Memory Lock Service Initialized (Replacing Redis)');
  }

  onModuleDestroy() {}

  async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    if (this.locks.get(key)) {
      return false;
    }
    
    this.locks.set(key, true);
    
    // Auto-release after TTL
    setTimeout(() => {
      this.releaseLock(key);
    }, ttlSeconds * 1000);
    
    return true;
  }

  async releaseLock(key: string): Promise<void> {
    this.locks.delete(key);
  }
}
