import { getEstufasIds } from './config/influx';

async function testar() {
    try {
        const estufas = await getEstufasIds();

        console.log('Estufas encontradas:', estufas);

    } catch (error) {
        console.error(error);
    }
}

testar();