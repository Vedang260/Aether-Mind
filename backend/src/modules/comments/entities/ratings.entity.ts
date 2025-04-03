import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Article } from '../../articles/entities/article.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  rating_id: string;

  @Column({ type: 'uuid' })
  article_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Article, (article) => article.article_id, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'article_id'})
  article: Article;

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
