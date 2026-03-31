document.addEventListener("DOMContentLoaded", () => {
  // Element selectors
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");
  const errorMsg = document.getElementById("errorMsg");
  const logoutBtn = document.getElementById("logoutBtn");

  const fileInput = document.querySelector("input[type='file']");
  const analyzeForm = document.querySelector(".upload-section form");
  const loader = document.getElementById("loader");
  const resultText = document.getElementById("resultText");
  const resultImg = document.getElementById("resultImg");
  const previewImg = document.getElementById("previewImg");

  // Utility Functions
  const clearError = () => (errorMsg.innerText = "");
  const toggleForms = (showLoginForm) => {
    loginForm.classList.toggle("hidden", !showLoginForm);
    registerForm.classList.toggle("hidden", showLoginForm);
    clearError();
  };

  // Switch Forms
  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(false);
  });

  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(true);
  });

  // Registration Logic
  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value.trim();

    if (!username || !password) {
      errorMsg.innerText = "⚠️ Please fill all fields.";
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("✅ Registration successful! Please login.");
    toggleForms(true);
  });

  // Login Logic
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");

    if (!username || !password) {
      errorMsg.innerText = "⚠️ Please enter username and password.";
    } else if (username === savedUsername && password === savedPassword) {
      window.location.href = "index.html";
    } else {
      errorMsg.innerText = "❌ Invalid username or password!";
    }
  });

  // Logout
  logoutBtn?.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // Preview MRI Image
  fileInput?.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  // Tumor Detection Form Submission
  analyzeForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) return alert("⚠️ Please upload an MRI scan.");

    const formData = new FormData();
    formData.append("file", file);

    loader.style.display = "block";
    resultText.textContent = "";
    if (resultImg) resultImg.style.display = "none";

    fetch("/predict", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((html) => {
        loader.style.display = "none";
        document.body.innerHTML = html; // Replace page with prediction result
      })
      .catch((err) => {
        loader.style.display = "none";
        alert("❌ Error predicting tumor. Please try again.");
        console.error("Prediction error:", err);
      });
  });

  // --- Confusion Matrix Section (Simulated Example) ---
  function showConfusionMatrix() {
    // Simulated confusion matrix data
    // Rows: Actual, Columns: Predicted
    const labels = ["Pituitary", "Glioma", "Meningioma", "No Tumor"];
    const matrix = [
      [8, 1, 0, 1],   // Actual Pituitary
      [0, 9, 1, 0],   // Actual Glioma
      [1, 0, 8, 1],   // Actual Meningioma
      [0, 0, 1, 9],   // Actual No Tumor
    ];

    // Create or select container
    let matrixContainer = document.getElementById("confusionMatrixContainer");
    if (!matrixContainer) {
      matrixContainer = document.createElement("div");
      matrixContainer.id = "confusionMatrixContainer";
      matrixContainer.style.margin = "2rem auto";
      matrixContainer.style.maxWidth = "500px";
      matrixContainer.style.background = "#fff";
      matrixContainer.style.borderRadius = "10px";
      matrixContainer.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
      matrixContainer.style.padding = "1rem";
      matrixContainer.innerHTML = `<h3>Confusion Matrix</h3><canvas id="confusionMatrixChart"></canvas>`;
      document.body.appendChild(matrixContainer);
    }

    // Draw confusion matrix as a heatmap using Chart.js
    const ctx = document.getElementById("confusionMatrixChart").getContext("2d");
    if (window.confMatrixChart) window.confMatrixChart.destroy();
    window.confMatrixChart = new Chart(ctx, {
      type: "matrix",
      data: {
        datasets: [{
          label: "Confusion Matrix",
          data: matrix.flatMap((row, i) =>
            row.map((value, j) => ({ x: j, y: i, v: value }))
          ),
          backgroundColor: function(ctx) {
            const value = ctx.dataset.data[ctx.dataIndex].v;
            // Color scale: low=white, high=blue
            return value > 7 ? "#3f51b5" : value > 3 ? "#7986cb" : "#e3e6f3";
          },
          width: ({chart}) => (chart.chartArea || {}).width / labels.length - 2,
          height: ({chart}) => (chart.chartArea || {}).height / labels.length - 2,
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                const item = items[0];
                return `Actual: ${labels[item.raw.y]}, Predicted: ${labels[item.raw.x]}`;
              },
              label: (item) => `Count: ${item.raw.v}`
            }
          }
        },
        scales: {
          x: {
            type: "category",
            labels: labels,
            title: { display: true, text: "Predicted" },
            grid: { display: false }
          },
          y: {
            type: "category",
            labels: labels,
            title: { display: true, text: "Actual" },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Load Chart.js Matrix plugin if not loaded
  function loadMatrixPluginAndShow() {
    if (Chart.registry.getPlugin('matrix')) {
      showConfusionMatrix();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@4.0.1/dist/chartjs-chart-matrix.min.js";
    script.onload = showConfusionMatrix;
    document.head.appendChild(script);
  }

  // Call this after prediction or page load as needed
  // Example: show confusion matrix after prediction
  // loadMatrixPluginAndShow();
});