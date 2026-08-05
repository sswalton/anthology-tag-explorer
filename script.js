let tags = [];

fetch("tags.json")
.then(r => r.json())
.then(data => {
    tags = data;
    buildFilters();
    render();
});

function buildFilters() {

    const categories =
        [...new Set(tags.map(t => t.category))]
        .sort();

    const select =
        document.getElementById("categoryFilter");

    categories.forEach(cat => {
        const option =
            document.createElement("option");

        option.value = cat;
        option.textContent = cat;

        select.appendChild(option);
    });

    document
      .getElementById("search")
      .addEventListener("input", render);

    document
      .getElementById("categoryFilter")
      .addEventListener("change", render);

    document
      .getElementById("statusFilter")
      .addEventListener("change", render);
}

function render() {

    const search =
      document.getElementById("search")
      .value
      .toLowerCase();

    const category =
      document.getElementById("categoryFilter")
      .value;

    const status =
      document.getElementById("statusFilter")
      .value;

    const filtered = tags.filter(t => {

        const matchesSearch =
          t.tag.toLowerCase().includes(search);

        const matchesCategory =
          !category || t.category === category;

        const matchesStatus =
          !status || t.status === status;

        return matchesSearch
            && matchesCategory
            && matchesStatus;

    });

    drawCards(filtered);
}

function drawCards(list){

    const results =
      document.getElementById("results");

    results.innerHTML = "";

    list.forEach(tag => {

        const card =
            document.createElement("div");

        card.className = "card";

        let badgeClass = "notselected";

        if(tag.status === "Strong Support")
            badgeClass="strong";

        if(tag.status === "Moderate Support")
            badgeClass="moderate";

        if(tag.status === "Limited Support")
            badgeClass="limited";

        card.innerHTML = `
            <h3>${tag.tag}</h3>

            <span class="badge ${badgeClass}">
              ${tag.status}
            </span>

            <p>
              ${tag.category}<br>
              Votes: ${tag.count}
            </p>

            ${
              tag.note
              ? `<div class="note">${tag.note}</div>`
              : ""
            }
        `;

        results.appendChild(card);
    });

    document.getElementById("stats")
      .innerHTML =
      `<p><strong>${list.length}</strong> tags displayed</p>`;
}
