import { Column, Entity } from "typeorm";
import { SoftDeleteBaseEntity } from ".";

@Entity({ name: 'wa_data' })
export class WaData extends SoftDeleteBaseEntity {
    @Column({ nullable: false })
    key: string = '';
    @Column({ nullable: false, type: 'jsonb' })
    value: string = '';
}
