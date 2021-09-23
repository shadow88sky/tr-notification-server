import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({
  name: 'histories',
})
@Unique('address_contract_timestamp', [
  'address',
  'timestamp',
  'contract_address',
])
@Index('timestamp', [
  'timestamp',
])
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  balance: string;

  @Column({ type: 'varchar', nullable: true })
  balanceExact: string;

  @Column({ type: 'varchar', nullable: true })
  quote_currency: string;

  @Column({ type: 'varchar', nullable: true })
  timestamp: string;

  @Column({ type: 'varchar', nullable: true })
  quote_rate: string;

  @Column({ type: 'varchar', nullable: true })
  contract_name: string;

  @Column({ nullable: true })
  contract_decimals: number;

  @Column({ type: 'varchar', nullable: true })
  contract_ticker_symbol: string;

  @Column({ type: 'varchar', nullable: true })
  contract_address: string;

  @Column({ nullable: true })
  chain_id: number;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
