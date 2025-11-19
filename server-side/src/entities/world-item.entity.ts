import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { World } from './world.entity';

@Entity({ name: 'world_items' })
export class WorldItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => World, (world) => world.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'world_id' })
  world: World;

  @Column({ name: 'world_id' })
  worldId: string;

  @Column({ length: 80 })
  type: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  payload: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
