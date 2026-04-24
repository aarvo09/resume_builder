window.ResumePdf = (() => {
  const downloadBtn = document.getElementById("download-pdf");

  const makeFilename = () => {
    const state = window.ResumeAppState;
    const base = (state?.personal?.fullName || "resume")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${base || "resume"}.pdf`;
  };

  const download = async () => {
    const target = document.getElementById("resume-preview");
    const options = {
      margin: [8, 8, 8, 8],
      filename: makeFilename(),
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }
    };

    downloadBtn.disabled = true;
    downloadBtn.textContent = "Generating...";

    try {
      await html2pdf().set(options).from(target).save();
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = "Download PDF";
    }
  };

  const init = () => {
    downloadBtn.addEventListener("click", download);
  };

  return {
    init
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  window.ResumePdf.init();
});
