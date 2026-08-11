let tags = [];
let activeFilter = "all";
let currentView = "tags";

const similarTerms = [

  "Religion",
  "Religion?",

  "Photography",
  "photographs",

  "Diary",
  "Diary/Journal",
  "Diary/Journals",
  "Journal",

  "Correspondence",
  "Letter or Correspondence",
  "Letters",

  "Race",
  "Race & Ethnicity",

  "Gender/Sexuality",
  "Gender & Sexuality",
  "Gender and Sexuality",
  "Sexuality",

  "Family",
  "Family/Community",

  "School",
  "Schoolwork / educational material"

];

fetch("tags.json")
  .then(response => response.json())
  .then(data => {
    tags = data;
    render();
  });

document
  .getElementById("search")
  .addEventListener("input", render);

document
  .getElementById("tag-view-btn")
  .addEventListener("click", () => {

    currentView = "tags";

    document
      .getElementById("tag-view-btn")
      .classList.add("active-view");

    document
      .getElementById("list-view-btn")
      .classList.remove("active-view");

    render();
  });

document
  .getElementById("list-view-btn")
  .addEventListener("click", () => {

    currentView = "list";

    document
      .getElementById("list-view-btn")
      .classList.add("active-view");

    document
      .getElementById("tag-view-btn")
      .classList.remove("active-view");

    render();
  });

document.addEventListener("click", event => {

  if (!event.target.dataset.filter) {
    return;
  }

  document
    .querySelectorAll(".filter-btn[data-filter]")
    .forEach(btn => btn.classList.remove("active"));

  event.target.classList.add("active");

  activeFilter = event.target.dataset.filter;

  render();

});

function render() {

  const term =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  const filtered = tags.filter(tag => {

    const matchesSearch =
      tag.tag.toLowerCase().includes(term);

    if (activeFilter === "review") {
      return matchesSearch && tag.note;
    }

    if (activeFilter === "similar") {
      return (
        matchesSearch &&
        similarTerms.includes(tag.tag)
      );
    }

    if (activeFilter === "all") {
      return matchesSearch;
    }

    return (
      matchesSearch &&
      tag.status === activeFilter
    );

  });

  const strong =
    filtered.filter(
      tag => tag.status === "Strong Support"
    );

  const moderate =
    filtered.filter(
      tag => tag.status === "Moderate Support"
    );

  const limited =
    filtered.filter(
      tag => tag.status === "Limited Support"
    );

  const notSelected =
    filtered.filter(
      tag => tag.status === "Not Selected"
    );

  updateHeadings(
    strong.length,
    moderate.length,
    limited.length,
    notSelected.length
  );

  document.getElementById("summary").innerHTML =
    `<div class="stat">${filtered.length} visible tags</div>`;

  drawGroup("strong-support", strong, "strong");
  drawGroup("moderate-support", moderate, "moderate");
  drawGroup("limited-support", limited, "limited");
  drawGroup("not-selected", notSelected, "notselected");
}

function updateHeadings(
  strong,
  moderate,
  limited,
  notSelected
) {

  const headers =
    document.querySelectorAll(".group h2");

  if (headers.length < 4) {
    return;
  }

  headers[0].textContent =
    `Strong Support (${strong})`;

  headers[1].textContent =
    `Moderate Support (${moderate})`;

  headers[2].textContent =
    `Limited Support (${limited})`;

  headers[3].textContent =
    `Not Selected (${notSelected})`;
}

function drawGroup(
  containerId,
  data,
  colorClass
) {

  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (currentView === "list") {

    data.forEach(tag => {

      const row =
        document.createElement("div");

      row.className = "list-row";

      const termClass =
        similarTerms.includes(tag.tag)
          ? "similar-text"
          : "";

      row.innerHTML = `
        <span class="${termClass}">
          ${tag.tag}${tag.note ? " ⚠" : ""}
        </span>

        <span>${tag.count}</span>
      `;

      container.appendChild(row);

    });

    return;
  }

  data.forEach(tag => {

    const pill =
      document.createElement("div");

    const similarClass =
      similarTerms.includes(tag.tag)
        ? "similar-outline"
        : "";

    pill.className =
      `pill ${colorClass} ${tag.note ? "review" : ""} ${similarClass}`;

    const noteSection =
      tag.note
        ? `
          <hr>
          <strong>Discussion Note:</strong><br>
          ${tag.note}
        `
        : "";

    pill.innerHTML = `
      ${tag.tag} (${tag.count})${tag.note ? " ⚠" : ""}

      <div class="tooltip">
        <strong>${tag.tag}</strong>
        <br><br>

        <strong>Category:</strong>
        ${tag.category}
        <br>

        <strong>Status:</strong>
        ${tag.status}

        ${noteSection}
      </div>
    `;

    container.appendChild(pill);

  });
}
