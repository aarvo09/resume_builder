window.ResumeTemplates = (() => {
  const stylesheet = document.getElementById("template-style");
  const selector = document.getElementById("template-selector");

  const cssByTemplate = {
    modern: "styles/template-modern.css",
    classic: "styles/template-classic.css",
    minimal: "styles/template-minimal.css"
  };

  const applyTemplate = (template) => {
    const state = window.ResumeAppState;
    const safeTemplate = cssByTemplate[template] ? template : "modern";
    stylesheet.href = cssByTemplate[safeTemplate];
    if (state) {
      state.template = safeTemplate;
      window.ResumeState.save(state);
      window.ResumePreview.render(state);
    } else if (window.ResumeState) {
      // In case state is not yet in AppState but we have state loader
      const loaded = window.ResumeState.load();
      loaded.template = safeTemplate;
      window.ResumeState.save(loaded);
      
      const resumePreview = document.getElementById("resume-preview");
      if (resumePreview) {
          resumePreview.className = `resume ${safeTemplate}-template`;
      }
    } else {
        // If state is not bound yet, update stylesheet anyway but also update preview class
        const resumePreview = document.getElementById("resume-preview");
        if (resumePreview) {
             // replace the old class
             const classes = Array.from(resumePreview.classList);
             const newClasses = classes.filter(c => !c.endsWith("-template"));
             newClasses.push(`${safeTemplate}-template`);
             resumePreview.className = newClasses.join(" ");
        }
    }
  };

  const init = () => {
    const savedTemplate = window.ResumeAppState?.template || selector.value;
    selector.value = savedTemplate;
    applyTemplate(savedTemplate);

    selector.addEventListener("change", (event) => {
      applyTemplate(event.target.value);
    });
  };

  return {
    init,
    applyTemplate
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  window.ResumeTemplates.init();
});
