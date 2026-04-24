window.ResumePreview = (() => {
  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const detailsToBulletList = (text) => {
    const str = String(text || "");
    if (!str.trim()) {
      return "";
    }

    const items = str
      .split(/\n|•|-/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => `<li>${escapeHtml(part)}</li>`)
      .join("");

    return items ? `<ul>${items}</ul>` : "";
  };

  const contactLine = (personal) => {
    const safePersonal = personal || {};
    const pieces = [
      safePersonal.email,
      safePersonal.phone,
      safePersonal.location,
      safePersonal.linkedin,
      safePersonal.portfolio
    ].filter((item) => String(item || "").trim());

    return pieces.length ? escapeHtml(pieces.join(" | ")) : "";
  };

  const sectionFromItems = (title, items, renderRow) => {
    let safeItems = items;
    if (!Array.isArray(items)) {
        safeItems = [];
    }
    const nonEmpty = safeItems.filter((item) => item && Object.values(item).some((value) => String(value || "").trim()));

    if (!nonEmpty.length) {
      return "";
    }

    return `
      <section>
        <h3 class="section-title">${escapeHtml(title)}</h3>
        ${nonEmpty.map(renderRow).join("")}
      </section>
    `;
  };

  const render = (state) => {
    const resume = document.getElementById("resume-preview");
    const safePersonal = state.personal || {};

    const education = sectionFromItems("Education", state.education, (item) => `
      <article>
        <div class="item-title-row">
          <strong>${escapeHtml(item.degree || "Degree")}</strong>
          <span class="muted">${escapeHtml(item.date)}</span>
        </div>
        <div class="muted">${escapeHtml(item.institution)}</div>
        ${detailsToBulletList(item.details)}
      </article>
    `);

    const experience = sectionFromItems("Experience", state.experience, (item) => `
      <article>
        <div class="item-title-row">
          <strong>${escapeHtml(item.role || "Role")}</strong>
          <span class="muted">${escapeHtml(item.date)}</span>
        </div>
        <div class="muted">${escapeHtml(item.company)}</div>
        ${detailsToBulletList(item.details)}
      </article>
    `);

    const projects = sectionFromItems("Projects", state.projects, (item) => `
      <article>
        <div class="item-title-row">
          <strong>${escapeHtml(item.name || "Project")}</strong>
          <span class="muted">${escapeHtml(item.date)}</span>
        </div>
        <div class="muted">${escapeHtml(item.tech)}</div>
        ${detailsToBulletList(item.details)}
      </article>
    `);

    const skills = String(state.skills || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .join(" • ");

    const summary = String(state.summary || "").trim()
      ? `<section><h3 class="section-title">Summary</h3><p>${escapeHtml(state.summary)}</p></section>`
      : "";

    const skillsSection = skills
      ? `<section><h3 class="section-title">Skills</h3><p>${escapeHtml(skills)}</p></section>`
      : "";

    resume.className = `resume ${state.template || "modern"}-template`;

    resume.innerHTML = `
      <header class="resume-header">
        <h1>${escapeHtml(safePersonal.fullName || "Your Name")}</h1>
        <div class="contact-line">${contactLine(safePersonal)}</div>
      </header>
      ${summary || '<p class="empty-note">Add a summary to build your resume.</p>'}
      ${experience}
      ${education}
      ${projects}
      ${skillsSection}
    `;
  };

  return {
    render
  };
})();
