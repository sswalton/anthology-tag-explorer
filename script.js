let tags = [];
let activeFilter = "all";

fetch("tags.json")
  .then(r => r.json())
  .then(data => {
    tags = data;
    render();
  });

document.addEventListener("click", e => {
  if (!e.target.classList.contains("filter-btn")) return;

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));

  e.target.classList.add("active");
  activeFilter = e.target.dataset.filter;

  render();
});

document
  .getElementById("search")
  .addEventListener("input", render);

function render() {

  const term =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  let filtered = tags.filter(tag => {

    const matchesSearch =
      tag.tag.toLowerCase().includes(term);

    if (activeFilter === "review") {
      return matchesSearch && tag.note;
    }

    if (activeFilter === "all") {
      return matchesSearch;
    }

    return (
      matchesSearch &&
      tag.status === activeFilter
    );
  });

  drawStats(filtered);

  const strong =
    filtered.filter(x => x.status === "Strong Support");

  const moderate =
    filtered.filter(x => x.status === "Moderate Support");

  const limited =
    filtered.filter(x => x.status === "Limited Support");

  const notSelected =
    filtered.filter(x => x.status === "Not Selected");

  drawGroup(
    "strong-support",
    strong,
    "strong"
  );

  drawGroup(
    "moderate-support",
    moderate,
    "moderate"
  );

  drawGroup(
    "limited-support",
    limited,
    "limited"
  );

  drawGroup(
    "not-selected",
    notSelected,
    "notselected"
  );

  updateHeadings(
    strong.length,
    moderate.length,
    limited.length,
    notSelected.length
  );
}

function updateHeadings(
  strong,
  moderate,
  limited,
  notSelected
) {

  const headers =
    document.querySelectorAll(".group h2");

  if (headers.length < 4) return;

  headers[0].textContent =
    `Strong Support (${strong})`;

  headers[1].textContent =
    `Moderate Support (${moderate})`;

  headers[2].textContent =
    `Limited Support (${limited})`;

  headers[3].textContent =
    `Not Selected (${notSelected})`;
}

function drawStats(list) {

  document.getElementById("summary").innerHTML = `
    <div class="stat">
      ${list.length} visible tags
    </div>
  `;
}

function drawGroup(
  id,
  list,
  className
) {

  const container =
    document.getElementById(id);

  container.innerHTML = "";

  list.forEach(tag => {

    const pill =
      document.createElement("div");

    pill.className =
      `pill ${className} ${tag.note ? "review" : ""}`;

    pill.innerHTML = `
      ${tag.tag} (${tag.count})
      ${tag.note ? " ⚠" : ""}

      <div class="tooltip">
        <strong>${tag.tag}</strong>
        <br><br>

        <strong>Category:</strong>
        ${tag.category}
        <br>

        <strong>Status:</strong>
        ${tag.status}

        ${
          tag.note
            ? `
              <hr>
              <strong>Discussion Note:</strong>
              <br>
              ${tag.note}
            `
            : ""
        }
      </div>
    `;

    container.appendChild(pill);
  });
}
