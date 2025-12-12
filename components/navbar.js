fetch("/components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
    renderMenuProjects();
    renderMenuExperience();
  })

function renderMenuProjects() {
  const menuList = document.getElementById("menu-projects");
  if(!menuList || typeof PROJECTS === 'undefined') {
    return;
  }

  menuList.innerHTML = "";
  PROJECTS.forEach(p => {
    if(!p.link) return;
    const li = document.createElement("li");
    li.setAttribute("role", "menu-item");
    li.innerHTML = `<a href="${p.link}" target="_blank">
      <strong>${p.name}<strong><br>
      <span style="font-size: 0.85em; color: gray;">${p.year}</span>
    </a>`;
    menuList.appendChild(li);
  });
}

function renderMenuExperience() {
  const expList = document.getElementById("menu-experience");
  if(!expList || typeof EXPERIENCE === 'undefined') {
    return;
  }

  expList.innerHTML = "";
  EXPERIENCE.forEach(e => {
    if (!e.link) return;
    const li = document.createElement("li");
    li.setAttribute("role", "menu-item");
    li.innerHTML = `<a href="${e.link}">
      <strong>${e.company}</strong><br>
      <span style="font-size: 0.85em; color: gray;">${e.title}</span>
    </a>`;
    expList.appendChild(li);
  });
}