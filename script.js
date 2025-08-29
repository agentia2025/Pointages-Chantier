// URL de ton Apps Script déployé en exécution web
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxf76ztTCHjwL-RCV5OF7ulrKGcMNd2Nsu5XcDryxZVZnm7WEYsBMs6tz0J0bALkyuCdQ/exec";

// Charger la liste des machines
async function loadMachines() {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
    const data = await response.json();
    const select = document.getElementById("machine");
    select.innerHTML = '<option value="">Sélectionner une machine</option>';
    data.data.machines.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erreur machines:", err);
  }
}

// Gérer soumission du formulaire
document.getElementById("intervention-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.querySelector(".submit-btn");
  const submitText = document.getElementById("submit-text");
  const submitLoading = document.getElementById("submit-loading");
  const statusDiv = document.getElementById("status-message");

  submitBtn.disabled = true;
  submitText.style.display = "none";
  submitLoading.style.display = "inline-block";

  const formData = new FormData(e.target);
  const obj = {};
  formData.forEach((val, key) => obj[key] = val);

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "addPointage", data: obj }),
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result.success) {
      statusDiv.textContent = "✅ Intervention enregistrée avec succès";
      statusDiv.className = "status-message status-success";
      e.target.reset();
      document.getElementById("date").valueAsDate = new Date();
    } else {
      throw new Error(result.error || "Erreur inconnue");
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "❌ Erreur lors de l'enregistrement";
    statusDiv.className = "status-message status-error";
  } finally {
    submitBtn.disabled = false;
    submitText.style.display = "inline";
    submitLoading.style.display = "none";
  }
});

// Afficher le champ "autre" si nécessaire
document.getElementById("type-intervention").addEventListener("change", (e) => {
  const autre = document.getElementById("autre-intervention-group");
  autre.style.display = e.target.value === "autre" ? "block" : "none";
});

// Pré-remplir la date et charger machines au démarrage
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date").valueAsDate = new Date();
  loadMachines();
});
