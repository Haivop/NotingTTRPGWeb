import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { World } from './world.entity';

@Entity({ name: 'world_tags' })
export class WorldTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  label: string;

  @ManyToOne(() => World, (world) => world.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'world_id' })
  world: World;

  @Column({ name: 'world_id' })
  worldId: string;
}
