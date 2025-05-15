// document.querySelector("btnDOP").addEventListener("click", (e) => {
//   e.preventDefault();

//   async function loadAPI() {
//     const API =
//       "https://api.getgeoapi.com/v2/currency/list?5f28997fb19be3ea2c1761362579f4c06b390813";

//     try {
//       const response = await fetch(API);

//       if (!response.ok) throw new Error("Network response was not ok");

//       const dataAPI = await response.json();
//       console.log(dataAPI);
//     } catch (error) {
//       console.error("Error al llamar la API:", error);
//     }
//   }

//   loadAPI();
// });

document.querySelector("#categories").addEventListener("change", (e) => {
  const selected = e.target.value;

  async function loadData(selected) {
    try {
      const response = await fetch("./src/data.json");

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const filter = data[selected];

      const details = document.querySelector("#details");
      details.innerHTML = `<h1 class="text-2xl text-center py-10">Impuestos 
      Segun Articulos</h1>`;

      const ul = document.createElement("ul");
      ul.className = "flex flex-wrap gap-2 justify-center pb-10 px-5";

      filter.forEach((obj) => {
        const li = document.createElement("li");
        li.className = "px-5 py-2 bg-gray-900 rounded-3xl";

        let text = `${obj.item}`;

        if (obj.selectivo) {
          text += ` - (Selectivo ${obj.selectivo}% + 20% Gravamen + 18% ITBIS)`;
        } else if (obj.gravamen) {
          text += ` - (Gravamen ${obj.gravamen}% + 18% ITBIS)`;
        } else {
          text += ` - 18% ITBIS`;
        }

        ul.appendChild(li);
        li.textContent = text;
      });

      details.appendChild(ul);

      // console.log(selected);
    } catch (error) {
      console.error("Error cargando el JSON:", error);
    }
  }

  loadData(selected);
});

document.querySelector("#btnUSD").addEventListener("click", (e) => {
  e.preventDefault();

  const inputUSD = parseFloat(document.querySelector("#inputUSD").value);
  const outputUSD = document.querySelector("#outputUSD");

  const itbis = 0.18;

  if (isNaN(inputUSD)) {
    outputUSD.value = "Valor invalido";
    outputUSD.value = "";
    return;
  }

  let totalUSD = inputUSD;
  let totalDOP = inputUSD * 60

  if (inputUSD > 200) {
    totalUSD += inputUSD * itbis;
  }

  outputUSD.value = totalUSD.toFixed(2);
  outputDOP.value = totalDOP.toFixed(2);
});
