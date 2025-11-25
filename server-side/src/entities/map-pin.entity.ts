import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { World } from './world.entity';
import { WorldItem } from './world-item.entity';

@Entity({ name: 'map_pins' })
export class MapPin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'world_id' })
  worldId: string;

  @ManyToOne(() => World, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'world_id' })
  world: World;

  @Column({ name: 'item_id', nullable: true })
  itemId: string;

  @ManyToOne(() => WorldItem, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'item_id' })
  linkedItem: WorldItem;

  @Column('float')
  x: number;

  @Column('float')
  y: number;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  customLabel?: string;
}
