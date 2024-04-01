export interface Prompt {
    id: string | number,
    title: string,
    prompt: string
    active: boolean
}

export enum PopupMode {
    LIST = 'listMode',
    EDIT = 'popupMode',
    TABLE = 'tableMode',
}

export enum editMode {
    NEW = 'new',
    EDIT = 'edit'
}

