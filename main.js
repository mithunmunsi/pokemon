const content = document.querySelector('.pokedex');

let pokeData = [1, 2, 3];

const fetchData = async () => {
  await fetch('https://pokeapi.co/api/v2/pokemon?limit=121&offset=0')
    .then((response) => response.json())
    .then((data) => {
      const fetches = data.results.map((item) => {
        return fetch(item.url)
          .then((res) => res.json())
          .then((data) => {
            return {
              id: data.id,
              name: data.name,
              img: data.sprites.other['official-artwork'].front_default,
              types: data.types,
            };
          });
      });
      Promise.all(fetches).then((res) => {
        pokeData = res;
        pokeCards();
      });
    });
};

// TODO: 
// 1. pokemon.types is an array, you need to map it again
// 2. connect input and search from pokeDex array by using the .filter() method (https://www.jamesqquick.com/blog/build-a-javascript-search-bar/) 

const pokeCards = () => {
  const cards = pokeData
    .map((pokemon) => {
      return `<div>
  <img src="${pokemon.img}" alt="${pokemon.name}"/>
  <p>${pokemon.id}</p>
  <h2>${pokemon.name}</h2>
  <div>
    <p>Water</p>
    <p>Poison</p>
  </div>
</div>`;
    }).join('');

  content.innerHTML = cards;
};

fetchData();
