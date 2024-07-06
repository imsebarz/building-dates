class Apartments {
  constructor() {
    // Initialize the array of apartment numbers
    this.apartments = [202, 301, 201, 302];
    // Set the date formatting options
    this.options = {year: "numeric", month: "long", day: "numeric", hour12:"false"};
  }

  getSundaysFrom(year, month, day, to) {
    // Create a date object starting from the specified year, month, and day
    let date = new Date(year, month - 1, day);
    // Move the date forward until it reaches a Sunday
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }
    // Create an array to store the Sundays
    let days = [];
    // Add Sundays to the array until the specified ending year is reached
    while (date.getFullYear() < to) {
      days.push(date.toLocaleDateString("es", this.options));
      date.setDate(date.getDate() + 7);
    }
    // Return the array of Sundays
    return days;
  }

  getRelations() {
    // Get the list of Sundays between the specified date and the specified ending year
    const dates = this.getSundaysFrom(2022, 10, 22, 2024);
    // Flatten the array of apartments into a single array with the same length as the dates array
    const totalApartments = new Array(dates.length).fill(this.apartments).flat();
    // Return an array of arrays, where each sub-array contains an apartment number and a date
    return dates.map((date, index) => [totalApartments[index], date]);
  }
}
// Create a new Apartments object and get its relations
const relations = new Apartments().getRelations();

// Function to render the relations as a list
function renderRelations(relations) {
  // Get a reference to the .list element in the HTML document
  const list = document.querySelector(".list");

  // Iterate over the relations and create a list item for each one
  relations.forEach((relation) => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.textContent = `${relation[0]}`;
    li.appendChild(span);
    li.appendChild(document.createTextNode(` - ${relation[1]}`));
    list.appendChild(li);
  });
}

// Render the relations
renderRelations(relations);