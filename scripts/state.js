window.ResumeState = (() => {
  const STORAGE_KEY = "resume-studio-data-v1";

  const getDefaultState = () => ({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: ""
    },
    summary: "",
    education: [
      { institution: "", degree: "", date: "", details: "" }
    ],
    experience: [
      { company: "", role: "", date: "", details: "" }
    ],
    projects: [
      { name: "", tech: "", date: "", details: "" }
    ],
    skills: "",
    template: "modern"
  });

  const safeParse = (raw) => {
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  };

  const load = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return getDefaultState();
    }

    const parsed = safeParse(saved);
    if (!parsed || typeof parsed !== "object") {
      return getDefaultState();
    }

    return {
      ...getDefaultState(),
      ...parsed,
      personal: {
        ...getDefaultState().personal,
        ...(parsed.personal || {})
      }
    };
  };

  const save = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    getDefaultState,
    load,
    save,
    clear
  };
})();
