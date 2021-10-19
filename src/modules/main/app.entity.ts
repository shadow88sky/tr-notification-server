import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Field, ID, ObjectType } from '@nestjs/graphql';

  @Entity({
    name: 'applications',
  })
  @Unique('name', ['name'])
  @ObjectType({ description: 'application' })
  export class App {
    @PrimaryGeneratedColumn('uuid')
    @Field(type => ID)
    id: string;
  
    @Column({ type: 'varchar', nullable: true })
    @Field()
    name: string;
  
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
  