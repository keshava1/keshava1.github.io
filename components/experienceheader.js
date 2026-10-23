function renderExperienceHeader(companyName) {
  const container = document.getElementById("experience-header");
  if (!container || typeof EXPERIENCE === "undefined") return;
  const exp = EXPERIENCE.find(e => e.company === companyName);
  if (!exp) return;
  const image = exp.image
    ? `<img class="experience-logo" src="${exp.image}" alt="${exp.company} logo">` : "";
  const logo = image && exp.website
    ? `<a class="experience-logo-link" href="${exp.website}" target="_blank" rel="noopener" aria-label="Visit ${exp.company} website (opens in a new tab)">${image}</a>`
    : image;

  container.innerHTML = `
    <section>
      <div class="experience-header">
        <div>
          <h2>${exp.title}</h2>
          <p><strong>${exp.company}</strong></p>
          <p><i>${exp.date}</i></p>
        </div>
        ${logo}
      </div>
    </section>`;
}
