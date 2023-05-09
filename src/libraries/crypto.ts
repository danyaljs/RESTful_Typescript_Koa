import * as bcrypt from 'bcryptjs'


export const bcryptHashAsync = (string: string, salt: number | string): Promise<string> => bcrypt.hash(string, salt)



export const bcryptCompareAsync = (unencryptedString: string, hashedString: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(unencryptedString, hashedString, (error, res) => {
            if (error) reject(error)
           
            resolve(res)    
        })
    });
}