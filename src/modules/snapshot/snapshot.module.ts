import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnapshotController } from './snapshot.controller';
import { SnapshotService } from './snapshot.service';
import { Proposal } from './proposal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  controllers: [SnapshotController],
  providers: [SnapshotService],
  exports: [],
})
export class SnapshotModule {}
