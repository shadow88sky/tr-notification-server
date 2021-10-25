import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Treasury } from '../treasury';
import { ChainEnum } from '../../constants';
import { lowercase } from '../../transformers';

@Entity({
  name: 'balances',
})
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  balance: string;

  @Column({ type: 'varchar', nullable: true })
  balanceExact: string;

  @Column({ type: 'varchar', nullable: true, default: '0' })
  balance_usd: string;

  @Column({ type: 'varchar', nullable: true })
  balance_from: string;

  @Column({ type: 'varchar', nullable: true })
  quote_currency: string;

  @Column({
    type: 'varchar',
    nullable: true,
    enum: ChainEnum,
    transformer: [lowercase],
  })
  chain_id: string;

  @Column({ type: 'varchar', nullable: true })
  contract_name: string;

  @Column({ nullable: true })
  contract_decimals: number;

  @Column({ type: 'varchar', nullable: true })
  contract_ticker_symbol: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: '0',
    transformer: [lowercase],
  })
  contract_address: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: true, default: '0' })
  quote_rate: number;

  @Column('varchar', { array: true, nullable: true })
  supports_erc: string[];

  @Column({ type: 'varchar', nullable: true })
  nft_token_id: string;

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
