const post = async (endpoint, data) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.status === 403) {
    window.location.href = "/logout";
    return;
  }
  return response;
};

const toastIcons = {
  success: '<path d="M5 13l4 4L19 7"/>',
  danger: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  info: '<path d="M12 4v10m0 0-3.5-3.5M12 14l3.5-3.5"/><path d="M5 18h14"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
};

const toastMessage = (kind, message, icon = kind) => {
  const stack = document.querySelector("#toast-stack");
  const toast = document.createElement("div");
  toast.className = `toast ${kind}`;
  toast.innerHTML = `
    <svg class="icon-stroke" viewBox="0 0 24 24">${toastIcons[icon]}</svg>
    <div class="msg">${message}</div>
    <button class="toast-close" aria-label="Dismiss">
      <svg class="icon-stroke" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>`;
  stack.appendChild(toast);

  const remove = () => toast.remove();
  const timeout = setTimeout(remove, 30_000);
  toast.querySelector(".toast-close").onclick = () => {
    clearTimeout(timeout);
    remove();
  };
};

const actionButtons = () => `
  <div class="action-group">
    <span class="tip" data-tip="Restore this backup">
      <button class="icon-btn res" aria-label="Restore">
        <svg class="icon-stroke" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
      </button>
    </span>
    <span class="tip" data-tip="Download .sql">
      <button class="icon-btn down sql" aria-label="Download SQL">
        <svg class="icon-stroke" viewBox="0 0 24 24"><path d="M12 4v10m0 0-3.5-3.5M12 14l3.5-3.5"/><path d="M5 18h14"/></svg>
      </button>
    </span>
    <span class="tip" data-tip="Download .dump">
      <button class="icon-btn down dump" aria-label="Download dump">
        <svg class="icon-stroke" viewBox="0 0 24 24"><path d="M12 4v10m0 0-3.5-3.5M12 14l3.5-3.5"/><path d="M5 18h14"/><path d="M8 21h8" stroke-dasharray="1 3"/></svg>
      </button>
    </span>
    <span class="tip" data-tip="Delete backup">
      <button class="icon-btn danger del" aria-label="Delete">
        <svg class="icon-stroke" viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/></svg>
      </button>
    </span>
  </div>`;

const setRowBusy = (row, kind, label) => {
  const actionsCell = row.querySelector("td.actions");
  row.dataset.actionsHtml = actionsCell.innerHTML;
  row.classList.add("row-busy", kind);
  actionsCell.innerHTML = `<span class="busy-label"><span class="spinner"></span>${label}</span>`;
};

const clearRowBusy = (row, kind) => {
  const actionsCell = row.querySelector("td.actions");
  row.classList.remove("row-busy", kind);
  actionsCell.innerHTML = row.dataset.actionsHtml || actionButtons();
  delete row.dataset.actionsHtml;
};

const setButtonBusy = (button) => {
  button.dataset.originalHtml = button.innerHTML;
  button.innerHTML = '<span class="spinner"></span>';
  button.classList.add("busy");
};

const clearButtonBusy = (button) => {
  button.innerHTML = button.dataset.originalHtml;
  button.classList.remove("busy");
  delete button.dataset.originalHtml;
};

/* ---------- new backup ---------- */

const tableSkeleton = (name) => `
  <table class="backups" id="table-${name}">
    <thead>
      <tr><th>Backup</th><th>Created</th><th class="num">Size</th><th class="actions-col">Actions</th></tr>
    </thead>
    <tbody></tbody>
  </table>`;

const getOrCreateTableBody = (name) => {
  let table = document.getElementById(`table-${name}`);
  if (!table) {
    const content = document.getElementById(name).querySelector(".content");
    content.querySelector(".empty-state")?.remove();
    content.insertAdjacentHTML("afterbegin", tableSkeleton(name));
    table = document.getElementById(`table-${name}`);
  }
  return table.querySelector("tbody");
};

const handleNew = async (button) => {
  const name = button.dataset.db;
  button.disabled = true;

  const response = await post("/api/new", { name });
  const { filename } = await response.json();
  button.disabled = false;

  if (!filename) {
    toastMessage("danger", "Error, unable to create new backup");
    return;
  }

  const tbody = getOrCreateTableBody(name);
  const row = document.createElement("tr");
  row.id = `${name}/${filename}`;
  row.className = "row-busy creating";
  row.innerHTML = `
    <td><span class="busy-label"><span class="spinner"></span>Creating backup of ${name}…</span></td>
    <td class="fdate">just now</td>
    <td class="num fsize tabular">—</td>
    <td class="actions"></td>`;
  tbody.prepend(row);

  const checkBackup = async () => {
    const response = await post("/api/check", { path: row.id });
    const { ready, ...file } = await response.json();
    if (ready) {
      row.className = "";
      row.innerHTML = `
        <td><span class="fname">${file.name}</span></td>
        <td class="fdate">${file.date}</td>
        <td class="num fsize tabular">${file.size}</td>
        <td class="actions">${actionButtons()}</td>`;
      toastMessage("success", `${name} backed up as ${file.name}`);
    } else {
      setTimeout(checkBackup, 3_000);
    }
  };

  setTimeout(checkBackup, 5_000);
};

/* ---------- download ---------- */

const handleDownload = async (button) => {
  const row = button.closest("tr");
  const format = button.classList.contains("sql") ? "sql" : "dump";
  const group = row.querySelector(".action-group");
  const buttons = [...group.querySelectorAll("button")];

  buttons.forEach((b) => (b.disabled = true));
  setButtonBusy(button);

  const response = await post("/api/download", { path: row.id, format });
  const blob = await response.blob();

  const anchor = document.createElement("a");
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = row.id.split("/")[1].replace(/\.lzo$/, `.${format}`);
  anchor.click();
  window.URL.revokeObjectURL(anchor.href);

  toastMessage("info", `${anchor.download} downloaded`);

  clearButtonBusy(button);
  buttons.forEach((b) => (b.disabled = false));
};

/* ---------- restore (confirm dialog) ---------- */

const restoreModal = document.querySelector("#restore-modal");
const restoreInput = document.querySelector("#restore-confirm-input");
const restoreConfirmBtn = document.querySelector("#restore-confirm");
let pendingRestore = null;
let restoreInProgress = false;

const openRestoreModal = (row) => {
  const [dbName, fileName] = row.id.split("/");
  pendingRestore = { row, dbName };
  restoreModal
    .querySelectorAll(".restore-db-name")
    .forEach((el) => (el.textContent = dbName));
  document.querySelector("#restore-file-name").textContent = fileName;
  restoreInput.value = "";
  restoreConfirmBtn.disabled = true;
  restoreModal.hidden = false;
  restoreInput.focus();
};

const closeRestoreModal = () => {
  restoreModal.hidden = true;
  pendingRestore = null;
};

restoreInput.addEventListener("input", () => {
  restoreConfirmBtn.disabled =
    !pendingRestore || restoreInput.value !== pendingRestore.dbName;
});

document.querySelector("#restore-cancel").onclick = closeRestoreModal;
restoreModal.addEventListener("click", (e) => {
  if (e.target === restoreModal) closeRestoreModal();
});

restoreConfirmBtn.onclick = async () => {
  if (!pendingRestore || restoreConfirmBtn.disabled) return;

  if (restoreInProgress) {
    closeRestoreModal();
    return toastMessage(
      "danger",
      `Restore of ${restoreInProgress} already in progress, please wait`
    );
  }

  const { row, dbName } = pendingRestore;
  const fileName = row.id.split("/")[1];
  closeRestoreModal();

  restoreInProgress = dbName;
  setRowBusy(row, "restoring", `Restoring to ${dbName}…`);

  const response = await post("/api/restore", { path: row.id, decompress: true });
  const { done } = await response.json();

  restoreInProgress = false;
  clearRowBusy(row, "restoring");

  if (done) {
    toastMessage("success", `${dbName} restored from ${fileName}`);
  } else {
    toastMessage("danger", `Restore of ${dbName} failed`);
  }
};

/* ---------- delete (confirm dialog) ---------- */

const deleteModal = document.querySelector("#delete-modal");
const deleteConfirmBtn = document.querySelector("#delete-confirm");
let pendingDelete = null;

const openDeleteModal = (row) => {
  pendingDelete = row;
  document.querySelector("#delete-file-name").textContent = row.id.split("/")[1];
  deleteModal.hidden = false;
};

const closeDeleteModal = () => {
  deleteModal.hidden = true;
  pendingDelete = null;
};

document.querySelector("#delete-cancel").onclick = closeDeleteModal;
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

deleteConfirmBtn.onclick = async () => {
  if (!pendingDelete) return;
  const row = pendingDelete;
  const fileName = row.id.split("/")[1];
  closeDeleteModal();

  row.classList.add("row-busy");
  row.querySelectorAll("button").forEach((b) => (b.disabled = true));

  const response = await post("/api/remove", { path: row.id });
  const { ok } = await response.json();

  if (ok) {
    row.remove();
    toastMessage("danger", `${fileName} deleted`, "trash");
  } else {
    row.classList.remove("row-busy");
    row.querySelectorAll("button").forEach((b) => (b.disabled = false));
    toastMessage("danger", "Error while removing backup");
  }
};

/* ---------- sign out (confirm dialog) ---------- */

const signoutModal = document.querySelector("#signout-modal");

const openSignoutModal = () => {
  signoutModal.hidden = false;
};

const closeSignoutModal = () => {
  signoutModal.hidden = true;
};

document.querySelector("#signout-cancel").onclick = closeSignoutModal;
signoutModal.addEventListener("click", (e) => {
  if (e.target === signoutModal) closeSignoutModal();
});
document.querySelector("#signout-confirm").onclick = () => {
  window.location.href = "/logout";
};

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!restoreModal.hidden) closeRestoreModal();
  if (!deleteModal.hidden) closeDeleteModal();
  if (!signoutModal.hidden) closeSignoutModal();
});

/* ---------- delegated action clicks ---------- */

document.addEventListener("click", (e) => {
  const newBtn = e.target.closest("button.new");
  if (newBtn) return handleNew(newBtn);

  const resBtn = e.target.closest("button.res");
  if (resBtn) return openRestoreModal(resBtn.closest("tr"));

  const downBtn = e.target.closest("button.down");
  if (downBtn) return handleDownload(downBtn);

  const delBtn = e.target.closest("button.del");
  if (delBtn) return openDeleteModal(delBtn.closest("tr"));
});

document.querySelector("#logout").addEventListener("click", (e) => {
  e.preventDefault();
  openSignoutModal();
});

/* ---------- sidebar navigation ---------- */

const handleNavigation = () => {
  const hashName = decodeURIComponent(window.location.hash.substring(1));
  const items = [...document.querySelectorAll(".db-item")];
  const link =
    document.getElementById(`link-${hashName}`) || items[0]?.querySelector("a");

  document.querySelectorAll(".db-panel").forEach((panel) => {
    panel.hidden = true;
  });

  if (!link) {
    const fallback = document.getElementById("__empty");
    if (fallback) fallback.hidden = false;
    return;
  }

  const currentName = link.id.replace(/^link-/, "");
  items.forEach((item) => item.classList.remove("active"));
  link.closest(".db-item").classList.add("active");

  const activePanel = document.getElementById(currentName);
  if (activePanel) activePanel.hidden = false;
};

handleNavigation();
window.addEventListener("hashchange", handleNavigation, false);
