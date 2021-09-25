import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PluginService implements OnModuleInit {
  constructor() {}
  async onModuleInit() {}
}
