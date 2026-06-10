const API_URL = "https://employee-wvpl.onrender.com/employee";

// ---------------- ERRORS ----------------
const FirstError = document.querySelector(".FirstError");
const LastError = document.querySelector(".LastError");
const EmailError = document.querySelector(".EmailError");
const AgeError = document.querySelector(".AgeError");
const PasswordError = document.querySelector(".PasswordError");
const employeeError = document.querySelector(".employeeError");

function clearErrors() {
  FirstError.textContent = "";
  LastError.textContent = "";
  EmailError.textContent = "";
  AgeError.textContent = "";
  PasswordError.textContent = "";
  employeeError.textContent = "";
}

function getErrors(errors = {}) {
  if (errors.fullname) FirstError.textContent = errors.fullname;
  if (errors.email) EmailError.textContent = errors.email;
  if (errors.age) AgeError.textContent = errors.age;
  if (errors.department) LastError.textContent = errors.department;
  if (errors.position) PasswordError.textContent = errors.position;
  if (errors.employeeid) employeeError.textContent = errors.employeeid;
}

// ---------------- OVERLAY ----------------
const addBtn = document.querySelector(".addBtn");
const overlay = document.querySelector(".overlay");
const removeBtn = document.querySelector(".removeBtn");

addBtn.addEventListener("click", () => {
  overlay.classList.add("show");
});

removeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.classList.remove("show");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("show");
  }
});

// ---------------- STATE ----------------
let state = {
  mode: "create",
  editId: null,
};

// ---------------- FORM SUBMIT ----------------
const formEmp = document.querySelector(".formEmp");

formEmp.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const formdata = new FormData(formEmp);

  const data = {
    fullname: formdata.get("fullname"),
    email: formdata.get("email"),
    age: Number(formdata.get("age")),
    department: formdata.get("department"),
    position: formdata.get("position"),
    employeeid: formdata.get("employeeid"),
  };

  try {
    let res;

    if (state.mode === "edit") {
      res = await fetch(`${API_URL}/update/${state.editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const result = await res.json();

    if (!res.ok) {
      getErrors(result.errors || {});
      return;
    }

    formEmp.reset();
    overlay.classList.remove("show");

    state.mode = "create";
    state.editId = null;

    fetchEmployee();
  } catch (error) {
    console.log(error.message);
  }
});

// ---------------- SEARCH ----------------
const formSearch = document.querySelector(".form");

formSearch.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchInput = document.querySelector(".search");
  const search = searchInput.value.trim();

  try {
    const res = await fetch(`${API_URL}/filter?search=${search}`);
    const datas = await res.json();

    const post = document.querySelector(".result");
    post.innerHTML = "";

    const employees = datas.employee || [];

    if (employees.length === 0) {
      post.innerHTML = "<p>No employees found</p>";
      return;
    }

    employees.forEach((result) => {
      renderEmployee(result, post);
    });

    searchInput.value = "";
  } catch (error) {
    console.log(error.message);
  }
});

// ---------------- FETCH ALL ----------------
const fetchEmployee = async () => {
  try {
    const res = await fetch(`${API_URL}`);
    const results = await res.json();

    const post = document.querySelector(".result");
    post.innerHTML = "";

    const employees = results.employee || [];

    employees.forEach((result) => {
      renderEmployee(result, post);
    });
  } catch (error) {
    console.log(error.message);
  }
};

// ---------------- RENDER FUNCTION ----------------
function renderEmployee(result, post) {
  const initials = result.fullname
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const div = document.createElement("div");
  div.className = "two";

  div.innerHTML = `
    <p>${result.employeeid}</p>

    <div class="name">
      <div>${initials}</div>
      <p>${result.fullname}</p>
    </div>

    <p>${result.email}</p>
    <p>${result.age}</p>
    <p>${result.department}</p>
    <p>${result.position}</p>

    <div class="action">
      <i class="fa-solid fa-pen-to-square editBtn"></i>
      <i class="fa-solid fa-trash deleteBtn"></i>
    </div>
  `;

  div.querySelector(".deleteBtn").addEventListener("click", () => {
    deleteUser(result._id);
  });

  div.querySelector(".editBtn").addEventListener("click", () => {
    overlay.classList.add("show");
    editUser(result);
  });

  post.appendChild(div);
}

// ---------------- DELETE ----------------
async function deleteUser(id) {
  try {
    await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
    });

    fetchEmployee();
  } catch (error) {
    console.log(error.message);
  }
}

// ---------------- EDIT ----------------
function editUser(user) {
  state.mode = "edit";
  state.editId = user._id;

  formEmp.fullname.value = user.fullname;
  formEmp.email.value = user.email;
  formEmp.age.value = user.age;
  formEmp.department.value = user.department;
  formEmp.position.value = user.position;
  formEmp.employeeid.value = user.employeeid;

  formEmp.scrollIntoView({ behavior: "smooth" });
}

// ---------------- INIT ----------------
fetchEmployee();