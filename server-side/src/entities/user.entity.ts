import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { World } from './world.entity';
import { AuthToken } from './auth-token.entity';

export type UserRole = 'user' | 'admin';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 60 })
  username: string;

  @Column({ unique: true, length: 320 })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => World, (world) => world.owner)
  ownedWorlds: World[];

  @ManyToMany(() => World, (world) => world.coAuthors)
  coauthoredWorlds: World[];

  @OneToMany(() => AuthToken, (token) => token.user)
  tokens: AuthToken[];
}
