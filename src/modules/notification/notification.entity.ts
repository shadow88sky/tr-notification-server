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
  name: 'notifications',
})
// @Unique('categoryid_address_newest_before', [
//   'category_id',
//   'address',
//   'newest',
//   'before',
// ])
@Unique('content', ['content'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-json', nullable: true })
  content: [
    {
      category: string;
      category_id: string;
      contract_ticker_symbol: string;
      before: string;
      newest: string;
      ratio: string;
      address: string;
      chain_id: string;
    },
  ];

  // @Column({ type: 'varchar', nullable: true })
  // category_id: string;

  // @Column({ type: 'varchar', nullable: true })
  // category: string;

  // @Column({ type: 'varchar', nullable: true })
  // address: string;

  // @Column({ type: 'varchar', nullable: true })
  // chain_id: string;

  // @Column({ type: 'varchar', nullable: true })
  // contract_ticker_symbol: string;

  // @Column({ type: 'varchar', nullable: true })
  // before: string;

  // @Column({ type: 'varchar', nullable: true })
  // newest: string;

  // @Column({ type: 'varchar', nullable: true })
  // ratio: string;

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
