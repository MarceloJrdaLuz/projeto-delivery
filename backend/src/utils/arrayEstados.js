export const estadosSiglas = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
]

export const estado = (uf) => {
    let ESTADO = undefined
    switch(uf){
        case 'AC': ESTADO = 'Acre'; break;
        case 'AL': ESTADO = 'Alagoas'; break;
        case 'AP': ESTADO = 'Amapá'; break;
        case 'AM': ESTADO = 'Amazonas'; break;
        case 'BA': ESTADO = 'Bahia'; break;
        case 'CE': ESTADO = 'Ceará'; break;
        case 'DF': ESTADO = 'Distrito Federal'; break;
        case 'ES': ESTADO = 'Espírito Santo'; break;
        case 'GO': ESTADO = 'Goiás'; break;
        case 'MA': ESTADO = 'Maranhão'; break;
        case 'MT': ESTADO = 'Mato Grosso'; break;
        case 'MS': ESTADO = 'Mato Grosso do Sul'; break;
        case 'MG': ESTADO = 'Minas Gerais'; break;
        case 'PA': ESTADO = 'Pará'; break;
        case 'PB': ESTADO = 'Paraíba'; break;
        case 'PR': ESTADO = 'Paraná'; break;
        case 'PE': ESTADO = 'Pernambuco'; break;
        case 'PI': ESTADO = 'Piauí'; break;
        case 'RJ': ESTADO = 'Rio de Janeiro'; break;
        case 'RN': ESTADO = 'Rio Grande do Norte'; break;
        case 'RS': ESTADO = 'Rio Grande do Sul'; break;
        case 'RO': ESTADO = 'Rond&ohat;nia'; break;
        case 'RR': ESTADO = 'Roraima'; break;
        case 'SC': ESTADO = 'Santa Catarina'; break;
        case 'SP': ESTADO = 'São Paulo'; break;
        case 'SE': ESTADO = 'Sergipe'; break;
        case 'TO': ESTADO = 'Tocantins'; break; 
    } 
    return ESTADO
}