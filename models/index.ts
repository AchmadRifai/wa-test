import { AppDataSource } from "@/db";
import { BaseEntity, Column, Index, PrimaryGeneratedColumn, type EntityTarget } from "typeorm";

export class SoftDeleteBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn({})
    id: number = 0;
    @Column({ name: 'created_at', nullable: false })
    createdAt: Date = new Date();
    @Column({ name: 'updated_at', nullable: true })
    updatedAt: Date | null = null;
    @Column({ name: 'deleted_at', nullable: true, })
    @Index()
    deletedAt: Date | null = null;
}

export const getRepository = <T extends SoftDeleteBaseEntity>(target: EntityTarget<T>) => AppDataSource.getRepository(target).extend({});
