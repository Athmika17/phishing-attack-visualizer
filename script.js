const threatTypes = [
  { name: "Credential Theft", icon: "<i class='fas fa-key text-yellow-400'></i>" },
  { name: "Malware Injection", icon: "<i class='fas fa-bug text-red-400'></i>" },
  { name: "Link Spoofing", icon: "<i class='fas fa-link text-blue-400'></i>" },
  { name: "Business Email Compromise", icon: "<i class='fas fa-envelope text-green-400'></i>" },
];
const statuses = ["Blocked", "Investigating", "Allowed"];
const attackFeed = document.getElementById("attack-feed");

// Chart counts
const threatCounts = {
  "Credential Theft": 0,
  "Malware Injection": 0,
  "Link Spoofing": 0,
  "Business Email Compromise": 0,
};

// Chart.js
const ctx = document.getElementById("threatChart").getContext("2d");
const threatChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: Object.keys(threatCounts),
    datasets: [
      {
        data: Object.values(threatCounts),
        backgroundColor: ["#22c55e", "#eab308", "#3b82f6", "#ef4444"],
      },
    ],
  },
  options: {
    plugins: {
      legend: { labels: { color: "#fff" } },
    },
  },
});

// Random attack generator
function generateAttack() {
  const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const timestamp = new Date().toLocaleTimeString();
  const source_ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}`;
  const target_email = `user${Math.floor(Math.random() * 100)}@example.com`;

  return { timestamp, source_ip, target_email, threat, status };
}

// Render attack
function renderAttack(attack) {
  const placeholder = document.getElementById("placeholder");
  if (placeholder) placeholder.remove();

  const li = document.createElement("li");
  li.className =
    "p-4 rounded-xl flex justify-between items-center shadow bg-gray-700/70 border border-gray-600";

  // Status styles
  let statusClass = "bg-green-600";
  let statusIcon = "<i class='fas fa-shield-alt'></i>";
  if (attack.status === "Investigating") {
    statusClass = "bg-yellow-600";
    statusIcon = "<i class='fas fa-search'></i>";
  }
  if (attack.status === "Allowed") {
    statusClass = "bg-red-600";
    statusIcon = "<i class='fas fa-times-circle'></i>";
  }

  li.innerHTML = `
    <div>
      <p class="text-sm text-gray-400">${attack.timestamp}</p>
      <p class="font-semibold flex items-center gap-2">${attack.threat.icon} ${attack.threat.name}</p>
      <p class="text-xs text-gray-500">From: ${attack.source_ip} → ${attack.target_email}</p>
    </div>
    <span class="flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusClass}">
      ${statusIcon} ${attack.status}
    </span>
  `;

  attackFeed.prepend(li);

  // Update chart + animate pulse
  threatCounts[attack.threat.name]++;
  threatChart.data.datasets[0].data = Object.values(threatCounts);
  threatChart.update();

  const chartCanvas = document.getElementById("threatChart");
  chartCanvas.classList.add("scale-105");
  setTimeout(() => chartCanvas.classList.remove("scale-105"), 300);
}

// Push attacks
setInterval(() => {
  const attack = generateAttack();
  renderAttack(attack);
}, 2500);
