import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';

@Entity({
  name: 'notifications',
})
@Unique('hash', ['hash'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-json', nullable: true })
  content: [
    {
      treasury: string;
      treasury_id: string;
      contract_ticker_symbol: string;
      before: string;
      newest: string;
      ratio: string;
      address: string;
      chain_id: string;
    },
  ];

  @Column({ type: 'varchar', nullable: true })
  hash: string;

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

  @BeforeInsert()
  handleBeforeInsert() {
    console.log('handleBeforeInsert');
  }
}
