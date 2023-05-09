export interface UserPublic {
    id?: string
    email?: string
    name?: string
    dob?: Date
    address?: string
    description?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface IUser {

    email?: string
    name?: string
    dob?: Date
    address?: string
    description?: string
    password: string
}

