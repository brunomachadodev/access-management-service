import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  metadata_id: number;

  @Column({ type: 'varchar', length: 180, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 180, nullable: false })
  username_canonical: string;

  @Column({ type: 'varchar', length: 180, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 180, nullable: false })
  email_canonical: string;

  @Column({ type: 'boolean', nullable: false })
  enabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  salt: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'datetime', nullable: true })
  last_login: Date;

  @Column({ type: 'varchar', length: 180, nullable: true })
  confirmation_token: string;

  @Column({ type: 'datetime', nullable: true })
  password_requested_at: Date;

  @Column({ type: 'simple-array', nullable: false })
  roles: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  uuid: string;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at?: Date | null;
}
