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

function render() {

    const term =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    let filtered = tags.filter(tag => {

        const matchesSearch =
            tag.tag.toLowerCase().includes(term);

        if(activeFilter === "review") {
            return matchesSearch && tag.note;
        }

        if(activeFilter === "all") {
            return matchesSearch;
        }

        return (
            matchesSearch &&
            tag.status === activeFilter
        );

    });

    drawStats(filtered);

    const strong =
        filtered.filter(
            x => x.status === "Strong Support"
        );

    const moderate =
        filtered.filter(
            x => x.status === "Moderate Support"
        );

    const limited =
        filtered.filter(
            x => x.status === "Limited Support"
        );

    const notSelected =
        filtered.filter(
            x => x.status === "Not Selected"
        );

    updateSectionCounts(
        strong.length,
        moderate.length,
        limited.length,
        notSelected.length
    );

    drawGroup(
        "strong-support",
        strong,
        "strong"
    );

    drawGroup(
        "moderate-support",
        moderate
