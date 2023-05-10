import { omit } from "../../libraries/utils";
import { bcryptCompareAsync, bcryptHashAsync } from "../../libraries/crypto";
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { UserPublic } from '../../interfaces/user.interface'

@Entity()
export class User {

    @ObjectIdColumn()
    _id!: string;

    @Column({ length: 80 })
    name!: string

    @Column({ length: 100 })
    email!: string

    @Column('text')
    password?: string

    @Column()
    dob!: Date

    @Column()
    address!: string

    @Column()
    description!: string

    @Column()
    refreshToken?: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date


    async hashPassword(): Promise<void> {
        if (this.password) this.password = await bcryptHashAsync(this.password, 8)
    }

    async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): Promise<boolean> {
        return bcryptCompareAsync(unencryptedPassword, this.password || '')
    }


    public(): UserPublic {
        return omit({ id: this._id, ...this }, ['_id', 'password', 'refreshToken'])
    }
}