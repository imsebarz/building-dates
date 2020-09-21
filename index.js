const Apartments = [202, 301, 201, 302];
const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const dates = getSundaysFrom(2020, 8, 21);
const timesApartments = Math.floor(dates.length / 9);
const totalApartments = new Array(timesApartments).fill(Apartments).flat();
const list = document.querySelector(".list");

const zip = (arr1, arr2) =>
  arr1.map((index1, index2) => [index1, arr2[index2]]);

const relations = zip(totalApartments, dates);

for (let index = 0; index < relations.length; index++) {
  let element = relations[index];
  let li = document.createElement("li");
  let span = document.createElement("span");
  span.textContent = `${relations[index][0]}`;
  li.appendChild(span);
  li.appendChild(document.createTextNode(` - ${relations[index][1]}`));
  list.appendChild(li);
}

function getSundaysFrom(year, month, day) {
  var date = new Date(year, month, day);
  while (date.getDay() != 0) {
    date.setDate(date.getDate() + 1);
  }
  var days = [];
  while (date.getFullYear() < 2022) {
    var m = date.getMonth();
    var d = date.getDate();
    days.push(
      (d < 10 ? "0" + d : d) +
        " de " +
        monthNames[m] +
        " de " +
        date.getFullYear()
    );
    date.setDate(date.getDate() + 7);
  }
  return days;
}
