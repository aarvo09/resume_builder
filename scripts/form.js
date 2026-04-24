window.ResumeForm = (() => {
  const state = window.ResumeState.load();

  const repeatConfigs = {
    education: {
      title: "Education",
      fields: [
        { key: "institution", label: "Institution" },
        { key: "degree", label: "Degree" },
        { key: "date", label: "Date" },
        { key: "details", label: "Details", textarea: true }
      ]
    },
    experience: {
      title: "Experience",
      fields: [
        { key: "company", label: "Company" },
        { key: "role", label: "Role" },
        { key: "date", label: "Date" },
        { key: "details", label: "Details", textarea: true }
      ]
    },
    projects: {
      title: "Project",
      fields: [
        { key: "name", label: "Project Name" },
        { key: "tech", label: "Tech Stack" },
        { key: "date", label: "Date" },
        { key: "details", label: "Details", textarea: true }
      ]
    }
  };

  let simpleFieldsBound = false;

  const getForm = () => document.getElementById("resume-form");

  const saveAndRender = () => {
    window.ResumeState.save(state);
    window.ResumePreview.render(state);
  };

  const bindSimpleFields = () => {
    if (simpleFieldsBound) {
      return;
    }

    const form = getForm();
    if (!form) return;

    const els = form.elements;
    if (els.fullName) els.fullName.value = state.personal.fullName || "";
    if (els.email) els.email.value = state.personal.email || "";
    if (els.phone) els.phone.value = state.personal.phone || "";
    if (els.location) els.location.value = state.personal.location || "";
    if (els.linkedin) els.linkedin.value = state.personal.linkedin || "";
    if (els.portfolio) els.portfolio.value = state.personal.portfolio || "";
    if (els.summary) els.summary.value = state.summary || "";
    if (els.skills) els.skills.value = state.skills || "";

    form.addEventListener("input", () => {
      state.personal.fullName = els.fullName ? els.fullName.value : "";
      state.personal.email = els.email ? els.email.value : "";
      state.personal.phone = els.phone ? els.phone.value : "";
      state.personal.location = els.location ? els.location.value : "";
      state.personal.linkedin = els.linkedin ? els.linkedin.value : "";
      state.personal.portfolio = els.portfolio ? els.portfolio.value : "";
      state.summary = els.summary ? els.summary.value : "";
      state.skills = els.skills ? els.skills.value : "";
      saveAndRender();
    });

    simpleFieldsBound = true;
  };

  const syncSimpleFieldsFromState = () => {
    const form = getForm();
    if (!form) return;
    const els = form.elements;
    if (els.fullName) els.fullName.value = state.personal.fullName || "";
    if (els.email) els.email.value = state.personal.email || "";
    if (els.phone) els.phone.value = state.personal.phone || "";
    if (els.location) els.location.value = state.personal.location || "";
    if (els.linkedin) els.linkedin.value = state.personal.linkedin || "";
    if (els.portfolio) els.portfolio.value = state.personal.portfolio || "";
    if (els.summary) els.summary.value = state.summary || "";
    if (els.skills) els.skills.value = state.skills || "";
  };

  const fieldControl = (item, key, label, textarea, onChange) => {
    if (textarea) {
      return `
        <label>${label}
          <textarea data-key="${key}" rows="3">${item[key] || ""}</textarea>
        </label>
      `;
    }

    return `
      <label>${label}
        <input data-key="${key}" type="text" value="${item[key] || ""}" />
      </label>
    `;
  };

  const renderRepeatList = (type) => {
    const target = document.getElementById(`${type}-list`);
    if (!target) return;
    const config = repeatConfigs[type];
    let items = state[type];
    if (!Array.isArray(items)) {
        items = [];
        state[type] = items;
    }

    target.innerHTML = items
      .map((item, index) => {
        const safeItem = item || {};
        return `
        <div class="repeat-item" data-index="${index}">
          <div class="repeat-item-head">
            <strong>${config.title} ${index + 1}</strong>
            <button type="button" class="remove-btn" data-remove="${type}" data-index="${index}">Remove</button>
          </div>
          ${config.fields
            .map((field) => fieldControl(safeItem, field.key, field.label, field.textarea))
            .join("")}
        </div>
      `})
      .join("");

    target.querySelectorAll("input, textarea").forEach((control) => {
      control.addEventListener("input", (event) => {
        const card = event.target.closest(".repeat-item");
        const itemIndex = Number(card.dataset.index);
        const key = event.target.dataset.key;
        if (!state[type][itemIndex]) {
           state[type][itemIndex] = {};
        }
        state[type][itemIndex][key] = event.target.value;
        saveAndRender();
      });
    });
  };

  const addRepeatItem = (type) => {
    const blank = {};
    repeatConfigs[type].fields.forEach((field) => {
      blank[field.key] = "";
    });
    if (!Array.isArray(state[type])) {
        state[type] = [];
    }
    state[type].push(blank);
    renderRepeatList(type);
    saveAndRender();
  };

  const setupRepeatButtons = () => {
    const addEdu = document.getElementById("add-education");
    if (addEdu) addEdu.addEventListener("click", () => addRepeatItem("education"));
    
    const addExp = document.getElementById("add-experience");
    if (addExp) addExp.addEventListener("click", () => addRepeatItem("experience"));
    
    const addProj = document.getElementById("add-project");
    if (addProj) addProj.addEventListener("click", () => addRepeatItem("projects"));

    document.body.addEventListener("click", (event) => {
      const button = event.target.closest(".remove-btn");
      if (!button) {
        return;
      }

      const type = button.dataset.remove;
      const index = Number(button.dataset.index);
      if (!Array.isArray(state[type]) || state[type].length <= 1) {
        return;
      }

      state[type].splice(index, 1);
      renderRepeatList(type);
      saveAndRender();
    });
  };

  const setupReset = () => {
    const resetBtn = document.getElementById("reset-btn");
    if (!resetBtn) return;
    
    resetBtn.addEventListener("click", () => {
      const fresh = window.ResumeState.getDefaultState();
      Object.keys(state).forEach((key) => {
        state[key] = fresh[key];
      });
      window.ResumeState.clear();
      syncSimpleFieldsFromState();
      renderRepeatList("education");
      renderRepeatList("experience");
      renderRepeatList("projects");
      const templateSelector = document.getElementById("template-selector");
      if (templateSelector) {
          templateSelector.value = state.template || "modern";
      }
      saveAndRender();
    });
  };

  const bindAll = () => {
    bindSimpleFields();
    renderRepeatList("education");
    renderRepeatList("experience");
    renderRepeatList("projects");
    const templateSelector = document.getElementById("template-selector");
    if (templateSelector) {
        templateSelector.value = state.template || "modern";
    }
  };

  const init = () => {
    try {
        bindAll();
        setupRepeatButtons();
        setupReset();
        window.ResumePreview.render(state);
        window.ResumeState.save(state);
        window.ResumeAppState = state;
    } catch (e) {
        console.error("Failed to initialize resume form: ", e);
    }
  };

  return {
    init
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  window.ResumeForm.init();
});
