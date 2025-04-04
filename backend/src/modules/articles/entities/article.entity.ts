import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Category } from '../entities/category.entity';
import { Comments } from 'src/modules/comments/entities/comments.entity';

@Entity({ name: 'articles' })
export class Articles {
  @PrimaryGeneratedColumn('uuid')
  article_id: string;

  @Column({ type: 'uuid' })
  author_id: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @Column()
  image_url: string;
  
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Category, (category) => category.category_id, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  views: number;

  @OneToMany(() => Comments, (comment) => comment.article)
  comments: Comments[];
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
