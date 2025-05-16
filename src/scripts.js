const select = document.querySelector("#items");
const inputUSD = document.querySelector("#inputUSD");
const btnUSD = document.querySelector("#btnUSD");
const outputUSD = document.querySelector("#outputUSD");
const outputDOP = document.querySelector("#outputDOP");
const details = document.querySelector("#details");

const EXCHANGE_RATE = 56; // Ejemplo tasa de cambio USD a DOP

let dataGlobal = null;

// Cargar JSON y llenar el select (modificado para guardar dataGlobal)
(async () => {
  try {
    const response = await fetch("src/data.json");
    if (!response.ok) throw new Error("Error al cargar el JSON");

    const data = await response.json();
    dataGlobal = data; // Guardamos global para usar luego

    const allItems = [...data.soloItb, ...data.plusGrav, ...data.plusSel];

    // Ordenar alfabéticamente...
    allItems.sort((a, b) => a.name.localeCompare(b.name));

    allItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando las opciones al select", error);
  }
})();

// Función para calcular impuestos
function calculateTaxes(itemName, amount) {
  if (!dataGlobal) return null;

  // Buscar el item en las 3 categorías
  const allItems = [
    ...dataGlobal.soloItb,
    ...dataGlobal.plusGrav,
    ...dataGlobal.plusSel,
  ];

  const item = allItems.find((i) => i.name === itemName);
  if (!item) return null;

  const taxes = item.tax;
  let totalTax = 0;

  // Convertir porcentaje a decimal
  for (const taxType in taxes) {
    const rate = taxes[taxType] / 100;
    totalTax += amount * rate;
  }

  const totalUSD = amount + totalTax;
  const totalDOP = totalUSD * EXCHANGE_RATE;

  return { totalUSD, totalDOP, taxDetails: taxes };
}

// Evento botón
btnUSD.addEventListener("click", () => {
  const selectedItem = select.value;
  const amount = parseFloat(inputUSD.value);

  if (!selectedItem || isNaN(amount) || amount <= 0) {
    alert("Selecciona un artículo y escribe un monto válido.");
    return;
  }

  const result = calculateTaxes(selectedItem, amount);

  if (!result) {
    alert("No se encontró el artículo seleccionado.");
    return;
  }

  outputUSD.value = `US$ ${result.totalUSD.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  outputDOP.value = `RD$ ${result.totalDOP.toLocaleString("es-DO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Mostrar detalles de impuestos
  details.className = "bg-cyan-950 rounded-sm p-5";
  details.innerHTML = `<h3 class="text-xl mb-3 text-white font-semibold">Detalles de Impuestos Aplicados</h3>
    <ul class="flex flex-wrap gap-5">
      ${Object.entries(result.taxDetails)
        .map(
          ([key, value]) => `
        <li class="bg-cyan-800 font-semibold p-2 rounded-sm">${key}: <span class="font-normal">${value.toFixed(1)}%</span></li>`
        )
        .join("")}
    </ul>`;
});
