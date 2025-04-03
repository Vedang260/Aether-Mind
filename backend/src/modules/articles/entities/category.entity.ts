import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column({ type: 'text', unique: true })
  name: string;

}
