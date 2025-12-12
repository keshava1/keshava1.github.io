function renderExperienceHeader(companyName) {
  const container = document.getElementById("experience-header");
  if(!container || typeof EXPERIENCE === "undefined") return;
  
  const exp = EXPERIENCE.find(e => e.company === companyName);
  const imagePath = exp.image
  ? exp.image
  : `/images/${exp.company.toLowerCase().replace(/\s+/g, "_")}.jpeg`;

  container.innerHTML = `
    <section>
    <div style="display: flex; align-items: center; gap: 20px;">
      <div>
        <h2>${exp.title}</h2>
        <p><strong>${exp.company}</strong></p>
        <p><i>${exp.date}</i></p>
      </div>
      <img
        src="${imagePath}"
        alt="${exp.company}"
        style="
          width: 150px;
          height: auto;
          border-radius: 6px;
          margin-left: auto;
        "
      />
      <br>
    </div>
  </section>
  `
}