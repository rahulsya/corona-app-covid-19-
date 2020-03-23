const dataGlobal = document.querySelector(".data-global");
const dataLocal = document.querySelector(".data-country");
const alldata = document.querySelector(".all-data");
const showmore = document.querySelector(".show-more");
const search = document.querySelector(".search-data");
const lastUpdate = document.querySelector(".last-update");

let minData = 0;
let maxData = 6;

const url = [
  "https://covid19.mathdro.id/api",
  "https://covid19.mathdro.id/api/countries/ID",
  "https://covid19.mathdro.id/api/confirmed"
];

async function getDataGlobal(url) {
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

function displayDataGlobal(data) {
  dataGlobal.innerHTML = `
    <div class="bg-red-600 rounded shadow-lg w-full md:w-1/4 px-3 py-4 m-2 text-gray-100 text-center">
          <p class="font-semibold text-xl">Positif</p>
          <p class="text-3xl">${numberFormat(data.confirmed.value)}</p>
        </div>
        <div class="bg-green-600 rounded shadow-lg w-full md:w-1/4 px-3 py-4 m-2 text-gray-100 text-center">
          <p class="font-semibold text-xl">Sembuh</p>
          <p class="text-3xl">${numberFormat(data.recovered.value)}</p>
        </div>
        <div class="bg-blue-900 rounded shadow-lg w-full md:w-1/4 px-3 py-4 m-2 text-gray-100 text-center">
          <p class="font-semibold text-xl">Meninggal</p>
          <p class="text-3xl">${numberFormat(data.deaths.value)}</p>
        </div>
    `;
  lastUpdate.innerHTML = `Last Update ${new Date(data.lastUpdate)}`;
}

function displayDataLocal(data) {
  dataLocal.innerHTML = `
    <div class="text-3xl font-normal text-gray-800 mb-6 m-3">Indonesia</div>
          <div class="bg-purple-900 rounded shadow-lg w-full md:w-1/2 px-5 md:px-16 py-4 text-gray-100 justify-between flex items-center">
            <div class="text-center">
              <p class="font-semibold text-lg">Positif</p>
              <p class="text-3xl">${numberFormat(data.confirmed.value)}</p>
            </div>
            <div class="text-center">
              <p class="font-semibold text-lg">Sembuh</p>
              <p class="text-3xl">${numberFormat(data.recovered.value)}</p>
            </div>
            <div class="text-center">
              <p class="font-semibold text-lg">Meninggal</p>
              <p class="text-3xl">${numberFormat(data.deaths.value)}</p>
            </div>
          </div>
    `;
}

function displayAllData(data) {
  const color = ["bg-indigo-900", "bg-indigo-800"];
  let datas = "";
  data.map(alldata => {
    datas += `
        <div class="${
          color[Math.floor(Math.random() * color.length)]
        } rounded shadow-lg px-3 py-4 text-gray-100 justify-between flex items-center">
                    <p>${alldata.countryRegion},<br> ${alldata.provinceState}
                    
                    </p>
                    <div class="text-center">
                      <p class="font-semibold text-md">Positif</p>
                      <p class="text-2xl">${numberFormat(alldata.confirmed)}</p>
                    </div>
                    <div class="text-center">
                      <p class="font-semibold text-md">Sembuh</p>
                      <p class="text-2xl">${numberFormat(alldata.recovered)}</p>
                    </div>
                    <div class="text-center">
                      <p class="font-semibold text-md">Meninggal</p>
                      <p class="text-2xl">${numberFormat(alldata.deaths)}</p>
                    </div>
                  </div>`;
  });
  alldata.innerHTML = datas;
}

showmore.addEventListener("click", () => {
  maxData += 6;
  getDataGlobal(url[2]).then(data => {
    if (search.value.length > 0) {
      let newSearchCase = searchCase(search.value, data);
      displayAllData(newSearchCase.slice(minData, maxData));
    } else {
      displayAllData(data.slice(minData, maxData));
    }
  });
});

search.addEventListener("keyup", e => {
  getDataGlobal(url[2]).then(data => {
    let newSearchCase = searchCase(search.value, data);
    displayAllData(newSearchCase.slice(minData, maxData));
  });
});

function numberFormat(num) {
  return new Intl.NumberFormat().format(num);
}

// update filter pake regex
function searchCase(keyword, data) {
  const filter = data.filter(country => {
    const regex = new RegExp(keyword, "gi");
    return country.countryRegion.match(regex);
  });
  return filter;
}

document.addEventListener("DOMContentLoaded", () => {
  getDataGlobal(url[0]).then(data => displayDataGlobal(data));
  getDataGlobal(url[1]).then(data => displayDataLocal(data));
  getDataGlobal(url[2]).then(data => {
    displayAllData(data.slice(minData, maxData));
  });
});
