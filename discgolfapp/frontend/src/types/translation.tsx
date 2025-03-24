type Translation = {
    id: string
    variable: string
    deactivated: boolean
    translations: { [language: string]: string }
}

export default Translation