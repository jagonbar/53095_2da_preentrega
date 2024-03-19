import crypto from 'crypto'
const algoritmo = 'aes-256-cbc'
const key = crypto.randomBytes(32)
const bufferKey = Buffer.from(key)
const iv = crypto.randomBytes(16)
console.log({key,iv})

const encriptar = (password)=>{
    const cipher = crypto.createCipheriv(algoritmo, bufferKey,iv)
    cipher.update(password)
    let encriptar = cipher.final()
    return encriptar.toString('hex')
}

const desencriptar = (password)=>{
    password = Buffer.from(password, 'hex')
    const decipher = crypto.createDecipheriv(algoritmo, bufferKey,iv)
    decipher.update(password)
    let desencriptar = decipher.final()
    return desencriptar.toString('utf-8')
}

let e = encriptar("coderhouse")
console.log('encriptado:',e)
console.log('desencriptado:',desencriptar(e))