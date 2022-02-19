import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import WordCategory from './word-category.entity';

@Entity()
export default class Dictionary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  @Index()
  externalId: string;

  @Column({ unique: true })
  @Index({ unique: true })
  word: string;

  @ManyToOne(() => WordCategory)
  category: WordCategory;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}
