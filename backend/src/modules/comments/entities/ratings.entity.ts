import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Articles } from '../../articles/entities/article.entity';

@Entity({ name: 'ratings' })
export class Ratings {
  @PrimaryGeneratedColumn('uuid')
  rating_id: string;

  @Column({ type: 'uuid' })
  article_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Articles, (article) => article.article_id, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'article_id'})
  article: Articles;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
