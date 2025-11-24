import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { WorldItem } from './world-item.entity';
import { WorldTag } from './world-tag.entity';

@Entity({ name: 'worlds' })
export class World {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'map_url', nullable: true })
  mapUrl?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  era?: string;

  @Column({ nullable: true })
  themes?: string;

  @Column({ name: 'starting_region', nullable: true })
  startingRegion?: string;

  @Column('text', { array: true, nullable: true })
  contributors: string[];

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.ownedWorlds, { eager: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToMany(() => User, (user) => user.coauthoredWorlds, {
    cascade: false,
  })
  @JoinTable({
    name: 'world_co_authors',
    joinColumn: { name: 'world_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  coAuthors: User[];

  @OneToMany(() => WorldItem, (item) => item.world)
  items: WorldItem[];

  @OneToMany(() => WorldTag, (tag) => tag.world, { cascade: true })
  tags: WorldTag[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
