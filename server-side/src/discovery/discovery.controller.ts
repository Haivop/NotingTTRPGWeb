import { Controller, Get } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('home')
  getHomeHighlights() {
    return this.discoveryService.getHomeHighlights();
  }

  @Get('hub')
  getHubSummary() {
    return this.discoveryService.getHubSummary();
  }
}
