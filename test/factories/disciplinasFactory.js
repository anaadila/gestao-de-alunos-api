import { faker } from '@faker-js/faker';

export function novaDisciplina() {

    const timestamp = Date.now();
    const primeiroNomeDisciplina = faker.commerce.department()
    const segundoNomeDisciplina = faker.person.jobArea()

    return {
                nome: `${primeiroNomeDisciplina} ${segundoNomeDisciplina}`,
                codigo: `${primeiroNomeDisciplina.charAt(0)}${segundoNomeDisciplina.charAt(0)}${timestamp}`,
                cargaHoraria: faker.number.int({ min: 30, max: 90 })
            }

}