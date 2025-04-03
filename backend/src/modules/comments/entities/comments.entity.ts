import { Article } from "src/modules/articles/entities/article.entity";
import { User } from "src/modules/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'comments' })
export class Comments {
    @PrimaryGeneratedColumn('uuid')
    comment_id: string;

    @Column({ type: 'uuid' })
    article_id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => Article, (article) => article.comments, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @ManyToOne(() => User, (user) => user.id, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id'})
    user: User;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}