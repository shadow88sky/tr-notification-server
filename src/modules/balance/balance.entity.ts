import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity({
  name: 'balances',
})
@Unique('address_contract_updated', [
  'address',
  'updated_at',
  'contract_address',
])
export class Balance {
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

  @Column({ nullable: true })
  chain_id: number;

  @Column({ type: 'varchar', nullable: true })
  contract_name: string;

  @Column({ nullable: true })
  contract_decimals: number;

  @Column({ type: 'varchar', nullable: true })
  contract_ticker_symbol: string;

  @Column({ type: 'varchar', nullable: true })
  contract_address: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: true, default: '0' })
  quote_rate: number;

  @Column('varchar', { array: true, nullable: true })
  supports_erc: string[];

  @Column({ type: 'varchar', nullable: true })
  nft_token_id: string;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
