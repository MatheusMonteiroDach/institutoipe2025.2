document.addEventListener("DOMContentLoaded", () => {
  const data = {
    d: Math.floor(Math.random() * 10 + 1),
    i: Math.floor(Math.random() * 10 + 1),
    s: Math.floor(Math.random() * 10 + 1),
    c: Math.floor(Math.random() * 10 + 1)
  };

  const valores = [data.d, data.i, data.s, data.c];
  const labels = ["Dominância", "Influência", "Estabilidade", "Conformidade"];
  const cores = ["#ff4444", "#ffbb33", "#33b5e5", "#aa66cc"];

  const configBase = {
    labels: labels,
    datasets: [{
      label: "Pontuação DISC",
      data: valores,
      backgroundColor: cores,
      borderColor: "#f5f5dc",
      borderWidth: 1
    }]
  };

  const opcoes = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#f5f5dc" }
      }
    },
    scales: {
      x: { ticks: { color: "#f5f5dc" } },
      y: { ticks: { color: "#f5f5dc" }, beginAtZero: true }
    }
  };

  new Chart(document.getElementById("graficoBarra"), {
    type: "bar",
    data: configBase,
    options: opcoes
  });

  new Chart(document.getElementById("graficoBarraHorizontal"), {
    type: "bar",
    data: configBase,
    options: {
      ...opcoes,
      indexAxis: 'y'
    }
  });

  new Chart(document.getElementById("graficoPizza"), {
    type: "pie",
    data: configBase,
    options: opcoes
  });

  new Chart(document.getElementById("graficoDoughnut"), {
    type: "doughnut",
    data: configBase,
    options: opcoes
  });

  new Chart(document.getElementById("graficoRadar"), {
    type: "radar",
    data: {
      labels: labels,
      datasets: [{
        label: "Perfil DISC",
        data: valores,
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        borderColor: "#ffd700",
        pointBackgroundColor: cores
      }]
    },
    options: {
      scales: {
        r: {
          pointLabels: { color: "#f5f5dc" },
          ticks: { color: "#f5f5dc", beginAtZero: true }
        }
      },
      plugins: {
        legend: { labels: { color: "#f5f5dc" } }
      }
    }
  });

  new Chart(document.getElementById("graficoLinha"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Pontuação DISC",
        data: valores,
        borderColor: "#ffd700",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        tension: 0.4
      }]
    },
    options: opcoes
  });

  new Chart(document.getElementById("graficoPolar"), {
    type: "polarArea",
    data: configBase,
    options: opcoes
  });

  new Chart(document.getElementById("graficoBubble"), {
    type: "bubble",
    data: {
      datasets: [{
        label: "DISC Bubble",
        data: [
          { x: 1, y: data.d, r: data.d + 3 },
          { x: 2, y: data.i, r: data.i + 3 },
          { x: 3, y: data.s, r: data.s + 3 },
          { x: 4, y: data.c, r: data.c + 3 }
        ],
        backgroundColor: cores
      }]
    },
    options: {
      scales: {
        x: { ticks: { color: "#f5f5dc" }, beginAtZero: true },
        y: { ticks: { color: "#f5f5dc" }, beginAtZero: true }
      },
      plugins: {
        legend: { labels: { color: "#f5f5dc" } }
      }
    }
  });

  // Resultado de texto
  const max = Math.max(data.d, data.i, data.s, data.c);
  let perfil = "";
  if (data.d === max) perfil = "D - Dominância";
  else if (data.i === max) perfil = "I - Influência";
  else if (data.s === max) perfil = "S - Estabilidade";
  else perfil = "C - Conformidade";

  document.getElementById("resultadoTexto").innerText = `Perfil dominante: ${perfil}`;




});
 function voltarInicio() 
 {
    window.location.href = "index.html"; // substitua pelo nome do seu arquivo da página inicial
  }