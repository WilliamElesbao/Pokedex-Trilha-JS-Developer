
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    // Adicionando estatísticas do Pokémon
    pokemon.stats = pokeDetail.stats.map((stat) => {
        return {
            name: stat.stat.name,
            value: stat.base_stat
        };
    });

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)

}
// processamento assincrono

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        // foi ate e o server e buscou a lista de pokemons e converteu ela pra json
        .then((response) => response.json())
        // pegou a lista que estava dentro do json
        .then((jsonBody) => jsonBody.results)
        // transformando a lista em uma nova lista de promesas do detalhe do pokemon,
        // de uma nova requisicao. Essa lista de promessa vai vir uma lista em formato
        // json
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}


