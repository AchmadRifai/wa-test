import { Column, Entity } from "typeorm";
import { SoftDeleteBaseEntity } from ".";

@Entity({ name: 'wa_version' })
export class WaVersion extends SoftDeleteBaseEntity {
    @Column({ nullable: false })
    version: string = '';
    @Column({ nullable: false, type: 'jsonb' })
    response: string = '';
}
