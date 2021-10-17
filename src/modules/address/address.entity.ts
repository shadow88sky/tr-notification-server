import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ValueTransformer,
} from 'typeorm';
import { Treasury } from '../treasury';
import { ChainEnum } from '../../constants';
import { lowercase } from '../../transformers';

@Entity({
  name: 'addresses',
})
@Unique('address_chain', ['address', 'chain_id'])
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({
    type: 'varchar',
    nullable: true,
    enum: ChainEnum,
    transformer: [lowercase],
  })
  chain_id: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_sync_before: boolean;

  @ManyToOne(() => Treasury)
  @JoinColumn({ name: 'treasury_id' })
  treasury: Treasury;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
