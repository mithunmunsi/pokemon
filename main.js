const pokeContent = document.querySelector('.pokeCards');
const getGen = document.querySelectorAll('.btn');
const numOfPokemon = document.querySelector('#pokemons');
const search = document.querySelector('#search-box');
const toTopBtn = document.querySelector('#backToTop');

let pokeData = [];

// 1)) FETCHING DATA FROM POKEAPI

const getPokemon = async (gen) => {
  await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`)
    .then((res) => res.json())
    .then((data) => {
      const fetches = data.pokemon_species.map((species) => {
        numOfPokemon.textContent = `There are ${data.pokemon_species.length} pokemons in the generation ${gen}`;

        return fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}/`)
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else if (res.status === 404) {
              return Promise.reject('Page not found');
            } else {
              return Promise.reject('Something Went Wront!');
            }
          })
          .then((data) => {
            return {
              id: data.id,
              name: data.name,
              img: data.sprites.other['official-artwork'].front_default,
              types: data.types,
              weight: data.weight,
              height: data.height,
            };
          })
          .catch((error) => {
            return {};
          });
      });
      Promise.all(fetches).then((res) => {
        pokeData = res;
        pokeCards(pokeData);
      });
    });
};
// 2)) ADDING DATA TO THE HTML PAGE
function pokeCards(data) {
  const cards = data.map((pokemon) => {
    if (pokemon.types != undefined) {
      return `<div class="card">
            <div class="img"><img src=${pokemon.img}></div>
            <div class="pokeName">${pokemon.name}</div>
            <div class="pokeTypes">
            ${pokemon.types.map((type) => getType(type)).join('')}
            </div>
            <div class=pokeDimensions>
            <p>weight: ${pokemon.weight}</p>
            <p>height: ${pokemon.height}</p>
            </div>
            <div class="pokeRank">#${pokemon.id}</div>
            </div>`;
    }
  });
  pokeContent.innerHTML = cards;
  search.classList.add('show');
}

function getType(type) {
  return `<p>${type.type.name}</p>`;
}

getGen.forEach((el, i) => {
  el.addEventListener('click', () => getPokemon(i + 1));
});

// 3)) SEARCH HANDLER
function searchHandler(input, array) {
  let newPokedList = []; //an empty array of pokemons contains search inputs

  if (input.length <= 0) {
    pokeCards(pokeData);
  } else {
    const pokemons = array.filter(
      (pokemon) => pokemon != undefined && pokemon.name != undefined
    );
    newPokedList = pokemons.filter((pokemon) => pokemon.name.includes(input));
    pokeCards(newPokedList);
  }
}
search.addEventListener('input', () => searchHandler(search.value, pokeData));

// 4)) BACK TO TOP FUNCTION HANDLER
// Browser onscroll event triger
window.onscroll = function () {
  scrollFunction();
};
// Code from W3S about scrolling to top
function scrollFunction() {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    toTopBtn.style.display = 'block';
  } else {
    toTopBtn.style.display = '';
  }
}

function getTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
toTopBtn.addEventListener('click', getTop);
