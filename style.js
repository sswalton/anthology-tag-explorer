{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 let tags = [];\
let activeFilter = "all";\
\
fetch("tags.json")\
.then(response => response.json())\
.then(data => \{\
tags = data;\
render();\
\});\
\
document.addEventListener("click", event => \{\
if (!event.target.classList.contains("filter-btn")) \{\
return;\
\}\
\
document.querySelectorAll(".filter-btn").forEach(btn => \{\
btn.classList.remove("active");\
\});\
\
event.target.classList.add("active");\
activeFilter = event.target.dataset.filter;\
\
render();\
\});\
\
document\
.getElementById("search")\
.addEventListener("input", render);\
\
function render() \{\
const term = document\
.getElementById("search")\
.value\
.toLowerCase();\
\
const filtered = tags.filter(tag => \{\
const matchesSearch =\
tag.tag.toLowerCase().includes(term);\
\
if (activeFilter === "review") \{\
return matchesSearch && tag.note;\
\}\
\
if (activeFilter === "all") \{\
return matchesSearch;\
\}\
\
return (\
matchesSearch &&\
tag.status === activeFilter\
);\
\});\
\
const strong = filtered.filter(\
tag => tag.status === "Strong Support"\
);\
\
const moderate = filtered.filter(\
tag => tag.status === "Moderate Support"\
);\
\
const limited = filtered.filter(\
tag => tag.status === "Limited Support"\
);\
\
const notSelected = filtered.filter(\
tag => tag.status === "Not Selected"\
);\
\
updateHeadings(\
strong.length,\
moderate.length,\
limited.length,\
notSelected.length\
);\
\
updateSummary(filtered.length);\
\
drawGroup(\
"strong-support",\
strong,\
"strong"\
);\
\
drawGroup(\
"moderate-support",\
moderate,\
"moderate"\
);\
\
drawGroup(\
"limited-support",\
limited,\
"limited"\
);\
\
drawGroup(\
"not-selected",\
notSelected,\
"notselected"\
);\
\}\
\
function updateHeadings(\
strong,\
moderate,\
limited,\
notSelected\
) \{\
const headings =\
document.querySelectorAll(".group h2");\
\
if (headings.length < 4) return;\
\
headings[0].textContent =\
`Strong Support ($\{strong\})`;\
\
headings[1].textContent =\
`Moderate Support ($\{moderate\})`;\
\
headings[2].textContent =\
`Limited Support ($\{limited\})`;\
\
headings[3].textContent =\
`Not Selected ($\{notSelected\})`;\
\}\
\
function updateSummary(count) \{\
const summary =\
document.getElementById("summary");\
\
summary.innerHTML =\
`<div class="stat">$\{count\} visible tags</div>`;\
\}\
\
function drawGroup(\
containerId,\
data,\
colorClass\
) \{\
const container =\
document.getElementById(containerId);\
\
if (!container) return;\
\
container.innerHTML = "";\
\
data.forEach(tag => \{\
const pill =\
document.createElement("div");\
\
const reviewClass =\
tag.note ? "review" : "";\
\
const noteIcon =\
tag.note ? " \uc0\u9888 " : "";\
\
const noteHtml =\
tag.note\
? `\
<hr>\
<strong>Discussion Note:</strong><br>\
$\{tag.note\}\
`\
: "";\
\
pill.className =\
`pill $\{colorClass\} $\{reviewClass\}`;\
\
pill.innerHTML = `\
$\{tag.tag\} ($\{tag.count\})$\{noteIcon\}\
\
<div class="tooltip">\
<strong>$\{tag.tag\}</strong>\
<br><br>\
\
<strong>Category:</strong>\
$\{tag.category\}\
<br>\
\
<strong>Status:</strong>\
$\{tag.status\}\
\
$\{noteHtml\}\
</div>\
`;\
\
container.appendChild(pill);\
\});\
\}\
}
