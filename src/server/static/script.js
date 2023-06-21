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

let toastTimeout;

const toastMessage = (message, color) => {
  toastTimeout && clearTimeout(toastTimeout);

  const wrapper = document.querySelector("#toast");
  wrapper.innerHTML = `<div class="container"><p>${message}</p></div>`;
  wrapper.className = `bg-${color}`;

  toastTimeout = setTimeout(() => {
    wrapper.innerHTML = "";
    wrapper.className = "";
  }, 30_000);

  wrapper.onclick = () => {
    clearTimeout(toastTimeout);
    wrapper.innerHTML = "";
    wrapper.className = "";
  };
};

const buttons = `
  <button class="btn btn-sm btn-primary res">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database-fill-up" viewBox="0 0 16 16"><path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0ZM8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1Z"/><path d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12.31 12.31 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7Zm6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.552 4.552 0 0 1 .23-2.002Zm-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.507 4.507 0 0 1-1.3-1.905Z"/></svg>
  </button>
  <button class="btn btn-sm btn-secondary down sql">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-sql" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM0 14.841a1.129 1.129 0 0 0 .401.823c.13.108.288.192.478.252s.411.091.665.091c.338 0 .624-.053.858-.158.237-.106.416-.252.54-.44a1.17 1.17 0 0 0 .187-.656c0-.224-.045-.41-.135-.56a1 1 0 0 0-.375-.357 2.027 2.027 0 0 0-.565-.21l-.621-.144a.97.97 0 0 1-.405-.176.369.369 0 0 1-.143-.299c0-.156.061-.284.184-.384.125-.101.296-.152.513-.152.143 0 .266.022.37.068a.624.624 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.199-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.552.05-.776.15-.225.099-.4.24-.528.421-.127.182-.19.395-.19.639 0 .201.04.376.123.524.082.149.199.27.351.367.153.095.332.167.54.213l.618.144c.207.049.36.113.462.193a.387.387 0 0 1 .153.325c0 .11-.029.207-.085.29A.558.558 0 0 1 2 15.31c-.111.047-.249.07-.413.07-.117 0-.224-.013-.32-.04a.835.835 0 0 1-.248-.115.579.579 0 0 1-.255-.384H0Zm6.878 1.489-.507-.739c.176-.162.31-.362.401-.6.092-.239.138-.507.138-.806v-.501c0-.371-.07-.693-.208-.967a1.495 1.495 0 0 0-.589-.636c-.256-.15-.561-.225-.917-.225-.351 0-.656.075-.914.225-.256.149-.453.36-.592.636a2.138 2.138 0 0 0-.205.967v.5c0 .37.069.691.205.965.139.273.336.485.592.636a1.8 1.8 0 0 0 .914.222 1.8 1.8 0 0 0 .6-.1l.294.422h.788ZM4.262 14.2v-.522c0-.246.038-.456.114-.63a.91.91 0 0 1 .325-.398.885.885 0 0 1 .495-.138c.192 0 .357.046.495.138a.88.88 0 0 1 .325.398c.077.174.115.384.115.63v.522c0 .164-.018.312-.053.445-.035.13-.087.244-.155.34l-.106-.14-.105-.147h-.733l.451.65a.638.638 0 0 1-.251.047.872.872 0 0 1-.487-.147.916.916 0 0 1-.32-.404 1.67 1.67 0 0 1-.11-.644Zm3.986 1.057h1.696v.674H7.457v-3.999h.79v3.325Z"/></svg>
  </button>
  <button class="btn btn-sm btn-secondary down dump">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-zip-fill" viewBox="0 0 16 16"><path d="M8.5 9.438V8.5h-1v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.93-.62-.4-1.598a1 1 0 0 1-.03-.243z"/><path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm2.5 8.5v.938l-.4 1.599a1 1 0 0 0 .416 1.074l.93.62a1 1 0 0 0 1.109 0l.93-.62a1 1 0 0 0 .415-1.074l-.4-1.599V8.5a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1zm1-5.5h-1v1h1v1h-1v1h1v1H9V6H8V5h1V4H8V3h1V2H8V1H6.5v1h1v1z"/></svg>
  </button>
  <button class="btn btn-sm btn-danger del">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon-fill" viewBox="0 0 16 16"><path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/></svg>
  </button>`;

let restoreInProgress = false;

const initResButton = (button) => {
  const row = button.parentNode.parentNode;
  if (row) {
    button.onclick = async () => {
      if (restoreInProgress) {
        return toastMessage(
          `Restore of database ${restoreInProgress} in progress, please wait`,
          "danger"
        );
      }
      const filename = row.id;
      const [dbName, file] = filename.split("/");
      if (
        prompt(
          `Restore backup?\n\nThis will restore your database ${dbName} to backup ${file}.\n\nType database name (${dbName}) to confirm:`
        ) === dbName
      ) {
        restoreInProgress = dbName;
        row.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
        row.classList.add("table-success");
        row.classList.add("wait");

        const response = await post("/api/restore", {
          path: filename,
          decompress: true,
        });
        const { done } = await response.json();

        if (done) {
          toastMessage(
            `Database ${dbName} restored successfully to backup ${file}`,
            "success"
          );
        } else {
          toastMessage(`Database ${dbName} restore failed`, "danger");
        }

        restoreInProgress = false;
        row.classList.remove("table-success");
        row.classList.remove("wait");
        row.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
      }
    };
  }
};

const initDownButton = (button) => {
  const row = button.parentNode.parentNode;
  if (row) {
    button.onclick = async () => {
      const format = button.className.includes("sql") ? "sql" : "dump";
      row.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
      row.classList.add("table-info");
      row.classList.add("wait");
      const filename = row.id;
      const response = await post("/api/download", {
        path: filename,
        format,
      });
      const blob = await response.blob();

      const anchor = document.createElement("a");
      anchor.href = window.URL.createObjectURL(blob);
      anchor.download = filename.replace(/\.lzo$/, `.${format}`);
      anchor.click();
      window.URL.revokeObjectURL(anchor.href);

      toastMessage(`Download of backup ${anchor.download} successful`, "info");

      row.classList.remove("table-info");
      row.classList.remove("wait");
      row.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
    };
  }
};

const initDelButton = (button) => {
  const row = button.parentNode.parentNode;
  if (row) {
    button.onclick = async () => {
      if (confirm("Are you sure you want to delete this backup?")) {
        row.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
        row.classList.add("table-danger");
        row.classList.add("wait");
        const response = await post("/api/remove", { path: row.id });
        const { ok } = await response.json();
        if (ok) {
          row.remove();
          toastMessage(`Backup ${row.id} was deleted`, "info");
        } else {
          row.classList.remove("table-danger");
          row.classList.remove("wait");
          toastMessage("Error while removing backup", "danger");
        }
      }
    };
  }
};

document.querySelectorAll("button.res").forEach(initResButton);
document.querySelectorAll("button.down").forEach(initDownButton);
document.querySelectorAll("button.del").forEach(initDelButton);

document.querySelectorAll("button.new").forEach((button) => {
  button.onclick = async () => {
    const name = button.id.replace(/^new-/, "");
    const response = await post("/api/new", { name });
    const { filename } = await response.json();

    if (!filename) {
      toastMessage("Error, unable to create new backup", "danger");
      return;
    }

    const tableBody = document.querySelector(`table#table-${name} > tbody`);
    const row = document.createElement("tr");
    row.id = `${name}/${filename}`;
    row.className = "table-info wait";
    row.innerHTML = `<td>Creating backup, please wait...</td><td>now</td><td></td><td></td>`;
    tableBody.prepend(row);

    const checkBackup = async () => {
      const response = await post("/api/check", {
        path: `${name}/${filename}`,
      });
      const { ready, ...file } = await response.json();
      if (ready) {
        row.innerHTML = `<td>${file.name}</td><td>${file.date}</td><td>${file.size}</td><td>${buttons}</td>`;
        row.classList.remove("table-info");
        row.classList.remove("wait");

        initResButton(row.querySelector("button.res"));
        initDownButton(row.querySelector("button.down.sql"));
        initDownButton(row.querySelector("button.down.dump"));
        initDelButton(row.querySelector("button.del"));

        toastMessage(
          `Database ${name} successfully backed up as ${file.name}`,
          "success"
        );
      } else {
        setTimeout(checkBackup, 3_000);
      }
    };

    setTimeout(checkBackup, 5_000);
  };
});

document.querySelector("a#logout").onclick = () => {
  return confirm("Logout?");
};

const handleNavigation = () => {
  const link =
    document.querySelector(
      `a.nav-link#link-${window.location.hash.substring(1)}`
    ) || document.querySelector(`a.nav-link`);
  const currentName = link.id.replace(/^link-/, "");

  document
    .querySelectorAll("a.nav-link")
    .forEach((link) => link.classList.remove("active"));
  link.classList.add("active");
  document
    .querySelectorAll("div.backup")
    .forEach((link) => (link.style.display = "none"));
  document.querySelector(`div#${currentName}`).style.display = "block";
};

handleNavigation();

window.addEventListener("hashchange", handleNavigation, false);
