const apiURL="http://localhost:5000/students";

let input1 = document.getElementById("admno");
let input2 = document.getElementById("name");
let input3 = document.getElementById("score");
let button = document.getElementById("btn");

 let students=[]
let editingIndex=null
async function loadStudents() {
  const res =await fetch(apiURL)
  const students=await res.json()
  renderStudents()
}
loadStudents()
//addding students

async function addStudent() {
  if (
    input1.value.trim() === "" ||
    input2.value.trim() === "" ||
    input3.value.trim() === ""
  )
    return; //prevent empty inputs

  let name = input2.value.trim(); //remove any spaces
  let score = Number(input3.value.trim());
  let admission = String(input1.value.trim());

  // allow only alphabets and spaces
  if (!/^[A-Za-z\s]+$/.test(name)) {
    alert("Name should only contain letters.");
    return;
  }

  // Admission must be exactly 5 digits
  if (admission.length !== 5 || isNaN(admission)) {
    alert("Admission number must be exactly 5 digits");
    return; // stop adding student
  }

  // Validate score
  if (score < 0 || score > 100) {
    alert("Score must be between 0 and 100.");
    return;
  }
  const studentData={admno:admission,name,score}
  if(editingIndex===null){
    //add new student
   await fetch(apiURL,{
   method:"POST",
   headers:{"content-Type":"application/json"},
   body:JSON.stringify(newStudent)
    
  
})
  }else{
   // ✏️ Update existing student
    await fetch(`${apiURL}/${students[editingIndex].admno}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData)
      
    });
    input1.disabled = false;

    editingIndex = null;
    button.innerText = "Add Student";
  }


  //send data to backend
  const newStudent={
    admno:admission,
    name,
    score
  }

  
  input1.value = "";
  input2.value = "";
  input3.value = "";
  loadStudents(); //reload table
}

button.addEventListener("click", addStudent);

function renderStudents() {
  let tbody = document.getElementById("tablebody");
  tbody.innerHTML = ""; //clear existing rows

  //looping through students array and creating rows
  students.forEach((student, index) => {
    let tr = document.createElement("tr");
    //Admission number cell
    let admnotd = document.createElement("td");
    admnotd.innerText = student.admno;
    tr.appendChild(admnotd);
    //name the cell
    let nametd = document.createElement("td");
    nametd.innerText = student.name;
    tr.appendChild(nametd);
    //score cell
    let scoretd = document.createElement("td");
    scoretd.innerText = student.score;
    tr.appendChild(scoretd);
   

    //Action cell -delete button
    let actiontd = document.createElement("td");
    let deletebtn = document.createElement("button");
    deletebtn.innerText = "Delete";
    deletebtn.addEventListener("click", async () => {
      //Confirm before deleting student
  if (confirm(`Are you sure you want to delete ${student.name}?`)) {
    await fetch(`${apiURL}/${student.name}`, { method: "DELETE" });
    loadStudents(); // refresh
  }
});
let editbtn = document.createElement("button");
editbtn.innerText = "Edit";
editbtn.addEventListener("click", () => {
  input1.value = student.admno;
  input2.value = student.name;
  input3.value = student.score;
  input1.disabled=true;
  editingIndex = index;
  button.innerText = "Update Student";
});
actiontd.append(deletebtn,editbtn);


   
    tr.appendChild(actiontd);

    //add row to table
    tbody.appendChild(tr);
  });
}
loadStudents();

document.addEventListener("keydown", (e) => {
  //when you press enter the addStudent() executes
  if (e.key === "Enter") addStudent();
});
//Added arrow keys to navigate swiftly
let inputs = [
  document.getElementById("admno"),
  document.getElementById("name"),
  document.getElementById("score"),
  document.getElementById("btn"),
];

inputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault(); // prevent cursor moving inside inputs
      if (index + 1 < inputs.length) {
        inputs[index + 1].focus();
      }
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (index - 1 >= 0) {
        inputs[index - 1].focus();
      }
    }
  });
});
