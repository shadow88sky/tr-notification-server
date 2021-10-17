import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'proposals',
})
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  proposalId: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  body: string;

  @Column({ type: 'varchar', nullable: true })
  choices: string;

  @Column({ type: 'varchar', nullable: true })
  start: string;

  @Column({ type: 'varchar', nullable: true })
  end: string;

  @Column({ type: 'varchar', nullable: true })
  snapshot: string;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ type: 'varchar', nullable: true })
  author: string;

  @Column({ type: 'varchar', nullable: true })
  created: string;

  @Column({ type: 'varchar', nullable: true })
  plugins: string;

  @Column({ type: 'varchar', nullable: true })
  network: string;

  @Column({ type: 'varchar', nullable: true })
  space_id: string;

  @Column({ type: 'varchar', nullable: true })
  space_name: string;

  @Column({ type: 'varchar', nullable: true })
  strategies: string;
}
