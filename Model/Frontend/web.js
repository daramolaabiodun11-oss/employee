const formSearch= document.querySelector(".form");

const FirstError = document.querySelector(".FirstError");
const LastError = document.querySelector(".LastError");
const EmailError = document.querySelector(".EmailError");
const AgeError = document.querySelector(".AgeError");
const PasswordError = document.querySelector(".PasswordError");
const employeeError = document.querySelector(".employeeError");

function clearErrors() {
  document.querySelector(".FirstError").textContent = "";
  document.querySelector(".LastError").textContent = "";
  document.querySelector(".EmailError").textContent = "";
  document.querySelector(".AgeError").textContent = "";
  document.querySelector(".PasswordError").textContent = "";
  document.querySelector(".employeeError").textContent = "";
}

function getErrors(errors = {}) {
  if (errors.fullname) FirstError.textContent = errors.fullname;

  if (errors.email) LastError.textContent = errors.email;

  if (errors.age) EmailError.textContent = errors.age;

  if (errors.department) AgeError.textContent = errors.department;

  if (errors.position) PasswordError.textContent = errors.position;

   if (errors.employeeid) employeError.textContent = errors.employeeid;
}





const addBtn= document.querySelector(".addBtn");
const overlay= document.querySelector(".overlay");
const removeBtn= document.querySelector(".removeBtn");

addBtn.addEventListener("click",()=>{
  overlay.classList.add("show")
})

removeBtn.addEventListener("click",()=>{
  overlay.classList.remove("show")
})

overlay.addEventListener("click",(e)=>{
   if(overlay === e.target ){
     overlay.classList.remove("show")
   }
})





let state = {
  mode: "create",
  editId: null,
};

const formEmp= document.querySelector(".formEmp")

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
    employeeid: formdata.get("employeeid")
  };
  
  try {
    let res;

    if (state.mode === "edit") {
      res = await fetch(`http://localhost:3000/employee/update/${state.editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

    } 
    else {
      res = await fetch("http://localhost:3000/employee/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
    }
    const result = await res.json();
    const errorDiv = document.querySelector(".error");

    if (!res.ok) {
      getErrors(result.errors);
      return;
    }

   
    formEmp.reset();
    overlay.classList.remove("show");
    state.mode= "create";
    state.editId= null;
    fetchEmployee();
    
  }
   catch (error) {
    console.log(error.message);
  }
});







formSearch.addEventListener("submit", async(e)=>{
     e.preventDefault();

const search= document.querySelector(".search").value;
  
    try{
  const res= await fetch(`http://localhost:3000/employee/filter?search=${search}`)
  const datas= await res.json();

   const post = document.querySelector(".result");
    post.innerHTML = "";


  datas.employee.forEach(result =>{
       
      const intials= result.fullname.split(" ").map(word => word[0]).join("").toUpperCase()
      const div = document.createElement("div");
      div.className= "two"
      div.innerHTML = `
       <p>${result.employeeid}</p>

            <div class="name">
                <div>${intials}</div>
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
  const deleteBtn = div.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", () => {
        deleteUser(result._id);
      });

      const editBtn = div.querySelector(".editBtn");
      editBtn.addEventListener("click", () => {
        overlay.classList.add("show");
        editUser(result);
      });
  post.appendChild(div)
  })
 document.querySelector(".search").value= "";
  
    }
    catch(error){
    console.log(error.message)
    }

})








const fetchEmployee = async () => {
  try {
    const res = await fetch("http://localhost:3000/employee/");
    const results = await res.json();

    const post = document.querySelector(".result");
    post.innerHTML = "";

    results.employee.forEach((result) => {

      const intials= result.fullname.split(" ").map(word => word[0]).join("").toUpperCase()
      const div = document.createElement("div");
      div.className= "two"
      div.innerHTML += `
       <p>${result.employeeid}</p>

            <div class="name">
                <div>${intials}</div>
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
   const deleteBtn = div.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", () => {
        deleteUser(result._id);
      });

      const editBtn = div.querySelector(".editBtn");
      editBtn.addEventListener("click", () => {
        overlay.classList.add("show");
        editUser(result);
      });

      post.appendChild(div);
    });
  } catch (error) {
    console.log(error.message);
  }
};


async function deleteUser(id) {
  try {
    await fetch(`http://localhost:3000/employee/delete/${id}`, {
      method: "DELETE",
    });

    fetchEmployee();
  } catch (error) {
    console.log(error.message);
  }
}

function editUser(user) {
  state.mode = "edit";
  state.editId = user._id;

  formEmp.fullname.value = user.fullname;
  formEmp.email.value = user.email;
  formEmp.age.value = user.age;
  formEmp.department.value = user.department;
  formEmp.position.value = user.position;
  formEmp.employeeid.value = user.employeeid;

 
  
   formEmp.scrollIntoView({
    behavior: "smooth",
  })
}

fetchEmployee()

















