let tags = [];
let activeFilter = "all";

fetch("tags.json")
.then(r => r.json())
.then(data => {
    tags = data;
    render();
});

document.addEventListener("click", e => {

    if(!e.target.classList.contains("filter-btn")) return;

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

function render(){

    const term =
        document.getElementById("search")
        .value
        .toLowerCase();

    let filtered = tags.filter(tag => {

        const matchesSearch =
            tag.tag.toLowerCase().includes(term);

        if(activeFilter === "review"){
            return matchesSearch && tag.note;
        }

        if(activeFilter === "all"){
            return matchesSearch;
        }

        return matchesSearch &&
               tag.status === activeFilter;
    });

    drawStats(filtered);

    drawGroup(
       "strong-support",
       filtered.filter(x => x.status === "Strong Support"),
       "strong"
    );

    drawGroup(
       "moderate-support",
       filtered.filter(x => x.status === "Moderate Support"),
       "moderate"
    );

    drawGroup(
       "limited-support",
       filtered.filter(x => x.status === "Limited Support"),
       "limited"
    );

    drawGroup(
       "not-selected",
       filtered.filter(x => x.status === "Not Selected"),
       "notselected"
    );
}

function drawStats(list){

    document.getElementById("summary").innerHTML = `
      <div class="stat">${list.length} visible tags</div>
    `;
}

function drawGroup(id,list,className){

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

            <div class="tooltip">
                <strong>${tag.tag}</strong><br>
                Category: ${tag.category}<br>
                Status: ${tag.status}<br>
                Votes: ${tag.count}
                ${
                    tag.note
                    ? `<hr>${tag.note}`
                    : ""
                }
            </div>
        `;

        container.appendChild(pill);
    });
}
