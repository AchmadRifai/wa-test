import { Column, Entity } from "typeorm";
import { SoftDeleteBaseEntity } from ".";

@Entity({ name: 'wa_message' })
export class WaMessage extends SoftDeleteBaseEntity {
    @Column({ nullable: false, type: 'jsonb' })
    value: string = '';
}